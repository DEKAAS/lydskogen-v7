import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: musicTracks, error } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('status', 'available')
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error fetching music tracks:', error)
      return NextResponse.json({ music: [] })
    }

    // Transform database format to frontend format
    const transformedMusic = musicTracks.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      genre: track.genre,
      price: track.price,
      audioUrl: track.audio_url,
      description: track.description,
      duration: track.duration,
      bpm: track.bpm,
      key: track.key,
      tags: track.tags,
      uploadedAt: track.uploaded_at,
      isUploaded: track.is_uploaded,
      isNew: track.is_new,
      status: track.status
    }))

    return NextResponse.json({ music: transformedMusic })

  } catch (error) {
    console.error('Error fetching music tracks:', error)
    return NextResponse.json({ music: [] })
  }
}