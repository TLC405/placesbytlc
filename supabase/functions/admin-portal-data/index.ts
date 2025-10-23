import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function maskIp(ip: string | null): string | null {
  if (!ip) return ip;
  // IPv4 mask last octet; IPv6 truncate
  if (ip.includes('.')) {
    const parts = ip.split('.');
    parts[3] = '***';
    return parts.join('.');
  }
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return parts.slice(0, 4).join(':') + '::****';
  }
  return ip;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { pin, detail_user_id } = await req.json().catch(() => ({ pin: undefined, detail_user_id: undefined }));

    // Simple PIN gate per product requirement (no auth)
    if (pin !== '666') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return details for a single user (sessions + ip history)
    if (detail_user_id) {
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', detail_user_id)
        .order('session_start', { ascending: false })
        .limit(50);

      if (sessionsError) throw sessionsError;

      const { data: ipHistory, error: ipError } = await supabase
        .from('ip_history')
        .select('*')
        .eq('user_id', detail_user_id)
        .order('last_seen', { ascending: false })
        .limit(100);

      if (ipError) throw ipError;

      const maskedSessions = (sessions || []).map((s) => ({ ...s, ip_address: maskIp(s.ip_address) }));
      const maskedIpHistory = (ipHistory || []).map((i) => ({ ...i, ip_address: maskIp(i.ip_address) }));

      return new Response(
        JSON.stringify({ sessions: maskedSessions, ip_history: maskedIpHistory }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Summary payload (for dashboards)
    const [{ data: profiles, error: profilesError }, { data: activities, error: activitiesError }, { data: analytics, error: analyticsError }] = await Promise.all([
      supabase.from('profiles').select('id, email, display_name, created_at').order('created_at', { ascending: false }).limit(1000),
      supabase.from('user_activity_log').select('*').order('timestamp', { ascending: false }).limit(2000),
      supabase.from('user_analytics').select(`*, profiles:user_id (email, display_name)`).order('engagement_score', { ascending: false }).limit(1000),
    ]);

    if (profilesError) throw profilesError;
    if (activitiesError) throw activitiesError;
    if (analyticsError) throw analyticsError;

    // Mask IP addresses inside activity payloads when present
    const safeActivities = (activities || []).map((a) => {
      try {
        const data = a.activity_data || {};
        if (data?.location?.ip) {
          data.location.ip = maskIp(data.location.ip);
        }
        return { ...a, activity_data: data };
      } catch (_) {
        return a;
      }
    });

    return new Response(
      JSON.stringify({ profiles, activities: safeActivities, analytics }),
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