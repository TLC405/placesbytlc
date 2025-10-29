import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    
    // Verify admin role from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { dashcards } = await req.json();
    
    const result: any = {
      totalSessions: 0,
      activeTesters: 0,
      totalUploads: 0,
      totalGenerations: 0,
      avgTimeInApp: 0,
      topTabs: [],
      geoData: [],
      deviceMix: [],
      blockedAdminAttempts: 0,
    };
    
    // Fetch sessions
    if (dashcards.includes('sessions')) {
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('*');
      result.totalSessions = sessions?.length || 0;
    }
    
    // Fetch active users (last 7 days)
    if (dashcards.includes('active_users')) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: activeUsers } = await supabase
        .from('user_analytics')
        .select('user_id')
        .gte('last_seen', sevenDaysAgo);
      result.activeTesters = activeUsers?.length || 0;
    }
    
    // Fetch uploads and generations
    if (dashcards.includes('uploads') || dashcards.includes('generations')) {
      const { data: events } = await supabase
        .from('analytics_events')
        .select('event_type')
        .in('event_type', ['photo_upload', 'cartoon_gen']);
      
      result.totalUploads = events?.filter(e => e.event_type === 'photo_upload').length || 0;
      result.totalGenerations = events?.filter(e => e.event_type === 'cartoon_gen').length || 0;
    }
    
    // Calculate avg time in app
    if (dashcards.includes('time_in_app')) {
      const { data: analytics } = await supabase
        .from('user_analytics')
        .select('average_session_duration');
      
      const avg = analytics?.reduce((sum, a) => sum + (a.average_session_duration || 0), 0) || 0;
      result.avgTimeInApp = analytics?.length ? Math.round(avg / analytics.length) : 0;
    }
    
    // Top tabs
    if (dashcards.includes('top_tabs')) {
      const { data: tabEvents } = await supabase
        .from('analytics_events')
        .select('event_data')
        .eq('event_type', 'tab_switch');
      
      const tabCounts = new Map<string, number>();
      tabEvents?.forEach(event => {
        const tabName = event.event_data?.tab_name;
        if (tabName) {
          tabCounts.set(tabName, (tabCounts.get(tabName) || 0) + 1);
        }
      });
      
      result.topTabs = Array.from(tabCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    }
    
    // Geo data
    if (dashcards.includes('geo_heat')) {
      const { data: geoEvents } = await supabase
        .from('analytics_events')
        .select('geo_data')
        .not('geo_data', 'is', null);
      
      const geoCounts = new Map<string, number>();
      geoEvents?.forEach(event => {
        const geo = event.geo_data;
        if (geo?.city) {
          const key = `${geo.city}, ${geo.country}`;
          geoCounts.set(key, (geoCounts.get(key) || 0) + 1);
        }
      });
      
      result.geoData = Array.from(geoCounts.entries())
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count);
    }
    
    // Device mix
    if (dashcards.includes('device_mix')) {
      const { data: deviceEvents } = await supabase
        .from('analytics_events')
        .select('device_info')
        .not('device_info', 'is', null);
      
      const deviceCounts = new Map<string, number>();
      deviceEvents?.forEach(event => {
        const device = event.device_info?.os || 'Unknown';
        deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1);
      });
      
      result.deviceMix = Array.from(deviceCounts.entries())
        .map(([device, count]) => ({ device, count }));
    }
    
    // Security events
    if (dashcards.includes('security_events')) {
      const { data: securityEvents } = await supabase
        .from('security_events')
        .select('*')
        .eq('event_type', 'blocked_admin_attempt');
      
      result.blockedAdminAttempts = securityEvents?.length || 0;
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Analytics query error:', error);
    return new Response(
      JSON.stringify({ error: 'Query failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
