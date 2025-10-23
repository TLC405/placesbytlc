import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return public code viewer and GitHub links
    const projectUrl = Deno.env.get('SITE_URL') || 'https://ee2e66a7-1043-4b77-86a2-af77f947ef61.lovableproject.com';
    const codeViewerUrl = `${projectUrl}/code`;
    const repoUrl = 'https://github.com/lovable-dev/placesbytlc';
    const downloadUrl = `${repoUrl}/archive/refs/heads/main.zip`;

    return new Response(
      JSON.stringify({ 
        download_url: downloadUrl,
        code_viewer_url: codeViewerUrl,
        repo_url: repoUrl,
        message: 'Source code access ready'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: unknown) {
    console.error('Error in download-source function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
