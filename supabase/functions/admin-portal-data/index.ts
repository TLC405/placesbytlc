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
    const authHeader = req.headers.get('Authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with user's auth for checking permissions
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader! } },
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has admin or moderator role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    const hasAccess = roles?.some(r => r.role === 'admin' || r.role === 'moderator');
    
    if (!hasAccess) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin or moderator access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role client for data access
    const adminClient = createClient(supabaseUrl, serviceKey);
    
    const { detail_user_id } = await req.json().catch(() => ({ detail_user_id: undefined }));

    // Return details for a single user (sessions + ip history)
    if (detail_user_id) {
      const { data: sessions, error: sessionsError } = await adminClient
        .from('user_sessions')
        .select('*')
        .eq('user_id', detail_user_id)
        .order('session_start', { ascending: false })
        .limit(50);

      if (sessionsError) throw sessionsError;

      const { data: ipHistory, error: ipError } = await adminClient
        .from('ip_history')
        .select('*')
        .eq('user_id', detail_user_id)
        .order('last_seen', { ascending: false })
        .limit(100);

      if (ipError) throw ipError;

      return new Response(
        JSON.stringify({ sessions: sessions || [], ip_history: ipHistory || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Summary payload (for dashboards)
    const [{ data: profiles, error: profilesError }, { data: activities, error: activitiesError }, { data: analytics, error: analyticsError }] = await Promise.all([
      adminClient.from('profiles').select('id, email, display_name, created_at').order('created_at', { ascending: false }).limit(1000),
      adminClient.from('user_activity_log').select('*').order('timestamp', { ascending: false }).limit(2000),
      adminClient.from('user_analytics').select(`*, profiles:user_id (email, display_name)`).order('engagement_score', { ascending: false }).limit(1000),
    ]);

    if (profilesError) throw profilesError;
    if (activitiesError) throw activitiesError;
    if (analyticsError) throw analyticsError;

    return new Response(
      JSON.stringify({ profiles, activities: activities || [], analytics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('admin-portal-data error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});