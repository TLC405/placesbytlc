-- Update the trigger function to only update analytics for authenticated users
-- This prevents the error when trying to insert null user_id
CREATE OR REPLACE FUNCTION public.update_user_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only update analytics if user_id is present (authenticated session)
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO user_analytics (user_id, total_sessions, last_ip_address, last_seen)
    VALUES (NEW.user_id, 1, NEW.ip_address, now())
    ON CONFLICT (user_id) DO UPDATE SET
      total_sessions = user_analytics.total_sessions + 1,
      last_ip_address = NEW.ip_address,
      last_seen = now(),
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;