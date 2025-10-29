import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, query, lat, lng } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check cache first
    const { data: cached } = await supabase
      .from('discovered_places')
      .select('*')
      .ilike('city', `%${city}%`);

    if (cached && cached.length > 5) {
      console.log('Returning cached places:', cached.length);
      return new Response(
        JSON.stringify({ places: cached.slice(0, 20) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Discovering new places with AI for:', city, query);

    // Use AI to discover date spots from web sources
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
            content: `You are a local date spot discovery expert. Search Reddit, forums, and social media to find real couple date spots in the specified city. Focus on:
- Hidden gems mentioned by locals
- Romantic restaurants with good reviews
- Unique activities for couples
- Places with active social media presence

Return ONLY valid JSON array of places. Each place must have: name, address, category (food/activity/entertainment), description, why it's good for couples.`
          },
          {
            role: 'user',
            content: `Find 10 real date spots in ${city} ${query ? `matching: ${query}` : 'for couples'}. Search Reddit and forums for local recommendations. Return as JSON array.`
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_discovered_places',
            description: 'Return discovered date spots',
            parameters: {
              type: 'object',
              properties: {
                places: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      address: { type: 'string' },
                      category: { type: 'string', enum: ['food', 'activity', 'entertainment', 'both'] },
                      description: { type: 'string' },
                      why_couples: { type: 'string' }
                    },
                    required: ['name', 'address', 'category', 'description']
                  }
                }
              },
              required: ['places']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'return_discovered_places' } }
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to discover places' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const discoveredPlaces = toolCall?.function?.arguments ? 
      JSON.parse(toolCall.function.arguments).places : [];

    console.log('AI discovered places:', discoveredPlaces.length);

    // Store discovered places
    const placesToStore = discoveredPlaces.map((place: any) => ({
      place_id: `${place.name.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase()}`,
      name: place.name,
      address: place.address,
      city: city,
      category: place.category,
      description: place.description,
      discovery_context: place.why_couples || '',
      facebook_verified: false
    }));

    if (placesToStore.length > 0) {
      const { error } = await supabase
        .from('discovered_places')
        .upsert(placesToStore, { onConflict: 'place_id' });

      if (error) {
        console.error('Error storing places:', error);
      }
    }

    return new Response(
      JSON.stringify({ places: placesToStore }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in discover-date-spots:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
