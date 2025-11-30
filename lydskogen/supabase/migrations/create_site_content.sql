-- Create site_content table for dynamic settings
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  section TEXT DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(key);
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Public read access" ON site_content
  FOR SELECT USING (true);

-- Policy: Admin write access (service role only for now, or admin user)
CREATE POLICY "Admin write access" ON site_content
  FOR ALL USING (true) WITH CHECK (true); -- Adjust this if you have strict RLS auth

