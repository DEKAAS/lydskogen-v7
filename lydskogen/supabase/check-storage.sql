-- Sjekk om storage buckets eksisterer
SELECT 
  name as bucket_name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE name IN ('music-files', 'artwork-images')
ORDER BY name;

-- Sjekk storage policies
SELECT 
  name as policy_name,
  bucket_id,
  definition
FROM storage.policies
WHERE bucket_id IN ('music-files', 'artwork-images')
ORDER BY bucket_id, name;

