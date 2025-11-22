-- Genre backgrounds table for custom background images per genre
CREATE TABLE IF NOT EXISTS public.genre_backgrounds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  genre_id VARCHAR(50) UNIQUE NOT NULL, -- 'ambient', 'hiphop', 'lofi', 'soundscape'
  background_image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.genre_backgrounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public read access on genre_backgrounds"
  ON public.genre_backgrounds FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for service role on genre_backgrounds"
  ON public.genre_backgrounds FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_genre_backgrounds_genre_id
  ON public.genre_backgrounds(genre_id);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_genre_backgrounds_updated_at
  BEFORE UPDATE ON public.genre_backgrounds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

