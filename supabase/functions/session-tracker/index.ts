import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { action, sessionId, data } = await req.json();

    // Get IP address and user agent
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (action === 'start') {
      // Get location data from IP
      let locationData = {};
      try {
        const ipResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`);
        if (ipResponse.ok) {
          locationData = await ipResponse.json();
        }
      } catch (e) {
        console.error('Failed to fetch location:', e);
      }

      // Create new session
      const { data: session, error: sessionError } = await supabaseClient
        .from('user_sessions')
        .insert({
          user_id: user.id,
          ip_address: ipAddress,
          user_agent: userAgent,
          device_info: data?.deviceInfo || {},
          location_info: locationData,
          fingerprint: data?.fingerprint,
          is_active: true
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Update or create IP history
      const { data: existingIp } = await supabaseClient
        .from('ip_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('ip_address', ipAddress)
        .single();

      if (existingIp) {
        await supabaseClient
          .from('ip_history')
          .update({
            last_seen: new Date().toISOString(),
            visit_count: existingIp.visit_count + 1,
            location_data: locationData
          })
          .eq('id', existingIp.id);
      } else {
        await supabaseClient
          .from('ip_history')
          .insert({
            user_id: user.id,
            ip_address: ipAddress,
            location_data: locationData,
            visit_count: 1
          });
      }

      return new Response(
        JSON.stringify({ success: true, sessionId: session.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'update') {
      // Update session activity
      await supabaseClient
        .from('user_sessions')
        .update({
          last_activity: new Date().toISOString(),
          pages_visited: data?.pagesVisited || 0
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'end') {
      // End session
      const { data: sessionData } = await supabaseClient
        .from('user_sessions')
        .select('session_start')
        .eq('id', sessionId)
        .single();

      if (sessionData) {
        const duration = Math.floor((Date.now() - new Date(sessionData.session_start).getTime()) / 1000);
        
        await supabaseClient
          .from('user_sessions')
          .update({
            session_end: new Date().toISOString(),
            is_active: false,
            total_duration: duration
          })
          .eq('id', sessionId);

        // Update user analytics
        const { data: analytics } = await supabaseClient
          .from('user_analytics')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (analytics) {
          const newTotalTime = analytics.total_time_spent + duration;
          const newAvgDuration = Math.floor(newTotalTime / (analytics.total_sessions + 1));
          
          await supabaseClient
            .from('user_analytics')
            .update({
              total_time_spent: newTotalTime,
              average_session_duration: newAvgDuration,
              total_page_views: analytics.total_page_views + (data?.pagesVisited || 0)
            })
            .eq('user_id', user.id);
        }
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});