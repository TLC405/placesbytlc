import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const verifyAuth = async (authHeader: string | null) => {
  if (!authHeader) {
    throw new Error("UNAUTHORIZED");
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error("UNAUTHORIZED");
  }

  return { user, supabase };
};

export const verifyAdmin = async (authHeader: string | null) => {
  const { user, supabase } = await verifyAuth(authHeader);
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const adminClient = createClient(supabaseUrl, serviceKey);

  const { data: roles } = await adminClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  const isAdmin = roles?.some(r => r.role === 'admin');
  
  if (!isAdmin) {
    throw new Error("FORBIDDEN");
  }

  return { user, supabase, adminClient };
};

export const checkRateLimit = async (
  supabase: any,
  key: string,
  maxRequests: number = 10,
  windowMinutes: number = 1
): Promise<boolean> => {
  const { data, error } = await supabase.rpc('check_rate_limit', {
    _key: key,
    _max_requests: maxRequests,
    _window_minutes: windowMinutes
  });

  if (error) {
    console.error('Rate limit check failed:', error);
    return true; // Fail open to avoid breaking functionality
  }

  return data === true;
};
