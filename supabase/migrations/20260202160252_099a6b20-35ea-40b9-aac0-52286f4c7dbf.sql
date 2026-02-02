-- Create join_requests table for storing applications
CREATE TABLE public.join_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  role_type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  skills TEXT,
  portfolio_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a join request (INSERT)
CREATE POLICY "Anyone can submit join requests"
ON public.join_requests
FOR INSERT
WITH CHECK (true);

-- Only admins can view join requests
CREATE POLICY "Admins can view join requests"
ON public.join_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Only admins can update join requests
CREATE POLICY "Admins can update join requests"
ON public.join_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Only admins can delete join requests
CREATE POLICY "Admins can delete join requests"
ON public.join_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'));