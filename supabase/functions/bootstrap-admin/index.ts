import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get current user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if any admin exists
    const { data: existingAdmins } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Admin already exists. Contact existing admin for access.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Grant admin to current user
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role: 'admin' });

    if (insertError) {
      console.error('Failed to grant admin:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to grant admin role' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Bootstrapped admin: ${user.email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin role granted successfully!',
        user: { email: user.email, id: user.id }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Bootstrap admin error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
