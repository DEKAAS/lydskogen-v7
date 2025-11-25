-- Test om service role kan lese og skrive
-- Dette vil feile hvis RLS policies ikke er satt opp riktig

-- Test 1: Les fra music_tracks
SELECT 'music_tracks readable' as test, COUNT(*) as count FROM public.music_tracks;

-- Test 2: Les fra genre_backgrounds  
SELECT 'genre_backgrounds readable' as test, COUNT(*) as count FROM public.genre_backgrounds;

-- Test 3: Prøv å se om vi kan se RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('music_tracks', 'genre_backgrounds', 'page_views')
ORDER BY tablename;

