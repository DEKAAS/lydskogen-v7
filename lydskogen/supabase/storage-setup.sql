-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('music-files', 'music-files', true),
  ('artwork-images', 'artwork-images', true);

-- Create storage policies for public read access
CREATE POLICY "Allow public read access on music-files bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'music-files');

CREATE POLICY "Allow public read access on artwork-images bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'artwork-images');

-- Create storage policies for admin uploads (service role)
CREATE POLICY "Allow service role to upload music files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'music-files' AND auth.role() = 'service_role');

CREATE POLICY "Allow service role to upload artwork images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artwork-images' AND auth.role() = 'service_role');

CREATE POLICY "Allow service role to update music files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'music-files' AND auth.role() = 'service_role');

CREATE POLICY "Allow service role to update artwork images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'artwork-images' AND auth.role() = 'service_role');

CREATE POLICY "Allow service role to delete music files" ON storage.objects
  FOR DELETE USING (bucket_id = 'music-files' AND auth.role() = 'service_role');

CREATE POLICY "Allow service role to delete artwork images" ON storage.objects
  FOR DELETE USING (bucket_id = 'artwork-images' AND auth.role() = 'service_role');