-- Enhanced user tracking tables

-- Add session tracking table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}'::jsonb,
  location_info JSONB DEFAULT '{}'::jsonb,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  total_duration INTEGER, -- in seconds
  pages_visited INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fingerprint TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Add IP address history table
CREATE TABLE IF NOT EXISTS public.ip_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  visit_count INTEGER DEFAULT 1,
  location_data JSONB DEFAULT '{}'::jsonb,
  risk_score NUMERIC DEFAULT 0,
  notes TEXT
);

-- Add user analytics summary table
CREATE TABLE IF NOT EXISTS public.user_analytics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_sessions INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  average_session_duration INTEGER DEFAULT 0,
  total_page_views INTEGER DEFAULT 0,
  unique_ips_count INTEGER DEFAULT 0,
  last_ip_address TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  account_created TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_segment TEXT DEFAULT 'new',
  engagement_score NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions"
  ON public.user_sessions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert sessions"
  ON public.user_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update sessions"
  ON public.user_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for ip_history
CREATE POLICY "Users can view their own IP history"
  ON public.ip_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all IP history"
  ON public.ip_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage IP history"
  ON public.ip_history FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for user_analytics
CREATE POLICY "Users can view their own analytics"
  ON public.user_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics"
  ON public.user_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage analytics"
  ON public.user_analytics FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_ip ON public.user_sessions(ip_address);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(is_active);
CREATE INDEX idx_ip_history_user_id ON public.ip_history(user_id);
CREATE INDEX idx_ip_history_ip ON public.ip_history(ip_address);
CREATE INDEX idx_user_analytics_segment ON public.user_analytics(user_segment);

-- Function to update session end time
CREATE OR REPLACE FUNCTION public.end_user_session(session_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_sessions
  SET 
    session_end = now(),
    is_active = false,
    total_duration = EXTRACT(EPOCH FROM (now() - session_start))::INTEGER
  WHERE id = session_id;
END;
$$;

-- Function to update user analytics
CREATE OR REPLACE FUNCTION public.update_user_analytics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_analytics (user_id, total_sessions, last_ip_address, last_seen)
  VALUES (NEW.user_id, 1, NEW.ip_address, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = user_analytics.total_sessions + 1,
    last_ip_address = NEW.ip_address,
    last_seen = now(),
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Trigger to update analytics on new session
CREATE TRIGGER update_analytics_on_session
  AFTER INSERT ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_analytics();