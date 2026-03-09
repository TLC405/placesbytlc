import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    // Auth check (optional — allow unauthenticated for public access)
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader) {
      const userClient = createClient(supabaseUrl, supabaseAnon, {
        global: { headers: { Authorization: authHeader } }
      });
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id || null;
    }

    // Rate limit by IP or user
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const rateLimitKey = userId ? `cupid:${userId}` : `cupid:anon:${req.headers.get('x-forwarded-for') || 'unknown'}`;
    const { data: allowed } = await adminClient.rpc('check_rate_limit', {
      _key: rateLimitKey,
      _max_requests: 15,
      _window_minutes: 10,
    });

    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Cupid needs a breather! Try again in a few minutes. 💫' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, mood, budget, conversation } = await req.json();

    if (!prompt?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Please tell Cupid what you\'re looking for!' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch ALL real places from the database
    const { data: places } = await adminClient
      .from('discovered_places')
      .select('name, address, category, description, discovery_context, city')
      .order('name');

    // Fetch upcoming events
    const { data: events } = await adminClient
      .from('events')
      .select('title, description, starts_at, venue_id, price_min, price_max, tags, event_url')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at')
      .limit(30);

    // Fetch venues for event context
    const { data: venues } = await adminClient
      .from('venues')
      .select('id, name, address, city');

    const venueMap = new Map();
    venues?.forEach((v: any) => venueMap.set(v.id, v));

    const eventsWithVenues = (events || []).map((e: any) => ({
      ...e,
      venue: venueMap.get(e.venue_id) || null,
    }));

    // Fetch user preferences if authenticated
    let userPrefs: any[] = [];
    if (userId) {
      const { data } = await adminClient
        .from('user_preferences')
        .select('preference_type, preference_value, confidence_score')
        .eq('user_id', userId)
        .order('confidence_score', { ascending: false })
        .limit(20);
      userPrefs = data || [];
    }

    // Build conversation history for multi-turn
    const messages: any[] = [
      {
        role: 'system',
        content: `You are Cupid, an expert OKC date planner. You're warm, witty, and genuinely helpful.

REAL PLACES DATABASE (${places?.length || 0} spots):
${JSON.stringify(places?.map((p: any) => ({ name: p.name, category: p.category, desc: p.description, context: p.discovery_context, city: p.city })) || [], null, 1)}

UPCOMING EVENTS (${eventsWithVenues.length}):
${JSON.stringify(eventsWithVenues.map((e: any) => ({ title: e.title, date: e.starts_at, price: e.price_min ? `$${e.price_min}-$${e.price_max}` : 'Free/TBD', venue: e.venue?.name, tags: e.tags })), null, 1)}

${userPrefs.length > 0 ? `USER PREFERENCES: ${JSON.stringify(userPrefs)}` : ''}

RULES:
1. ONLY recommend places/events from the databases above. Never invent places.
2. For each recommendation, include a "match_score" (1-100) based on how well it fits the request.
3. Include a brief, charming "cupid_note" explaining WHY this spot is perfect for them.
4. If mood is provided, factor it heavily into recommendations.
5. If budget is provided (1=cheap, 2=moderate, 3=splurge), filter accordingly.
6. Suggest a complete date plan when possible (e.g., "Start at X, then walk to Y, finish at Z").

User mood: ${mood || 'not specified'}
Budget level: ${budget ? ['$', '$$', '$$$'][budget - 1] : 'any'}

Respond ONLY with valid JSON:
{
  "message": "Your warm, personalized intro (2-3 sentences max, use emojis sparingly)",
  "recommendations": [
    {
      "name": "Exact place/event name from database",
      "type": "place|event",
      "category": "food|activity|entertainment|both",
      "match_score": 85,
      "cupid_note": "Why this is perfect for you",
      "price_indicator": "$|$$|$$$",
      "best_for": "dinner|drinks|adventure|culture|romantic|fun",
      "address": "address if available",
      "event_date": "ISO date if event, null if place",
      "event_url": "url if event"
    }
  ],
  "date_plan": {
    "title": "Catchy plan name",
    "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
    "estimated_cost": "$XX-$XX",
    "duration": "X hours"
  },
  "follow_up": "A conversational follow-up question to refine"
}`
      }
    ];

    // Add conversation history
    if (conversation?.length) {
      for (const msg of conversation.slice(-6)) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: 'user', content: prompt });

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.75,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('AI API error:', errText);
      return new Response(
        JSON.stringify({ error: 'Cupid is taking a nap. Try again shortly!' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || '';

    // Parse JSON from response (handle markdown code blocks)
    let result;
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI response:', content);
      result = {
        message: "I found some great spots for you! Here's what I'd suggest:",
        recommendations: [],
        follow_up: "Could you tell me more about what vibe you're going for?"
      };
    }

    // Store recommendation if user is authenticated
    if (userId && result.recommendations?.length) {
      await adminClient.from('ai_recommendations').insert({
        user_id: userId,
        recommendation_type: 'cupid_chat',
        recommendation_data: result,
        confidence_score: result.recommendations[0]?.match_score / 100 || 0.7,
        reason: prompt,
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Cupid error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Cupid will be back shortly!' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
