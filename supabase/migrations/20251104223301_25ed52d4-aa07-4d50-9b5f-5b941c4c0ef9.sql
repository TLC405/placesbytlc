-- Create cartoon_generations table for storing generation history
CREATE TABLE IF NOT EXISTS public.cartoon_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  style_id TEXT NOT NULL,
  original_image_url TEXT,
  cartoon_image_url TEXT NOT NULL,
  seed INTEGER,
  identity_strength INTEGER DEFAULT 80,
  background_mode TEXT DEFAULT 'auto',
  pose TEXT DEFAULT 'portrait',
  emotion TEXT DEFAULT 'neutral',
  color_palette TEXT DEFAULT 'classic',
  resolution TEXT DEFAULT 'standard',
  metadata JSONB DEFAULT '{}'::jsonb,
  generation_time_ms INTEGER,
  refinement_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cartoon_user_style ON public.cartoon_generations(user_id, style_id);
CREATE INDEX IF NOT EXISTS idx_cartoon_created ON public.cartoon_generations(created_at DESC);

-- Enable RLS
ALTER TABLE public.cartoon_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own generations
CREATE POLICY "Users can view their own generations"
  ON public.cartoon_generations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations"
  ON public.cartoon_generations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generations"
  ON public.cartoon_generations
  FOR DELETE
  USING (auth.uid() = user_id);