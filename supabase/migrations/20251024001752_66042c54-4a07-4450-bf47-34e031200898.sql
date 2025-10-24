-- Create SMS usage tracking table
CREATE TABLE IF NOT EXISTS public.sms_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  message_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'sent',
  is_free_message BOOLEAN DEFAULT false
);

-- Enable RLS on sms_usage
ALTER TABLE public.sms_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own SMS usage" ON public.sms_usage;
DROP POLICY IF EXISTS "Admins can view all SMS usage" ON public.sms_usage;
DROP POLICY IF EXISTS "System can insert SMS records" ON public.sms_usage;

-- Create SMS usage policies
CREATE POLICY "Users can view their own SMS usage"
ON public.sms_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all SMS usage"
ON public.sms_usage
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert SMS records"
ON public.sms_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update RLS policies for analytics tables to be admin-only
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.user_analytics;
DROP POLICY IF EXISTS "Only admins can view all analytics" ON public.user_analytics;
CREATE POLICY "Only admins can view all analytics"
ON public.user_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Only admins can view all sessions" ON public.user_sessions;
CREATE POLICY "Only admins can view all sessions"
ON public.user_sessions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view their own IP history" ON public.ip_history;
DROP POLICY IF EXISTS "Only admins can view all IP history" ON public.ip_history;
CREATE POLICY "Only admins can view all IP history"
ON public.ip_history
FOR SELECT
USING (has_role(auth.uid(), 'admin'));