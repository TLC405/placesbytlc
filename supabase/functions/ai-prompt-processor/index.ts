import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert code update request refiner for the FELICIA.TLC application.
    
Your task is to take a rough code update request and transform it into a detailed, actionable prompt that can be sent to ChatGPT.

Key requirements:
1. Break down complex requests into clear, step-by-step instructions
2. Specify exact file paths when known
3. Include context about existing architecture and patterns
4. Add safety checks and validation requirements
5. Highlight any potential breaking changes
6. Suggest testing approaches

The app uses:
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (auth, database, edge functions)
- React Router 6

Format your response as a detailed prompt ready to copy-paste into ChatGPT.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Refine this code update request:\n\n${prompt}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", errorText);
      throw new Error("AI processing failed");
    }

    const data = await response.json();
    const refinedPrompt = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: refinedPrompt }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in ai-prompt-processor:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
