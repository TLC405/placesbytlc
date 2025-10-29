-- Create tester_feedback table for collecting user feedback
CREATE TABLE IF NOT EXISTS public.tester_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  feature_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tester_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for tester_feedback
-- Allow anyone to insert feedback (even anonymous testers)
CREATE POLICY "Anyone can submit feedback"
  ON public.tester_feedback
  FOR INSERT
  WITH CHECK (true);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON public.tester_feedback
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tester_feedback_created_at ON public.tester_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tester_feedback_feature ON public.tester_feedback(feature_name);