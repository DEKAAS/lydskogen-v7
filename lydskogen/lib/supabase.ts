import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for frontend (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (has elevated permissions)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Types for our database tables
export interface MusicTrack {
  id: string
  title: string
  artist: string
  genre: string
  price: number
  audio_url: string
  description: string
  duration: string
  bpm?: number
  key?: string
  tags: string[]
  uploaded_at: string
  is_uploaded: boolean
  is_new?: boolean
  status?: 'available' | 'sold' | 'pending'
}

export interface ArtworkItem {
  id: string
  title: string
  category: string
  price: number
  image_url: string
  description: string
  tags: string[]
  uploaded_at: string
  is_new?: boolean
  status?: 'available' | 'sold' | 'pending'
}