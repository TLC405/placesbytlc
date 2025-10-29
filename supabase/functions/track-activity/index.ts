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

    const { activity_type, activity_data } = await req.json();

    // Log activity
    const { error: logError } = await supabase
      .from('user_activity_log')
      .insert({
        user_id: user.id,
        activity_type,
        activity_data,
      });

    if (logError) throw logError;

    // Update preferences based on activity
    if (activity_type === 'place_save' || activity_type === 'place_view') {
      const placeType = activity_data.types?.[0];
      const priceLevel = activity_data.price_level;

      if (placeType) {
        const { data: existing } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .eq('preference_type', 'place_type')
          .eq('preference_value', placeType)
          .single();

        if (existing) {
          await supabase
            .from('user_preferences')
            .update({
              confidence_score: Math.min(1, existing.confidence_score + 0.05),
              interaction_count: existing.interaction_count + 1,
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('user_preferences').insert({
            user_id: user.id,
            preference_type: 'place_type',
            preference_value: placeType,
            confidence_score: 0.3,
            learned_from: 'interaction',
          });
        }
      }

      if (priceLevel) {
        const { data: existing } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .eq('preference_type', 'price_range')
          .eq('preference_value', priceLevel.toString())
          .single();

        if (existing) {
          await supabase
            .from('user_preferences')
            .update({
              confidence_score: Math.min(1, existing.confidence_score + 0.05),
              interaction_count: existing.interaction_count + 1,
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('user_preferences').insert({
            user_id: user.id,
            preference_type: 'price_range',
            preference_value: priceLevel.toString(),
            confidence_score: 0.3,
            learned_from: 'interaction',
          });
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
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
