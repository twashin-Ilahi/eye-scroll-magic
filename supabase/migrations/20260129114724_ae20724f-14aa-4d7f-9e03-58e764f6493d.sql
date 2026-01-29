-- Create downloads tracking table
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('mac', 'windows')),
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_hash TEXT -- Optional: for preventing spam, can store hashed IPs
);

-- Enable RLS but allow public inserts (for anonymous downloads)
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert downloads (public downloads)
CREATE POLICY "Anyone can record a download"
ON public.downloads
FOR INSERT
WITH CHECK (true);

-- Allow anyone to count downloads (for displaying stats)
CREATE POLICY "Anyone can view download stats"
ON public.downloads
FOR SELECT
USING (true);

-- Create index for faster counting by platform
CREATE INDEX idx_downloads_platform ON public.downloads(platform);
CREATE INDEX idx_downloads_downloaded_at ON public.downloads(downloaded_at);