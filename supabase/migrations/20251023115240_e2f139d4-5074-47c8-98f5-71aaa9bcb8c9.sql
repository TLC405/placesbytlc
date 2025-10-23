-- Create table for app settings controlled by admins
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can read app settings"
ON public.app_settings
FOR SELECT
TO authenticated, anon
USING (true);

-- Only admins can update settings
CREATE POLICY "Only admins can update settings"
ON public.app_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default Cupid visibility setting
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES ('cupid_visible', '{"enabled": true}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger to update timestamp
CREATE OR REPLACE FUNCTION public.update_app_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_app_settings_timestamp
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_app_settings_timestamp();