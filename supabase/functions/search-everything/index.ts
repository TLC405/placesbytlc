import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CATEGORY_MAP: Record<string, { tmClassification: string; tmKeywords: string[]; aiPrompt: string }> = {
  music: { tmClassification: "Music", tmKeywords: ["concert", "live music", "band"], aiPrompt: "Best live music venues, concerts, and music events in OKC" },
  sports: { tmClassification: "Sports", tmKeywords: ["game", "match", "tournament"], aiPrompt: "Best sports events, games, and athletic activities in OKC" },
  food: { tmClassification: "", tmKeywords: ["food", "restaurant", "dining"], aiPrompt: "Best restaurants, food trucks, brunch spots, and dining experiences in OKC" },
  nightlife: { tmClassification: "", tmKeywords: ["bar", "club", "nightlife"], aiPrompt: "Best bars, clubs, lounges, and nightlife spots in OKC" },
  arts: { tmClassification: "Arts & Theatre", tmKeywords: ["art", "theatre", "gallery"], aiPrompt: "Best art galleries, theatre shows, museums, and cultural events in OKC" },
  outdoor: { tmClassification: "", tmKeywords: ["park", "hiking", "outdoor"], aiPrompt: "Best outdoor activities, parks, trails, and nature spots in OKC" },
  comedy: { tmClassification: "Arts & Theatre", tmKeywords: ["comedy", "standup", "improv"], aiPrompt: "Best comedy shows, standup nights, and improv events in OKC" },
  family: { tmClassification: "Family", tmKeywords: ["family", "kids", "children"], aiPrompt: "Best family-friendly activities, kids events, and fun outings in OKC" },
  fitness: { tmClassification: "", tmKeywords: ["fitness", "gym", "yoga", "run"], aiPrompt: "Best fitness classes, yoga studios, gyms, and wellness activities in OKC" },
  shopping: { tmClassification: "", tmKeywords: ["shopping", "market", "boutique"], aiPrompt: "Best shopping destinations, markets, boutiques, and vintage stores in OKC" },
  wellness: { tmClassification: "", tmKeywords: ["spa", "wellness", "meditation"], aiPrompt: "Best spas, wellness centers, and relaxation spots in OKC" },
  datenight: { tmClassification: "", tmKeywords: ["romantic", "date", "dinner"], aiPrompt: "Best romantic date night ideas, couples activities, and intimate dining in OKC" },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, category, mode, lat, lng, budget, time_of_day, vibe } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);
    const tmKey = Deno.env.get('TICKETMASTER_API_KEY');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');

    const searchLower = (query || '').toLowerCase().trim();
    const tmLat = lat || 35.4676;
    const tmLng = lng || -97.5164;
    const catConfig = category ? CATEGORY_MAP[category] : null;
    const effectiveMode = mode || (searchLower ? 'search' : 'browse');

    // 1. Search discovered_places
    let placesQuery = supabase.from('discovered_places').select('*').order('name').limit(50);
    if (searchLower) {
      placesQuery = placesQuery.or(`name.ilike.%${searchLower}%,description.ilike.%${searchLower}%,category.ilike.%${searchLower}%,discovery_context.ilike.%${searchLower}%`);
    }
    if (category && !searchLower) {
      // Browse by category
      const keywords = catConfig?.tmKeywords || [category];
      const orClauses = keywords.map(k => `category.ilike.%${k}%,description.ilike.%${k}%,discovery_context.ilike.%${k}%`).join(',');
      placesQuery = supabase.from('discovered_places').select('*').or(orClauses).order('name').limit(50);
    }
    const { data: places } = await placesQuery;

    // 2. Search events (upcoming)
    const now = new Date().toISOString();
    let eventsQuery = supabase
      .from('events')
      .select('*, venues(name, city, address, lat, lng), organizers(id, name)')
      .gte('starts_at', now)
      .eq('status', 'active')
      .order('starts_at')
      .limit(50);
    if (searchLower) {
      eventsQuery = eventsQuery.or(`title.ilike.%${searchLower}%,description.ilike.%${searchLower}%`);
    }
    const { data: dbEvents } = await eventsQuery;

    // Filter by tags in JS since .or with array contains is tricky
    let filteredEvents = dbEvents || [];
    if (searchLower && catConfig) {
      const tagKeywords = catConfig.tmKeywords;
      filteredEvents = (dbEvents || []).filter((e: any) => {
        const titleMatch = e.title?.toLowerCase().includes(searchLower) || e.description?.toLowerCase().includes(searchLower);
        const tagMatch = (e.tags || []).some((t: string) => tagKeywords.some(k => t.toLowerCase().includes(k)));
        return titleMatch || tagMatch;
      });
      // If filtering reduced too much, keep all
      if (filteredEvents.length < 3) filteredEvents = dbEvents || [];
    }

    // 3. Ticketmaster — fire multiple queries for broader coverage
    let liveEvents: any[] = [];
    if (tmKey) {
      try {
        const tmQueries: string[] = [];

        if (effectiveMode === 'browse' && !searchLower) {
          // Browse mode: broad query for the area
          if (catConfig?.tmClassification) {
            tmQueries.push(`classificationName=${encodeURIComponent(catConfig.tmClassification)}`);
          } else {
            // No classification — just get everything upcoming
            tmQueries.push('');
          }
        } else if (searchLower) {
          // Search mode: keyword + classification if available
          tmQueries.push(`keyword=${encodeURIComponent(query)}`);
          if (catConfig?.tmClassification) {
            tmQueries.push(`classificationName=${encodeURIComponent(catConfig.tmClassification)}`);
          }
        }

        // If no queries built, do a general browse
        if (tmQueries.length === 0) tmQueries.push('');

        const fetchTM = async (extra: string) => {
          const base = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${tmKey}&latlong=${tmLat},${tmLng}&radius=60&unit=miles&size=50&sort=date,asc`;
          const url = extra ? `${base}&${extra}` : base;
          const res = await fetch(url);
          if (!res.ok) return [];
          const data = await res.json();
          return (data?._embedded?.events || []).map((ev: any) => {
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
        };

        const results = await Promise.all(tmQueries.map(q => fetchTM(q)));
        const seen = new Set<string>();
        for (const batch of results) {
          for (const ev of batch) {
            if (!seen.has(ev.id)) { seen.add(ev.id); liveEvents.push(ev); }
          }
        }
      } catch (err) {
        console.error('Ticketmaster error:', err);
      }
    }

    // 4. Search venues
    let venuesQuery = supabase.from('venues').select('*').order('name').limit(30);
    if (searchLower) {
      venuesQuery = venuesQuery.or(`name.ilike.%${searchLower}%,address.ilike.%${searchLower}%,city.ilike.%${searchLower}%`);
    }
    const { data: venues } = await venuesQuery;

    // 5. AI enrichment — ALWAYS run for richer results
    let aiSuggestions: any[] = [];
    let vibeResults: any = null;
    let dateItinerary: any = null;
    let hiddenGems: any[] = [];

    if (lovableKey) {
      try {
        let aiPrompt = '';

        if (effectiveMode === 'vibe' && vibe) {
          aiPrompt = `The user described their vibe as: "${vibe}". Suggest 5-8 real OKC places, events, or activities that match this mood/energy. Return JSON: { "suggestions": [{ "name": "...", "type": "place|activity|event", "description": "...", "address": "approximate address in OKC", "why": "why this matches the vibe", "vibe_match": 0-100 }] }`;
        } else if (effectiveMode === 'date-builder') {
          aiPrompt = `Build a complete date night itinerary in OKC. Vibe: ${vibe || 'romantic'}. Budget: ${budget || 'moderate'}. Time: ${time_of_day || 'evening'}. Include 3-4 stops with real OKC places. Return JSON: { "itinerary": [{ "order": 1, "name": "...", "type": "dinner|drinks|activity|dessert", "description": "...", "address": "...", "estimated_cost": "$XX", "duration": "1 hour", "tip": "insider tip" }], "total_estimated_cost": "$XX", "theme": "..." }`;
        } else if (effectiveMode === 'hidden-gems') {
          aiPrompt = `Suggest 5-8 underrated, hidden gem spots in OKC that most people don't know about. Include unique restaurants, secret bars, lesser-known parks, indie shops. Return JSON: { "gems": [{ "name": "...", "type": "place|activity", "description": "...", "address": "...", "why_hidden": "why this is a hidden gem", "insider_tip": "..." }] }`;
        } else {
          // Standard search/browse — always enrich
          const context = catConfig?.aiPrompt || (searchLower ? `Search: "${query}"` : "Popular things to do in OKC right now");
          aiPrompt = `You are a local OKC expert. ${context}. Suggest 5-8 real OKC places or activities. Return JSON: { "suggestions": [{ "name": "...", "type": "place|activity|event", "description": "...", "address": "approximate address in OKC", "why": "why this is great" }] }`;
        }

        const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${lovableKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-lite',
            messages: [
              { role: 'system', content: 'You are an expert on Oklahoma City. Always return valid JSON only, no markdown.' },
              { role: 'user', content: aiPrompt }
            ],
            temperature: 0.7,
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const content = aiData.choices?.[0]?.message?.content || '';
          try {
            const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            if (effectiveMode === 'date-builder') {
              dateItinerary = parsed;
            } else if (effectiveMode === 'hidden-gems') {
              hiddenGems = parsed.gems || [];
            } else {
              aiSuggestions = parsed.suggestions || [];
            }
          } catch { /* ignore parse errors */ }
        }
      } catch (err) {
        console.error('AI error:', err);
      }
    }

    // Deduplicate live events already in DB
    const dbEventIds = new Set((filteredEvents).map((e: any) => e.source_event_id).filter(Boolean));
    const uniqueLiveEvents = liveEvents.filter(e => !dbEventIds.has(e.id.replace('tm_', '')));

    // Live pulse: count events by venue area
    const venuePulse: Record<string, number> = {};
    for (const ev of [...filteredEvents, ...uniqueLiveEvents]) {
      const area = ev.venue_name || ev.venues?.name || 'Unknown';
      venuePulse[area] = (venuePulse[area] || 0) + 1;
    }
    const livePulse = Object.entries(venuePulse)
      .map(([venue, count]) => ({ venue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const result = {
      places: places || [],
      events: filteredEvents,
      live_events: uniqueLiveEvents,
      venues: venues || [],
      ai_suggestions: aiSuggestions,
      hidden_gems: hiddenGems,
      date_itinerary: dateItinerary,
      live_pulse: livePulse,
      total: (places?.length || 0) + filteredEvents.length + uniqueLiveEvents.length + (venues?.length || 0),
      query: query || '',
      mode: effectiveMode,
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
