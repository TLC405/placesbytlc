export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handleError = (error: unknown) => {
  console.error('Function error:', error);
  
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  
  // Map errors to safe responses
  if (errorMessage === 'UNAUTHORIZED') {
    return new Response(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  if (errorMessage === 'FORBIDDEN') {
    return new Response(
      JSON.stringify({ error: 'Insufficient permissions' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  if (errorMessage === 'RATE_LIMIT') {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Never expose internal errors to clients
  return new Response(
    JSON.stringify({ error: 'An error occurred processing your request' }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};
