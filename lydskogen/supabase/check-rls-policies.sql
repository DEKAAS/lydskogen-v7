-- Sjekk RLS policies for music_tracks
SELECT 
  tablename,
  policyname,
  cmd as operation,
  qual as condition
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'music_tracks'
ORDER BY policyname;

-- Sjekk RLS policies for genre_backgrounds
SELECT 
  tablename,
  policyname,
  cmd as operation,
  qual as condition
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'genre_backgrounds'
ORDER BY policyname;

-- Sjekk RLS policies for page_views
SELECT 
  tablename,
  policyname,
  cmd as operation,
  qual as condition
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'page_views'
ORDER BY policyname;

-- Sjekk om RLS er aktivert
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('music_tracks', 'genre_backgrounds', 'page_views')
ORDER BY tablename;

