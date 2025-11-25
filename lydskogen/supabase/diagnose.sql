-- Diagnostisk SQL for å sjekke database-status
-- Kjør denne i Supabase SQL Editor

-- 1. Sjekk om tabellene eksisterer
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('music_tracks', 'genre_backgrounds', 'page_views', 'analytics_events', 'active_sessions')
ORDER BY table_name;

-- 2. Sjekk strukturen på music_tracks tabellen
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'music_tracks'
ORDER BY ordinal_position;

-- 3. Sjekk strukturen på genre_backgrounds tabellen
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'genre_backgrounds'
ORDER BY ordinal_position;

-- 4. Sjekk RLS policies for music_tracks
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'music_tracks';

-- 5. Sjekk RLS policies for genre_backgrounds
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'genre_backgrounds';

-- 6. Test om vi kan lese fra music_tracks (med service role)
-- Dette vil feile hvis RLS blokkerer
SELECT COUNT(*) as total_tracks FROM public.music_tracks;

-- 7. Test om vi kan lese fra genre_backgrounds
SELECT COUNT(*) as total_backgrounds FROM public.genre_backgrounds;

-- 8. Sjekk om storage buckets eksisterer
SELECT name, public, created_at
FROM storage.buckets
WHERE name IN ('music-files', 'artwork-images');

-- 9. Sjekk storage policies
SELECT name, bucket_id, definition
FROM storage.policies
WHERE bucket_id IN ('music-files', 'artwork-images');

