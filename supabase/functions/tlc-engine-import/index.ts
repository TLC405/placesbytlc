import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Verify admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("UNAUTHORIZED");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) throw new Error("UNAUTHORIZED");

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: roles } = await adminClient.from("user_roles").select("role").eq("user_id", user.id);
    if (!roles?.some(r => r.role === "admin")) throw new Error("FORBIDDEN");

    const body = await req.json();
    const { url: eventUrl, source, event: manualEvent } = body;

    if (source === "eventbrite" && eventUrl) {
      return await importEventbrite(adminClient, eventUrl);
    } else if (source === "manual" && manualEvent) {
      return await importManual(adminClient, manualEvent);
    } else {
      throw new Error("Invalid import request. Provide source + url or event data.");
    }
  } catch (err) {
    const status = err.message === "UNAUTHORIZED" ? 401 : err.message === "FORBIDDEN" ? 403 : 500;
    return new Response(JSON.stringify({ error: err.message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function importEventbrite(supabase: any, url: string) {
  try {
    // Fetch public Eventbrite page and extract JSON-LD
    const pageRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; InPersonOKC/1.0)" }
    });
    if (!pageRes.ok) throw new Error(`Failed to fetch URL: ${pageRes.status}`);

    const html = await pageRes.text();
    
    // Extract JSON-LD
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!jsonLdMatch) throw new Error("No JSON-LD found on page");

    const jsonLd = JSON.parse(jsonLdMatch[1]);
    const eventData = Array.isArray(jsonLd) ? jsonLd.find((j: any) => j["@type"] === "Event") : jsonLd["@type"] === "Event" ? jsonLd : null;

    if (!eventData) throw new Error("No Event structured data found");

    // Upsert venue
    let venueId = null;
    if (eventData.location) {
      const loc = eventData.location;
      const { data: venue } = await supabase
        .from("venues")
        .insert({
          name: loc.name || "TBD",
          address: loc.address?.streetAddress || null,
          city: loc.address?.addressLocality || "Oklahoma City",
          state: loc.address?.addressRegion || "OK",
          zip: loc.address?.postalCode || null,
        })
        .select("id")
        .single();
      venueId = venue?.id;
    }

    // Upsert organizer
    let organizerId = null;
    if (eventData.organizer) {
      const orgName = eventData.organizer.name || "Unknown";
      const { data: existing } = await supabase.from("organizers").select("id").eq("name", orgName).maybeSingle();
      if (existing) {
        organizerId = existing.id;
      } else {
        const { data: newOrg } = await supabase.from("organizers").insert({ name: orgName, website: eventData.organizer.url || null }).select("id").single();
        organizerId = newOrg?.id;
      }
    }

    // Extract price
    const offers = eventData.offers;
    const priceMin = offers?.lowPrice || offers?.price || null;
    const priceMax = offers?.highPrice || null;

    // Upsert event
    const sourceId = url.match(/(\d+)\/?$/)?.[1] || url;
    await supabase.from("events").upsert({
      source: "eventbrite",
      source_event_id: `eb_${sourceId}`,
      title: eventData.name,
      description: eventData.description || null,
      starts_at: eventData.startDate || null,
      ends_at: eventData.endDate || null,
      venue_id: venueId,
      organizer_id: organizerId,
      ticket_url: url,
      event_url: url,
      price_min: priceMin ? parseFloat(priceMin) : null,
      price_max: priceMax ? parseFloat(priceMax) : null,
      tags: ["eventbrite"],
      raw: eventData,
      status: "active",
    }, { onConflict: "source,source_event_id" });

    return new Response(JSON.stringify({ success: true, title: eventData.name }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

async function importManual(supabase: any, event: any) {
  // Upsert venue if provided
  let venueId = null;
  if (event.venue_name) {
    const { data: venue } = await supabase
      .from("venues")
      .insert({
        name: event.venue_name,
        address: event.venue_address || null,
        city: event.city || "Oklahoma City",
        state: "OK",
      })
      .select("id")
      .single();
    venueId = venue?.id;
  }

  // Upsert organizer if provided
  let organizerId = null;
  if (event.organizer_name) {
    const { data: existing } = await supabase.from("organizers").select("id").eq("name", event.organizer_name).maybeSingle();
    if (existing) {
      organizerId = existing.id;
    } else {
      const { data: newOrg } = await supabase.from("organizers").insert({ name: event.organizer_name }).select("id").single();
      organizerId = newOrg?.id;
    }
  }

  const { data: inserted } = await supabase.from("events").insert({
    source: "manual",
    source_event_id: `manual_${Date.now()}`,
    title: event.title,
    description: event.description || null,
    starts_at: event.starts_at || null,
    ends_at: event.ends_at || null,
    venue_id: venueId,
    organizer_id: organizerId,
    ticket_url: event.ticket_url || null,
    event_url: event.event_url || null,
    price_min: event.price_min || null,
    price_max: event.price_max || null,
    tags: event.tags || ["manual"],
    status: "active",
  }).select("id").single();

  return new Response(JSON.stringify({ success: true, id: inserted?.id }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
