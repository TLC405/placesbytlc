import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OKC_LAT = 35.4676;
const OKC_LNG = -97.5164;
const RADIUS_MILES = 60;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);
    const tmKey = Deno.env.get("TICKETMASTER_API_KEY");

    if (!tmKey) {
      // Fallback: use AI to generate events
      return await fallbackAIDiscover(supabase);
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const startStr = now.toISOString().replace(/\.\d+Z$/, "Z");
    const endStr = endDate.toISOString().replace(/\.\d+Z$/, "Z");

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${tmKey}&latlong=${OKC_LAT},${OKC_LNG}&radius=${RADIUS_MILES}&unit=miles&startDateTime=${startStr}&endDateTime=${endStr}&size=50&sort=date,asc`;

    const tmRes = await fetch(url);
    if (!tmRes.ok) {
      console.error("Ticketmaster error:", tmRes.status, await tmRes.text());
      return await fallbackAIDiscover(supabase);
    }

    const tmData = await tmRes.json();
    const tmEvents = tmData?._embedded?.events || [];
    let imported = 0;

    for (const ev of tmEvents) {
      try {
        // Upsert venue
        let venueId = null;
        const tmVenue = ev?._embedded?.venues?.[0];
        if (tmVenue) {
          const { data: venue } = await supabase
            .from("venues")
            .upsert({
              name: tmVenue.name || "Unknown Venue",
              address: tmVenue.address?.line1 || null,
              city: tmVenue.city?.name || "Oklahoma City",
              state: tmVenue.state?.stateCode || "OK",
              zip: tmVenue.postalCode || null,
              lat: tmVenue.location?.latitude ? parseFloat(tmVenue.location.latitude) : null,
              lng: tmVenue.location?.longitude ? parseFloat(tmVenue.location.longitude) : null,
              raw: tmVenue,
            }, { onConflict: "id" })
            .select("id")
            .single();
          venueId = venue?.id;
        }

        // Upsert organizer (from promoter or attraction)
        let organizerId = null;
        const promoter = ev?.promoter || ev?._embedded?.attractions?.[0];
        if (promoter) {
          const orgName = promoter.name || "Unknown Organizer";
          const { data: existing } = await supabase
            .from("organizers")
            .select("id")
            .eq("name", orgName)
            .maybeSingle();

          if (existing) {
            organizerId = existing.id;
          } else {
            const { data: newOrg } = await supabase
              .from("organizers")
              .insert({ name: orgName, website: promoter.url || null, raw: promoter })
              .select("id")
              .single();
            organizerId = newOrg?.id;
          }
        }

        // Upsert event
        const startDate = ev.dates?.start?.dateTime || ev.dates?.start?.localDate;
        const priceRanges = ev.priceRanges?.[0];

        await supabase.from("events").upsert({
          source: "ticketmaster",
          source_event_id: ev.id,
          title: ev.name,
          description: ev.info || ev.pleaseNote || null,
          starts_at: startDate || null,
          ends_at: ev.dates?.end?.dateTime || null,
          venue_id: venueId,
          organizer_id: organizerId,
          ticket_url: ev.url || null,
          event_url: ev.url || null,
          price_min: priceRanges?.min || null,
          price_max: priceRanges?.max || null,
          currency: priceRanges?.currency || "USD",
          tags: ev.classifications?.map((c: any) => c.segment?.name).filter(Boolean) || [],
          raw: ev,
          status: "active",
        }, { onConflict: "source,source_event_id" });

        imported++;
      } catch (err) {
        console.error("Error importing event:", ev.name, err);
      }
    }

    return new Response(JSON.stringify({ success: true, imported, total: tmEvents.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("TLC Engine discover error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function fallbackAIDiscover(supabase: any) {
  // Use Lovable AI to generate sample OKC events
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ success: true, imported: 0, message: "No API keys configured" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{
        role: "system",
        content: "Generate 10 realistic upcoming events in Oklahoma City for singles/dating. Return JSON array with fields: title, description, venue_name, venue_address, starts_at (ISO datetime within next 30 days from today), price_min, price_max, tags (array), event_type (music/social/food/sports/arts). Only return the JSON array, no markdown."
      }, {
        role: "user",
        content: `Today is ${new Date().toISOString().split('T')[0]}. Generate diverse OKC events.`
      }],
      tools: [{
        type: "function",
        function: {
          name: "generate_events",
          description: "Generate a list of OKC events",
          parameters: {
            type: "object",
            properties: {
              events: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    venue_name: { type: "string" },
                    venue_address: { type: "string" },
                    starts_at: { type: "string" },
                    price_min: { type: "number" },
                    price_max: { type: "number" },
                    tags: { type: "array", items: { type: "string" } },
                    event_type: { type: "string" }
                  },
                  required: ["title", "venue_name", "starts_at"]
                }
              }
            },
            required: ["events"]
          }
        }
      }],
      tool_choice: { type: "function", function: { name: "generate_events" } }
    }),
  });

  if (!aiRes.ok) {
    console.error("AI fallback error:", aiRes.status);
    return new Response(JSON.stringify({ success: true, imported: 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const aiData = await aiRes.json();
  const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    return new Response(JSON.stringify({ success: true, imported: 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const generated = JSON.parse(toolCall.function.arguments);
  let imported = 0;

  for (const ev of generated.events || []) {
    // Upsert venue
    const { data: venue } = await supabase
      .from("venues")
      .insert({ name: ev.venue_name, address: ev.venue_address || null, city: "Oklahoma City", state: "OK" })
      .select("id")
      .single();

    await supabase.from("events").insert({
      source: "ai_generated",
      source_event_id: `ai_${Date.now()}_${imported}`,
      title: ev.title,
      description: ev.description || null,
      starts_at: ev.starts_at,
      venue_id: venue?.id,
      price_min: ev.price_min || null,
      price_max: ev.price_max || null,
      tags: ev.tags || [ev.event_type || "social"],
      status: "active",
    });
    imported++;
  }

  return new Response(JSON.stringify({ success: true, imported, source: "ai_generated" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
