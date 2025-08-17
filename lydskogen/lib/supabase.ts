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

export interface PageView {
  id: string
  page_url: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  session_id?: string
  country?: string
  city?: string
  device_type?: 'desktop' | 'mobile' | 'tablet'
  browser?: string
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  session_id: string
  event_type: 'click' | 'form_submit' | 'audio_play' | 'scroll' | 'download' | 'custom'
  event_name: string
  page_url: string
  element_selector?: string
  element_text?: string
  properties?: Record<string, any>
  created_at: string
}

export interface ActiveSession {
  id: string
  session_id: string
  page_url: string
  last_seen: string
  user_agent?: string
  ip_address?: string
  country?: string
  device_type?: string
}

export interface AnalyticsStats {
  totalViews: number
  uniqueVisitors: number
  avgSessionDuration: string
  bounceRate: number
  activeVisitors: number
  topPages: Array<{
    page: string
    views: number
    percentage: number
  }>
  dailyViews: Array<{
    date: string
    views: number
  }>
  deviceStats: Array<{
    device: string
    count: number
    percentage: number
  }>
  geographicStats: Array<{
    country: string
    count: number
    percentage: number
  }>
  topEvents: Array<{
    event: string
    count: number
    percentage: number
  }>
  referrerStats: Array<{
    referrer: string
    count: number
    percentage: number
  }>
  hourlyViews: Array<{
    hour: number
    views: number
  }>
}