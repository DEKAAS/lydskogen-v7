-- Insert sample music tracks
INSERT INTO public.music_tracks (
  title, artist, genre, price, audio_url, description, duration, bpm, key, tags, is_new, status
) VALUES
  (
    'Midnight Waves',
    'Lydskog',
    'ambient',
    299,
    'https://lydskogen.vercel.app/audio/ambient-sample.mp3',
    'En rolig ambient-komposisjon som tar deg med på en reise gjennom stille nattlige landskap. Perfect for meditasjon og avslapning.',
    '4:32',
    70,
    'Dm',
    ARRAY['ambient', 'meditation', 'calm', 'atmospheric'],
    true,
    'available'
  ),
  (
    'Urban Dreams',
    'Lydskog',
    'hip-hop',
    399,
    'https://lydskogen.vercel.app/audio/hiphop-sample.mp3',
    'Moderne hip-hop beat med kraftige drums og atmosfæriske synth-lag. Klar for vokal eller instrumentalt bruk.',
    '3:45',
    85,
    'Gm',
    ARRAY['hip-hop', 'urban', 'beats', 'modern'],
    true,
    'available'
  ),
  (
    'Coffee Shop Vibes',
    'Lydskog',
    'lo-fi',
    249,
    'https://lydskogen.vercel.app/audio/lofi-sample.mp3',
    'Chill lo-fi track med varme vinyl-lyder og myke melodier. Perfect som bakgrunnsmusikk for arbeid eller avslapping.',
    '3:12',
    65,
    'C',
    ARRAY['lo-fi', 'chill', 'study', 'vinyl'],
    false,
    'available'
  ),
  (
    'Forest Echoes',
    'Lydskog',
    'soundscape',
    349,
    'https://lydskogen.vercel.app/audio/soundscape-sample.mp3',
    'Naturlig lydlandskap med skoglyder, fuglekvitter og myke ambient-teksturer. Ideal for lyddesign og film.',
    '5:18',
    null,
    null,
    ARRAY['soundscape', 'nature', 'forest', 'ambient'],
    false,
    'available'
  ),
  (
    'Neon Nights',
    'Lydskog',
    'ambient',
    329,
    'https://lydskogen.vercel.app/audio/ambient-sample2.mp3',
    'Synthwave-inspirert ambient med retrowave-elementer og atmospheriske pad-lyder.',
    '4:05',
    75,
    'Am',
    ARRAY['ambient', 'synthwave', 'retro', 'atmospheric'],
    false,
    'available'
  ),
  (
    'Street Flow',
    'Lydskog',
    'hip-hop',
    449,
    'https://lydskogen.vercel.app/audio/hiphop-sample2.mp3',
    'Groovy hip-hop instrumentals med funky basslinjer og crisp drums. Ready for rap vocals.',
    '3:28',
    90,
    'Em',
    ARRAY['hip-hop', 'funky', 'groovy', 'rap'],
    true,
    'available'
  );

-- Insert sample artwork items
INSERT INTO public.artwork_items (
  title, category, price, image_url, description, tags, is_new, status
) VALUES
  (
    'Abstract Dreams Album Cover',
    'gallery',
    599,
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=800&fit=crop',
    'Moderne abstrakt albumcover med flytende former og vibrant fargepalet. Perfect for elektronisk musikk.',
    ARRAY['abstract', 'album-cover', 'electronic', 'colorful'],
    true,
    'available'
  ),
  (
    'Minimalist Logo Design',
    'gallery',
    799,
    'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=800&fit=crop',
    'Clean og moderne logo-design med minimalistisk tilnærming. Skalerbart for alle plattformer.',
    ARRAY['logo', 'minimalist', 'modern', 'branding'],
    true,
    'available'
  ),
  (
    'Vintage Poster Art',
    'gallery',
    449,
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop',
    'Retro-inspirert poster med vintage typografi og teksturer. Perfect for konsert-promotering.',
    ARRAY['poster', 'vintage', 'retro', 'concert'],
    false,
    'available'
  ),
  (
    'Digital Art Portrait',
    'gallery',
    699,
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
    'Digitalt kunstverk med moderne portrett-stil og kreativ fargebruk.',
    ARRAY['digital-art', 'portrait', 'modern', 'creative'],
    false,
    'available'
  ),
  (
    'Nature Album Cover',
    'gallery',
    549,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
    'Naturinspirert albumcover med landskap og organiske elementer. Perfect for ambient/acoustic musikk.',
    ARRAY['album-cover', 'nature', 'landscape', 'ambient'],
    false,
    'available'
  ),
  (
    'Urban Street Art Design',
    'gallery',
    629,
    'https://images.unsplash.com/photo-1578662996442-48f103fc96?w=800&h=800&fit=crop',
    'Grafitti-inspirert design med urban street art estetikk og bold farger.',
    ARRAY['street-art', 'urban', 'graffiti', 'bold'],
    true,
    'available'
  );

-- Refresh the sequences to ensure proper auto-increment
SELECT setval(pg_get_serial_sequence('music_tracks', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM music_tracks;
SELECT setval(pg_get_serial_sequence('artwork_items', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM artwork_items;