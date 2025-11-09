-- Add generation_type column to support both human2cartoon and toon2human
ALTER TABLE cartoon_generations 
ADD COLUMN IF NOT EXISTS generation_type TEXT DEFAULT 'human2cartoon' CHECK (generation_type IN ('human2cartoon', 'toon2human'));

-- Add character_name for preset characters
ALTER TABLE cartoon_generations 
ADD COLUMN IF NOT EXISTS character_name TEXT;

-- Add realistic_style for toon2human generations
ALTER TABLE cartoon_generations 
ADD COLUMN IF NOT EXISTS realistic_style TEXT;

-- Add gender_style for toon2human generations
ALTER TABLE cartoon_generations 
ADD COLUMN IF NOT EXISTS gender_style TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_generation_type ON cartoon_generations(generation_type, created_at DESC);