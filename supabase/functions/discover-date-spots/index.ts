import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdmin, checkRateLimit } from "../_shared/auth.ts";
import { validateCity, validateQuery, sanitizeForSQL } from "../_shared/validation.ts";
import { corsHeaders, handleError } from "../_shared/errors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const { user, adminClient } = await verifyAdmin(authHeader);

    // Rate limiting: 10 requests per 5 minutes per user
    const rateLimitKey = `discover:${user.id}`;
    const allowed = await checkRateLimit(adminClient, rateLimitKey, 10, 5);
    if (!allowed) {
      throw new Error('RATE_LIMIT');
    }

    const body = await req.json();
    
    // Validate inputs
    const city = validateCity(body.city);
    const query = validateQuery(body.query);
    const sanitizedCity = sanitizeForSQL(city);

    // Check if places already exist
    const { data: existing } = await adminClient
      .from('discovered_places')
      .select('*')
      .ilike('city', `%${sanitizedCity}%`);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ places: existing }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Lovable AI for recommendations
    const lovableApiUrl = Deno.env.get('LOVABLE_API_URL');
    if (!lovableApiUrl) {
      throw new Error('AI service not configured');
    }

    const aiPrompt = `Find 10 real date spots in ${city}${query ? ` matching: ${query}` : ' for couples'}. Return ONLY valid JSON array with: name, address, description, type, priceRange.`;

    const aiResponse = await fetch(lovableApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp',
        messages: [{ role: 'user', content: aiPrompt }],
        temperature: 0.7,
      })
    });

    if (!aiResponse.ok) {
      throw new Error('AI service unavailable');
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Invalid AI response');
    }

    // Parse and validate AI response
    let places: any[];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      places = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      throw new Error('Failed to parse AI response');
    }

    // Store discovered places
    const placesToInsert = places.slice(0, 10).map(place => ({
      ...place,
      city,
      lat: body.lat || null,
      lng: body.lng || null,
      created_by: user.id
    }));

    const { data: inserted, error: insertError } = await adminClient
      .from('discovered_places')
      .insert(placesToInsert)
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to save places');
    }

    return new Response(
      JSON.stringify({ places: inserted || placesToInsert }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return handleError(error);
  }
});
