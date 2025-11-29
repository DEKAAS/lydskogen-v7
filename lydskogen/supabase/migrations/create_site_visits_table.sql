-- Create site_visits table for advanced analytics
CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page_path TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  referrer TEXT,
  device_type TEXT, -- 'mobile', 'desktop', 'tablet'
  session_id UUID -- To group visits by session
);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for tracking)
CREATE POLICY "Allow public insert on site_visits" ON public.site_visits
  FOR INSERT WITH CHECK (true);

-- Allow service role (admin) full access
CREATE POLICY "Allow service role full access on site_visits" ON public.site_visits
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON public.site_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_site_visits_page_path ON public.site_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_site_visits_session_id ON public.site_visits(session_id);

