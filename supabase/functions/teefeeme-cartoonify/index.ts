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

    const { 
      image, 
      style = 'simpsons',
      identityStrength = 80,
      backgroundMode = 'auto',
      pose = 'portrait',
      emotion = 'neutral',
      colorPalette = 'classic',
      resolution = 'standard',
      isRefinement = false,
      refinementCount = 0
    } = await req.json();
    
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    // Expanded style prompts with identity preservation
    const stylePrompts: Record<string, string> = {
      simpsons: "CRITICAL: Preserve exact identity and facial features. Transform into Simpsons character with bright yellow skin, big white eyes with black pupils, spiky simplified hair, flat 2D animated style",
      familyguy: "CRITICAL: Maintain identity accuracy. Transform into Family Guy character with Seth MacFarlane's style - simplified features, thick outlines, flat colors, elongated face proportions",
      southpark: "CRITICAL: Keep identity recognizable. Transform into South Park character with flat cutout paper aesthetic, simple rounded shapes, minimal detail, construction paper texture",
      rickandmorty: "CRITICAL: Preserve facial identity. Transform into Rick and Morty character with neon sci-fi dimension style, exaggerated sci-fi features, drool effects, portal backgrounds",
      kingofthehill: "CRITICAL: Maintain realistic identity. Transform into King of the Hill character with grounded realism, subtle cartoon proportions, everyday suburban Texas setting",
      renandstimpy: "CRITICAL: Keep identity while adding grotesque style. Transform into Ren and Stimpy character with gritty detailed close-ups, wild expressions, distorted proportions",
      beavisandbutt: "CRITICAL: Preserve identity features. Transform into Beavis and Butthead character with crude flat style, simple angular shapes, MTV 90s aesthetic",
      spongebob: "CRITICAL: Maintain identity underwater. Transform into SpongeBob character with undersea bubbly fun style, bright colors, nautical background, ocean vibes",
      pokemon: "CRITICAL: Keep identity in anime form. Transform into Pokémon anime character with manga style, big expressive eyes, dynamic poses, energy effects",
      toontown: "CRITICAL: Preserve identity with rubber-hose. Transform into classic Toontown character with rubber-hose animation, 1930s cartoon style, bendy limbs",
      peppapig: "CRITICAL: Maintain identity minimally. Transform into Peppa Pig character with minimal nursery style, simple rounded shapes, pastel colors, childlike aesthetic",
      doraemon: "CRITICAL: Keep identity with robo-cat style. Transform into Doraemon character with blue robo-cat aesthetic, rounded friendly shapes, gadget elements"
    };

    // Background mode instructions
    const backgroundInstructions: Record<string, string> = {
      auto: "Set in style-appropriate iconic location with rich environmental details",
      minimal: "Place on clean gradient background with simple color transitions",
      immersive: "Create detailed immersive environment with multiple background elements and depth"
    };

    // Pose instructions
    const poseInstructions: Record<string, string> = {
      portrait: "Head and shoulders portrait composition, face forward, close-up framing",
      "waist-up": "Waist-up framing showing upper body and hands, medium shot composition",
      "full-body": "Full body visible from head to toe, standing pose, wide shot",
      action: "Dynamic action pose with movement and energy, dramatic angle",
      heroic: "Epic heroic stance with power pose, low angle looking up, dramatic lighting"
    };

    // Emotion instructions
    const emotionInstructions: Record<string, string> = {
      neutral: "neutral relaxed expression",
      happy: "big happy smile with joy",
      excited: "extremely excited wide-eyed expression",
      serious: "serious cool confident look",
      surprised: "shocked surprised expression",
      silly: "silly goofy playful expression",
      cool: "cool confident smirk"
    };

    // Color palette instructions
    const colorInstructions: Record<string, string> = {
      classic: "vibrant classic primary colors",
      pastel: "soft pastel color scheme",
      neon: "bright neon glowing colors",
      vintage: "warm vintage sepia tones",
      monochrome: "grayscale monochromatic palette"
    };

    // Construct dynamic prompt
    let prompt = `${stylePrompts[style]} at ${identityStrength}% identity preservation fidelity. `;
    prompt += `${backgroundInstructions[backgroundMode]}. `;
    prompt += `${poseInstructions[pose]}. `;
    prompt += `Expression: ${emotionInstructions[emotion]}. `;
    prompt += `Use ${colorInstructions[colorPalette]}. `;
    
    if (isRefinement) {
      prompt += `This is refinement pass ${refinementCount + 1}. Enhance identity accuracy and detail quality while maintaining ${style} aesthetic. `;
    }

    // Negative prompt for quality
    prompt += `\n\nNegative prompt: warped eyes, extra limbs, double faces, bad hands, deformed fingers, floating limbs, text, watermarks, logos, trademarked characters, blurry, low quality, jpeg artifacts.`;
    
    // Resolution multiplier
    const resolutionNote = resolution === 'ultra' ? ' Ultra high resolution 4K quality.' : resolution === 'hd' ? ' HD quality 2K resolution.' : ' Standard quality.';

    console.log('Generating cartoon with style:', style, 'identity:', identityStrength, 'pose:', pose);

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
                text: prompt + resolutionNote
              },
              {
                type: 'image_url',
                image_url: {
                  url: image.startsWith('data:') ? image : `data:image/png;base64,${image}`
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
