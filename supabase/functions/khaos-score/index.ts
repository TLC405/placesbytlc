import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WEIGHTS = {
  reliability: 0.30,
  experience: 0.25,
  safety: 0.20,
  transparency: 0.15,
  media: 0.10,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get all organizers
    const { data: organizers } = await supabase.from("organizers").select("id, name");
    if (!organizers?.length) {
      return new Response(JSON.stringify({ success: true, scored: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let scored = 0;
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();

    for (const org of organizers) {
      // Get signals for this organizer (last 6 months)
      const { data: signals } = await supabase
        .from("organizer_signals")
        .select("*")
        .eq("organizer_id", org.id)
        .gte("captured_at", sixMonthsAgo)
        .order("captured_at", { ascending: false });

      // Get event count for this organizer
      const { count: eventCount } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("organizer_id", org.id);

      const signalCount = (signals?.length || 0) + (eventCount || 0);

      // Determine confidence
      let confidence = "low";
      if (signalCount >= 20) confidence = "high";
      else if (signalCount >= 5) confidence = "medium";

      // Compute component scores
      const components = computeComponents(signals || [], eventCount || 0);

      // Weighted total
      const scoreTotal = Object.entries(WEIGHTS).reduce((sum, [key, weight]) => {
        return sum + (components[key] || 0) * weight;
      }, 0);

      // Generate explanation
      const explain = generateExplanation(org.name, components, confidence, signalCount);

      // Upsert score
      await supabase.from("khaos_scores").upsert({
        organizer_id: org.id,
        score_total: Math.round(scoreTotal * 100) / 100,
        components,
        explain,
        confidence,
        scored_at: new Date().toISOString(),
      }, { onConflict: "organizer_id" });

      scored++;
    }

    // Use AI to enrich explanations if available
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (apiKey && scored > 0) {
      await enrichExplanations(supabase, apiKey);
    }

    return new Response(JSON.stringify({ success: true, scored }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("KHAOS score error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function computeComponents(signals: any[], eventCount: number): Record<string, number> {
  const byType: Record<string, number[]> = {};
  for (const s of signals) {
    if (!byType[s.signal_type]) byType[s.signal_type] = [];
    byType[s.signal_type].push(s.value);
  }

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0.5;
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  // Reliability: cancellation rate (inverse), event frequency
  const cancellations = byType["cancellation"] || [];
  const cancellationRate = cancellations.length ? avg(cancellations) : 0;
  const eventFreqScore = clamp(eventCount / 20); // 20+ events = 1.0
  const reliability = clamp((1 - cancellationRate) * 0.6 + eventFreqScore * 0.4);

  // Experience: review ratings
  const ratings = byType["review_rating"] || [];
  const experience = ratings.length ? clamp(avg(ratings) / 5) : 0.5;

  // Safety: incident reports (inverse)
  const incidents = byType["incident"] || [];
  const safety = clamp(1 - (incidents.length > 0 ? avg(incidents) : 0));

  // Transparency: policy clarity, refund clarity
  const policySignals = byType["policy_clarity"] || [];
  const transparency = policySignals.length ? clamp(avg(policySignals)) : 0.4;

  // Media: event photography presence
  const mediaSignals = byType["media_presence"] || [];
  const media = mediaSignals.length ? clamp(avg(mediaSignals)) : 0.3;

  return {
    reliability: Math.round(reliability * 100) / 100,
    experience: Math.round(experience * 100) / 100,
    safety: Math.round(safety * 100) / 100,
    transparency: Math.round(transparency * 100) / 100,
    media: Math.round(media * 100) / 100,
  };
}

function generateExplanation(name: string, components: Record<string, number>, confidence: string, signalCount: number): Record<string, string> {
  const explain: Record<string, string> = {};

  if (confidence === "low") {
    explain.summary = `${name} has limited data (${signalCount} signals). Scores are preliminary.`;
  } else if (confidence === "medium") {
    explain.summary = `${name} has moderate data coverage. Scores reflect available signals.`;
  } else {
    explain.summary = `${name} has strong data coverage across multiple signal types.`;
  }

  explain.reliability = components.reliability >= 0.7
    ? "Consistent event delivery with low cancellation rate."
    : "Limited track record or some cancellations noted.";

  explain.experience = components.experience >= 0.7
    ? "Strong ratings and positive attendee feedback."
    : "Limited review data available.";

  explain.safety = components.safety >= 0.8
    ? "No reported incidents. Clean safety record."
    : "Safety record needs more data points.";

  explain.transparency = components.transparency >= 0.6
    ? "Clear policies and pricing information."
    : "Policy information could be more transparent.";

  explain.media = components.media >= 0.5
    ? "Authentic event media and post-event recaps present."
    : "Limited media presence for events.";

  return explain;
}

async function enrichExplanations(supabase: any, apiKey: string) {
  try {
    const { data: scores } = await supabase
      .from("khaos_scores")
      .select("*, organizers(name)")
      .eq("confidence", "low")
      .limit(5);

    if (!scores?.length) return;

    // Use AI to generate richer explanations for low-confidence scores
    for (const score of scores) {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [{
            role: "user",
            content: `Generate a brief, professional 2-sentence summary for event organizer "${score.organizers?.name}" with KHAOS score ${score.score_total}/10. Components: ${JSON.stringify(score.components)}. Confidence: ${score.confidence}. Be fair and constructive.`
          }],
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const enriched = aiData.choices?.[0]?.message?.content;
        if (enriched) {
          const explain = { ...score.explain, ai_summary: enriched };
          await supabase.from("khaos_scores").update({ explain }).eq("id", score.id);
        }
      }
    }
  } catch (err) {
    console.error("AI enrichment error:", err);
  }
}
