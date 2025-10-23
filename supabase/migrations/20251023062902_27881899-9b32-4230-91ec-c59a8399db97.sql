-- AI Learning & Recommendation Tables

-- User preferences learned by AI
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  preference_type text NOT NULL, -- 'place_type', 'price_range', 'time_of_day', 'neighborhood'
  preference_value text NOT NULL,
  confidence_score decimal DEFAULT 0.5, -- AI confidence in this preference (0-1)
  learned_from text, -- 'interaction', 'explicit', 'pattern'
  interaction_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI-generated recommendations
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL, -- 'place', 'event', 'itinerary', 'date_idea'
  recommendation_data jsonb NOT NULL, -- flexible data structure
  confidence_score decimal DEFAULT 0.5,
  reason text, -- why AI recommended this
  shown_at timestamptz,
  interacted_at timestamptz,
  interaction_type text, -- 'viewed', 'saved', 'dismissed', 'completed'
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- User activity log for AI learning
CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL, -- 'place_view', 'place_save', 'search', 'filter_change', 'plan_create'
  activity_data jsonb NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- OKC events cache (scraped/discovered by AI)
CREATE TABLE IF NOT EXISTS public.okc_events_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_type text, -- 'concert', 'festival', 'sports', 'art', 'food'
  venue_name text,
  venue_address text,
  event_date date NOT NULL,
  event_time time,
  description text,
  price_range text,
  url text,
  discovered_by text DEFAULT 'ai_agent',
  relevance_score decimal DEFAULT 0.5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_user_preferences_user ON public.user_preferences(user_id);
CREATE INDEX idx_user_preferences_type ON public.user_preferences(preference_type);
CREATE INDEX idx_ai_recommendations_user ON public.ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_expires ON public.ai_recommendations(expires_at);
CREATE INDEX idx_user_activity_user ON public.user_activity_log(user_id);
CREATE INDEX idx_user_activity_timestamp ON public.user_activity_log(timestamp);
CREATE INDEX idx_okc_events_date ON public.okc_events_cache(event_date);

-- RLS Policies
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okc_events_cache ENABLE ROW LEVEL SECURITY;

-- Users can view/manage their own data
CREATE POLICY "Users manage their preferences"
  ON public.user_preferences
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage their recommendations"
  ON public.ai_recommendations
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage their activity"
  ON public.user_activity_log
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Everyone can view events
CREATE POLICY "Everyone can view events"
  ON public.okc_events_cache
  FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_okc_events_updated_at
  BEFORE UPDATE ON public.okc_events_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();