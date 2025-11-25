import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting: 10 cartoons per 5 minutes per user
    const rateLimitKey = `cartoon:${user.id}`;
    const { data: allowed } = await supabase.rpc('check_rate_limit', {
      _key: rateLimitKey,
      _max_requests: 10,
      _window_minutes: 5
    });

    if (!allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a few minutes and try again.',
          retryAfter: 300
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '300'
          } 
        }
      );
    }

    const { imageData, style } = await req.json();
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const stylePrompts = {
      simpsons: "Transform this person into a Simpsons character with bright yellow skin, big white eyes with black pupils, spiky simplified hair, and the signature flat 2D animated style. Set them in Springfield with vibrant colors.",
      flintstones: "Transform this person into a Flintstones character with exaggerated prehistoric features, thick outlined cartoon style, bright solid colors, stone-age clothing made of animal skins, and a Bedrock background.",
      trump: "Transform this person into a political cartoon caricature in Donald Trump's distinctive style - exaggerated orange tan, signature swept blonde hair, bold red tie, confident stance, dynamic comic book style with bold outlines.",
      elon: "Transform this person into a futuristic tech mogul character in Elon Musk's style - modern simplified cartoon aesthetic, Tesla/SpaceX themed background, sleek lines, innovation vibe, tech startup poster style.",
      familyguy: "Transform this person into a Family Guy character with Seth MacFarlane's distinctive animation style - simplified features, thick outlines, flat colors, elongated face proportions, set in Quahog Rhode Island.",
      renandstimpy: "Transform this person into a Ren and Stimpy character with John K's gross-out style - hyper-detailed close-ups, wild exaggerated expressions, distorted proportions, scratchy line work, intense colors and shadows."
    };

    const prompt = `${stylePrompts[style as keyof typeof stylePrompts]} 
    
Make it festive and fun! Add cartoon sparkles, vibrant background elements, and exaggerated happy expressions. High quality cartoon art, professional animation style, 4K detailed.`;

    console.log('Generating cartoon with prompt:', prompt.substring(0, 100));

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      // Handle specific error codes
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a moment and try again.',
          code: 429
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits depleted. Please add credits to your Lovable workspace.',
          code: 402
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: 'Failed to generate cartoon. Please try again.',
        code: 'AI_ERROR'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');
    
    const generatedImage = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImage) {
      console.error('No image in AI response');
      return new Response(JSON.stringify({ 
        error: 'Failed to generate cartoon. Please try again.',
        code: 'NO_IMAGE'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      cartoonImage: generatedImage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in teefeeme-cartoonify:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate cartoon image. Please try again.',
        code: 'GENERATION_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
