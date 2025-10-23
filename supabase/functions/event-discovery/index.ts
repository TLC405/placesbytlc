import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use AI to discover OKC events
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an event discovery agent for Oklahoma City. Generate a list of upcoming events, concerts, festivals, sports games, and date-worthy happenings in OKC.

Output ONLY valid JSON with this structure:
{
  "events": [
    {
      "name": "Event Name",
      "type": "concert|festival|sports|art|food",
      "venue": "Venue Name",
      "address": "Full Address",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "description": "Brief description",
      "price_range": "$|$$|$$$|$$$$",
      "url": "https://..."
    }
  ]
}`
          },
          {
            role: 'user',
            content: `Find upcoming events in Oklahoma City between ${today} and ${nextWeek}. Include Thunder games, concerts at Paycom Center, events in Bricktown/Plaza District/Paseo, art galleries, food festivals, and unique date activities.`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', await aiResponse.text());
      return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { events: [] };
    }

    // Store events in cache
    if (result.events) {
      for (const event of result.events) {
        // Check if event already exists
        const { data: existing } = await supabase
          .from('okc_events_cache')
          .select('id')
          .eq('event_name', event.name)
          .eq('event_date', event.date)
          .single();

        if (!existing) {
          await supabase.from('okc_events_cache').insert({
            event_name: event.name,
            event_type: event.type,
            venue_name: event.venue,
            venue_address: event.address,
            event_date: event.date,
            event_time: event.time,
            description: event.description,
            price_range: event.price_range,
            url: event.url,
          });
        }
      }
    }

    // Fetch all upcoming events
    const { data: upcomingEvents } = await supabase
      .from('okc_events_cache')
      .select('*')
      .gte('event_date', today)
      .order('event_date', { ascending: true });

    return new Response(JSON.stringify({ events: upcomingEvents }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
