-- Fix handle_new_user to whitelist roles and prevent privilege escalation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name');
  
  -- Whitelist only 'user' and 'tester' roles from signup
  -- Never allow 'admin' or 'moderator' from client signup
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    CASE 
      WHEN new.raw_user_meta_data->>'role' = 'tester' THEN 'tester'::app_role
      ELSE 'user'::app_role
    END
  );
  
  RETURN new;
END;
$$;