-- Create table for tracking phone number rate limiting
CREATE TABLE IF NOT EXISTS public.phone_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  last_send_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  send_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_phone_rate_limits_phone ON public.phone_rate_limits(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_rate_limits_last_send ON public.phone_rate_limits(last_send_at);

-- Enable RLS
ALTER TABLE public.phone_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits (no user access needed)
CREATE POLICY "System can manage phone rate limits"
ON public.phone_rate_limits
FOR ALL
USING (false);