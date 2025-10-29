-- Create app_role enum (skip if exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

-- Create user_roles table (skip if exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Enable RLS on discovered_places and add policies
ALTER TABLE public.discovered_places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read places" ON public.discovered_places;
DROP POLICY IF EXISTS "Admins can insert places" ON public.discovered_places;
DROP POLICY IF EXISTS "Admins can update places" ON public.discovered_places;
DROP POLICY IF EXISTS "Admins can delete places" ON public.discovered_places;

CREATE POLICY "Public can read places"
  ON public.discovered_places FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert places"
  ON public.discovered_places FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update places"
  ON public.discovered_places FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete places"
  ON public.discovered_places FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(key)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON public.rate_limits;

CREATE POLICY "Service role only"
  ON public.rate_limits FOR ALL
  USING (false);

-- Rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _key TEXT,
  _max_requests INTEGER,
  _window_minutes INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _count INTEGER;
  _window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT count, window_start INTO _count, _window_start
  FROM public.rate_limits
  WHERE key = _key;
  
  IF _count IS NULL OR now() > _window_start + (_window_minutes || ' minutes')::INTERVAL THEN
    INSERT INTO public.rate_limits (key, count, window_start)
    VALUES (_key, 1, now())
    ON CONFLICT (key) DO UPDATE
    SET count = 1, window_start = now();
    RETURN true;
  END IF;
  
  IF _count < _max_requests THEN
    UPDATE public.rate_limits
    SET count = count + 1
    WHERE key = _key;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;