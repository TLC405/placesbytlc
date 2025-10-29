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
    
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { type, context } = await req.json();

    // Fetch user preferences and activity
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .order('confidence_score', { ascending: false });

    const { data: recentActivity } = await supabase
      .from('user_activity_log')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(50);

    // Build AI context
    const userContext = {
      preferences: preferences || [],
      recentActivity: recentActivity || [],
      context: context || {}
    };

    // Call AI to generate recommendations
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
            content: `You are an intelligent recommendation engine. Analyze user behavior patterns and generate personalized suggestions.
            
Your task: Generate ${type} recommendations based on user data.

Output ONLY valid JSON with this structure:
{
  "recommendations": [
    {
      "type": "place|event|itinerary",
      "data": {...relevant data...},
      "confidence": 0.0-1.0,
      "reason": "brief explanation"
    }
  ],
  "learnings": [
    {
      "preference_type": "place_type|price_range|etc",
      "preference_value": "value",
      "confidence": 0.0-1.0
    }
  ]
}`
          },
          {
            role: 'user',
            content: `User Context: ${JSON.stringify(userContext, null, 2)}
            
Generate ${type} recommendations for Oklahoma City. Be specific and actionable.`
          }
        ],
        temperature: 0.7,
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
    
    // Parse AI response
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // If AI returns text, wrap it
      result = { recommendations: [], learnings: [] };
    }

    // Store recommendations
    if (result.recommendations) {
      for (const rec of result.recommendations) {
        await supabase.from('ai_recommendations').insert({
          user_id: user.id,
          recommendation_type: rec.type,
          recommendation_data: rec.data,
          confidence_score: rec.confidence,
          reason: rec.reason,
        });
      }
    }

    // Update user preferences
    if (result.learnings) {
      for (const learning of result.learnings) {
        const { data: existing } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .eq('preference_type', learning.preference_type)
          .eq('preference_value', learning.preference_value)
          .single();

        if (existing) {
          await supabase
            .from('user_preferences')
            .update({
              confidence_score: Math.min(1, existing.confidence_score + 0.1),
              interaction_count: existing.interaction_count + 1,
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('user_preferences').insert({
            user_id: user.id,
            preference_type: learning.preference_type,
            preference_value: learning.preference_value,
            confidence_score: learning.confidence,
            learned_from: 'pattern',
          });
        }
      }
    }

    return new Response(JSON.stringify(result), {
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
