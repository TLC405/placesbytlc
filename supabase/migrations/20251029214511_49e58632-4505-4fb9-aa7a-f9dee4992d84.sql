-- Fix foreign key constraint to allow user deletion
ALTER TABLE public.app_settings
DROP CONSTRAINT IF EXISTS app_settings_updated_by_fkey;

-- Re-add with CASCADE to handle deletions properly
ALTER TABLE public.app_settings
ADD CONSTRAINT app_settings_updated_by_fkey
FOREIGN KEY (updated_by)
REFERENCES auth.users(id)
ON DELETE SET NULL;