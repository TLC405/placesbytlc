-- Fix search_path for rate limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _key TEXT,
  _max_requests INTEGER,
  _window_minutes INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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