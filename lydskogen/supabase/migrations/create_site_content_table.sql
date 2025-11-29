-- Create site_content table for dynamic text management
CREATE TABLE public.site_content (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  section VARCHAR(100) NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID -- Optional, link to user if needed
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on site_content" ON public.site_content
  FOR SELECT USING (true);

-- Allow service role (admin) full access
CREATE POLICY "Allow service role full access on site_content" ON public.site_content
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger for updated_at
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO public.site_content (key, value, section, description)
VALUES 
  ('hero_tagline', 'Når vi lytter til naturen, åpner den for detaljer vi ellers ville gått forbi. De samme nyansene prøver vi å fange i kunsten', 'hero', 'Hovedtekst under tittelen på forsiden')
ON CONFLICT (key) DO NOTHING;


