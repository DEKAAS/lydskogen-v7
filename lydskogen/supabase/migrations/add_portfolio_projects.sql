-- Portfolio projects table for showcasing client work
-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the portfolio_projects table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  description TEXT,
  artwork_url TEXT NOT NULL,
  spotify_url TEXT,
  website_url TEXT,
  music_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public read access on portfolio_projects"
  ON public.portfolio_projects FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for service role on portfolio_projects"
  ON public.portfolio_projects FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_created_at
  ON public.portfolio_projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_tags
  ON public.portfolio_projects USING GIN (tags);

-- Create trigger for automatic updated_at timestamp
-- Note: update_updated_at_column() function must exist (defined in schema.sql)
CREATE TRIGGER IF NOT EXISTS update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

