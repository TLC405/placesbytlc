-- Create the update timestamp function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create table for AI-discovered date spots
CREATE TABLE IF NOT EXISTS public.discovered_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  lat NUMERIC,
  lng NUMERIC,
  category TEXT,
  description TEXT,
  source_url TEXT,
  facebook_verified BOOLEAN DEFAULT false,
  discovery_context TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discovered_places ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Places are viewable by everyone"
  ON public.discovered_places
  FOR SELECT
  USING (true);

-- Create index for location-based queries
CREATE INDEX idx_discovered_places_location ON public.discovered_places (lat, lng);
CREATE INDEX idx_discovered_places_city ON public.discovered_places (city);

-- Create trigger for updated_at
CREATE TRIGGER update_discovered_places_updated_at
  BEFORE UPDATE ON public.discovered_places
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();