-- Fix search_path for the function
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Recreate trigger for discovered_places
CREATE TRIGGER update_discovered_places_updated_at
  BEFORE UPDATE ON public.discovered_places
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();