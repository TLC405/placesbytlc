import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, category, lat, lng } = await req.json();
    if (!query?.trim()) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);
    const tmKey = Deno.env.get('TICKETMASTER_API_KEY');

    const searchLower = query.toLowerCase().trim();

    // 1. Search discovered_places
    const { data: places } = await supabase
      .from('discovered_places')
      .select('*')
      .or(`name.ilike.%${searchLower}%,description.ilike.%${searchLower}%,category.ilike.%${searchLower}%,discovery_context.ilike.%${searchLower}%`)
      .order('name')
      .limit(30);

    // 2. Search events (upcoming)
    const now = new Date().toISOString();
    const { data: dbEvents } = await supabase
      .from('events')
      .select('*, venues(name, city, address, lat, lng), organizers(id, name)')
      .or(`title.ilike.%${searchLower}%,description.ilike.%${searchLower}%`)
      .gte('starts_at', now)
      .eq('status', 'active')
      .order('starts_at')
      .limit(30);

    // 3. Search Ticketmaster live
    let liveEvents: any[] = [];
    if (tmKey) {
      try {
        const tmLat = lat || 35.4676;
        const tmLng = lng || -97.5164;
        const tmUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${tmKey}&keyword=${encodeURIComponent(query)}&latlong=${tmLat},${tmLng}&radius=60&unit=miles&size=20&sort=relevance,desc`;
        
        const tmRes = await fetch(tmUrl);
        if (tmRes.ok) {
          const tmData = await tmRes.json();
          const rawEvents = tmData?._embedded?.events || [];
          liveEvents = rawEvents.map((ev: any) => {
            const venue = ev._embedded?.venues?.[0];
            const priceRanges = ev.priceRanges?.[0];
            const image = ev.images?.find((i: any) => i.ratio === '16_9' && i.width > 500) || ev.images?.[0];
            return {
              id: `tm_${ev.id}`,
              title: ev.name,
              description: ev.info || ev.pleaseNote || null,
              starts_at: ev.dates?.start?.dateTime || ev.dates?.start?.localDate,
              ends_at: ev.dates?.end?.dateTime || null,
              venue_name: venue?.name || null,
              venue_address: venue?.address?.line1 || null,
              venue_city: venue?.city?.name || null,
              venue_lat: venue?.location?.latitude ? parseFloat(venue.location.latitude) : null,
              venue_lng: venue?.location?.longitude ? parseFloat(venue.location.longitude) : null,
              price_min: priceRanges?.min || null,
              price_max: priceRanges?.max || null,
              ticket_url: ev.url || null,
              image_url: image?.url || null,
              tags: ev.classifications?.map((c: any) => c.segment?.name).filter(Boolean) || [],
              source: 'ticketmaster_live',
            };
          });
        }
      } catch (err) {
        console.error('Ticketmaster live search error:', err);
      }
    }

    // 4. Search venues
    const { data: venues } = await supabase
      .from('venues')
      .select('*')
      .or(`name.ilike.%${searchLower}%,address.ilike.%${searchLower}%,city.ilike.%${searchLower}%`)
      .order('name')
      .limit(20);

    // 5. AI-powered suggestions for what the user might be looking for
    let aiSuggestions: any = null;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (lovableKey && places?.length === 0 && (dbEvents?.length || 0) === 0 && liveEvents.length === 0) {
      try {
        const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${lovableKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [{
              role: 'system',
              content: 'You are a local OKC expert. The user searched for something and got no results. Suggest 3-5 real OKC places or activities that match. Return JSON: { "suggestions": [{ "name": "...", "type": "place|activity|event", "description": "...", "address": "approximate address", "why": "why this matches" }] }'
            }, {
              role: 'user',
              content: `Search query: "${query}". Category filter: ${category || 'none'}. Suggest real OKC places/activities.`
            }],
            temperature: 0.7,
          }),
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const content = aiData.choices?.[0]?.message?.content || '';
          try {
            const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            aiSuggestions = JSON.parse(jsonStr);
          } catch { /* ignore parse errors */ }
        }
      } catch (err) {
        console.error('AI suggestion error:', err);
      }
    }

    // Deduplicate live events that are already in DB
    const dbEventIds = new Set((dbEvents || []).map((e: any) => e.source_event_id).filter(Boolean));
    const uniqueLiveEvents = liveEvents.filter(e => !dbEventIds.has(e.id.replace('tm_', '')));

    const result = {
      places: places || [],
      events: dbEvents || [],
      live_events: uniqueLiveEvents,
      venues: venues || [],
      ai_suggestions: aiSuggestions?.suggestions || [],
      total: (places?.length || 0) + (dbEvents?.length || 0) + uniqueLiveEvents.length + (venues?.length || 0),
      query,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ error: 'Search failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
