import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeneratedTheme {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  suggestedStyle: string;
  vibe: "energetic" | "calm" | "playful" | "sophisticated";
  dominantColors: string[];
  personalityMatch: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      throw new Error("No image provided");
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Call Lovable AI to analyze the photo
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert at analyzing faces and generating personalized cartoon themes. Analyze the person's features, facial structure, skin tone, and overall appearance to create a matching cartoon universe theme.

Return a JSON object with this exact structure:
{
  "primaryColor": "#HEX",
  "accentColor": "#HEX", 
  "backgroundColor": "#HEX",
  "suggestedStyle": "simpsons" | "familyguy" | "southpark" | "rickandmorty" | "spongebob" | "pokemon",
  "vibe": "energetic" | "calm" | "playful" | "sophisticated",
  "dominantColors": ["#HEX", "#HEX", "#HEX"],
  "personalityMatch": "A 2-3 word personality description"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this person and generate their personalized cartoon theme. Consider skin tone, facial features, expression, and overall vibe.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${image}`
                }
              }
            ]
          }
        ]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      throw new Error(`AI API failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const themeText = aiData.choices?.[0]?.message?.content;

    if (!themeText) {
      throw new Error('No theme generated from AI');
    }

    // Parse the JSON response
    const jsonMatch = themeText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse theme JSON');
    }

    const theme: GeneratedTheme = JSON.parse(jsonMatch[0]);

    console.log('Generated theme:', theme);

    return new Response(
      JSON.stringify({ theme }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-photo-theme:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze photo';
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});