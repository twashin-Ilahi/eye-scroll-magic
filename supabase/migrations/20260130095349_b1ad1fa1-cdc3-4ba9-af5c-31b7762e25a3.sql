-- Create bug_reports table
CREATE TABLE public.bug_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  report_type TEXT NOT NULL CHECK (report_type IN ('quick', 'detailed')),
  
  -- Quick report field
  quick_note TEXT,
  
  -- Detailed report fields
  title TEXT,
  category TEXT,
  platform TEXT,
  description TEXT,
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  email TEXT
);

-- Enable Row Level Security
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a bug report (insert)
CREATE POLICY "Anyone can submit bug reports"
ON public.bug_reports
FOR INSERT
WITH CHECK (true);

-- Only allow reading via backend/admin (no public read access)
-- This prevents users from seeing other people's bug reports