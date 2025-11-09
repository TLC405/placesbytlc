import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, characterName, realisticStyle, genderStyle } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Character attribute mapping
    const characterAttributes: Record<string, { colors: string; features: string; personality: string }> = {
      "SpongeBob": {
        colors: "yellow, brown, red",
        features: "square patterns, porous texture, bright colors",
        personality: "cheerful, optimistic, energetic"
      },
      "Patrick Star": {
        colors: "pink, green",
        features: "starfish patterns, tropical vibes",
        personality: "friendly, laid-back, jovial"
      },
      "Squidward": {
        colors: "teal, turquoise",
        features: "sophisticated, artistic elements",
        personality: "refined, artistic, elegant"
      },
      "Shrek": {
        colors: "green, brown",
        features: "ogre-inspired, nature elements",
        personality: "rugged, confident, strong"
      },
      "Pikachu": {
        colors: "yellow, red, black",
        features: "electric patterns, lightning bolts",
        personality: "energetic, cute, powerful"
      },
      "Mickey Mouse": {
        colors: "red, black, white, yellow",
        features: "classic Disney style, circular motifs",
        personality: "iconic, friendly, timeless"
      },
      "Bugs Bunny": {
        colors: "gray, white, orange",
        features: "carrot accessories, playful elements",
        personality: "witty, clever, mischievous"
      },
      "Homer Simpson": {
        colors: "yellow, blue, white",
        features: "casual style, donut references",
        personality: "comedic, relatable, casual"
      },
      "Sonic": {
        colors: "blue, red, white",
        features: "speed elements, dynamic patterns",
        personality: "fast, cool, confident"
      },
      "Mario": {
        colors: "red, blue, white",
        features: "plumber style, mushroom elements",
        personality: "heroic, adventurous, iconic"
      },
      "Totoro": {
        colors: "gray, green, brown",
        features: "nature-inspired, forest elements",
        personality: "gentle, magical, serene"
      },
      "Sandy Cheeks": {
        colors: "white, pink, orange",
        features: "Texas style, scientific elements",
        personality: "smart, sporty, adventurous"
      }
    };

    const attrs = characterAttributes[characterName] || {
      colors: "colorful",
      features: "unique design elements",
      personality: "distinctive character"
    };

    // Construct hyper-realistic prompt
    const styleDescriptions: Record<string, string> = {
      professional: "wearing professional business attire, corporate photography style, studio lighting",
      casual: "wearing casual everyday clothing, natural lighting, relaxed outdoor setting",
      streetwear: "wearing modern streetwear fashion, urban photography style, city background",
      formal: "wearing elegant formal attire, fashion editorial style, sophisticated setting",
      cosplay: "wearing detailed cosplay costume, convention photography style, vibrant setting"
    };

    const genderDescriptions: Record<string, string> = {
      male: "male person, masculine features",
      female: "female person, feminine features",
      neutral: "person with androgynous features"
    };

    const prompt = `Create a hyper-realistic, professional photograph of a ${genderDescriptions[genderStyle]}. 
The person should be ${styleDescriptions[realisticStyle]}. 
Their outfit and appearance must be inspired by ${characterName} with these characteristics:
- Color palette: ${attrs.colors}
- Design elements: ${attrs.features}
- Personality expression: ${attrs.personality}

The clothing should creatively incorporate ${attrs.colors} colors in the design.
Use patterns, textures, or accessories that reference ${attrs.features}.
The person's expression and pose should convey: ${attrs.personality}.

Photo specifications:
- Ultra high resolution, 8K quality
- Professional photography with perfect lighting
- Sharp focus, photorealistic skin texture and fabric details
- Fashion editorial composition
- Studio quality with natural-looking post-processing
- The outfit must clearly reference the character while being realistic and wearable

Style: Photo-realistic portrait photography, not illustration or cartoon.`;

    console.log("Generating realistic human with prompt:", prompt);

    // Call Lovable AI with Nano banana model for image generation
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: image
              ? [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: `data:image/png;base64,${image}` } }
                ]
              : prompt
          }
        ],
        modalities: ["image", "text"],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the generated image
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      throw new Error("No image generated");
    }

    // Extract base64 from data URL
    const base64Data = generatedImageUrl.split(",")[1];

    return new Response(
      JSON.stringify({ humanImage: base64Data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in cartoon-to-human function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
