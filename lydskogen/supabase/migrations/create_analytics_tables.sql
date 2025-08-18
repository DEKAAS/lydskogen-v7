-- Create analytics tables for tracking website analytics

-- Page views table
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  session_id TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('click', 'form_submit', 'audio_play', 'scroll', 'download', 'custom')),
  event_name TEXT NOT NULL,
  page_url TEXT NOT NULL,
  element_selector TEXT,
  element_text TEXT,
  properties JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active sessions table for real-time tracking
CREATE TABLE IF NOT EXISTS public.active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  page_url TEXT NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views (created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_page_url ON public.page_views (page_url);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views (session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events (created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events (session_id);

CREATE INDEX IF NOT EXISTS idx_active_sessions_session_id ON public.active_sessions (session_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_seen ON public.active_sessions (last_seen);

-- Enable RLS (Row Level Security)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Create orders table to replace JSON file storage
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('contact', 'artwork', 'music-production', 'custom-artwork')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT,
  form_data JSONB,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processing', 'completed', 'cancelled')),
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for orders
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON public.orders (type);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public access for analytics (since we're tracking anonymous users)
CREATE POLICY "Allow public access to page_views" ON public.page_views FOR ALL USING (true);
CREATE POLICY "Allow public access to analytics_events" ON public.analytics_events FOR ALL USING (true);
CREATE POLICY "Allow public access to active_sessions" ON public.active_sessions FOR ALL USING (true);

-- Admin access for orders
CREATE POLICY "Allow admin access to orders" ON public.orders FOR ALL USING (true);