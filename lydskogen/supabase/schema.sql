-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create music_tracks table
CREATE TABLE public.music_tracks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL DEFAULT 'Lydskog',
  genre VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  audio_url TEXT NOT NULL,
  description TEXT,
  duration VARCHAR(20),
  bpm INTEGER,
  key VARCHAR(10),
  tags TEXT[] DEFAULT '{}',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_uploaded BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artwork_items table
CREATE TABLE public.artwork_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_new BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table for future use
CREATE TABLE public.admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on music_tracks" ON public.music_tracks
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on artwork_items" ON public.artwork_items
  FOR SELECT USING (true);

-- Create policies for admin access (will need to be updated when we implement proper auth)
CREATE POLICY "Allow all operations for service role on music_tracks" ON public.music_tracks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow all operations for service role on artwork_items" ON public.artwork_items
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow all operations for service role on admin_users" ON public.admin_users
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_music_tracks_genre ON public.music_tracks(genre);
CREATE INDEX idx_music_tracks_status ON public.music_tracks(status);
CREATE INDEX idx_music_tracks_uploaded_at ON public.music_tracks(uploaded_at);

CREATE INDEX idx_artwork_items_category ON public.artwork_items(category);
CREATE INDEX idx_artwork_items_status ON public.artwork_items(status);
CREATE INDEX idx_artwork_items_uploaded_at ON public.artwork_items(uploaded_at);

-- Create functions for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_music_tracks_updated_at BEFORE UPDATE ON public.music_tracks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artwork_items_updated_at BEFORE UPDATE ON public.artwork_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();