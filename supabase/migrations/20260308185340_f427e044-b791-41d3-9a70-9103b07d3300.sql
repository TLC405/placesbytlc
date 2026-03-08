
-- Create event source enum
CREATE TYPE public.event_source AS ENUM ('ticketmaster', 'eventbrite', 'meetup', 'manual', 'ai_generated');

-- Organizers table
CREATE TABLE public.organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  claimed BOOLEAN DEFAULT false,
  social_links JSONB DEFAULT '{}'::jsonb,
  raw JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Venues table
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT DEFAULT 'Oklahoma City',
  state TEXT DEFAULT 'OK',
  zip TEXT,
  lat NUMERIC,
  lng NUMERIC,
  raw JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source event_source NOT NULL DEFAULT 'manual',
  source_event_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  timezone TEXT DEFAULT 'America/Chicago',
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  organizer_id UUID REFERENCES public.organizers(id) ON DELETE SET NULL,
  ticket_url TEXT,
  event_url TEXT,
  price_min NUMERIC,
  price_max NUMERIC,
  currency TEXT DEFAULT 'USD',
  age_band JSONB,
  tags TEXT[] DEFAULT '{}',
  raw JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source, source_event_id)
);

-- Event signals (time-series for KHAOS)
CREATE TABLE public.event_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  signal_type TEXT NOT NULL,
  source TEXT,
  value NUMERIC DEFAULT 0,
  captured_at TIMESTAMPTZ DEFAULT now(),
  raw JSONB DEFAULT '{}'::jsonb
);

-- Organizer signals (time-series for KHAOS)
CREATE TABLE public.organizer_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES public.organizers(id) ON DELETE CASCADE NOT NULL,
  signal_type TEXT NOT NULL,
  source TEXT,
  value NUMERIC DEFAULT 0,
  captured_at TIMESTAMPTZ DEFAULT now(),
  raw JSONB DEFAULT '{}'::jsonb
);

-- KHAOS scores
CREATE TABLE public.khaos_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES public.organizers(id) ON DELETE CASCADE NOT NULL UNIQUE,
  score_total NUMERIC DEFAULT 0,
  components JSONB DEFAULT '{"reliability":0,"experience":0,"safety":0,"transparency":0,"media":0}'::jsonb,
  explain JSONB DEFAULT '{}'::jsonb,
  confidence TEXT DEFAULT 'low',
  scored_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khaos_scores ENABLE ROW LEVEL SECURITY;

-- Public read for all
CREATE POLICY "Public read organizers" ON public.organizers FOR SELECT USING (true);
CREATE POLICY "Public read venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read event_signals" ON public.event_signals FOR SELECT USING (true);
CREATE POLICY "Public read organizer_signals" ON public.organizer_signals FOR SELECT USING (true);
CREATE POLICY "Public read khaos_scores" ON public.khaos_scores FOR SELECT USING (true);

-- Admin write for organizers, venues, events
CREATE POLICY "Admin manage organizers" ON public.organizers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage venues" ON public.venues FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Signals + scores: service role only for writes (no authenticated insert)
CREATE POLICY "No user write event_signals" ON public.event_signals FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "No user write organizer_signals" ON public.organizer_signals FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "No user write khaos_scores" ON public.khaos_scores FOR INSERT TO authenticated WITH CHECK (false);

-- Indexes
CREATE INDEX idx_events_source ON public.events(source, source_event_id);
CREATE INDEX idx_events_starts_at ON public.events(starts_at);
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_events_venue ON public.events(venue_id);
CREATE INDEX idx_event_signals_event ON public.event_signals(event_id);
CREATE INDEX idx_organizer_signals_organizer ON public.organizer_signals(organizer_id);
CREATE INDEX idx_khaos_scores_organizer ON public.khaos_scores(organizer_id);
