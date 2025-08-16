import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: musicTracks, error } = await supabaseAdmin
      .from('music_tracks')
      .select('*')
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // First get the music track to find the audio URL
    const { data: track, error: fetchError } = await supabaseAdmin
      .from('music_tracks')
      .select('audio_url')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching track:', fetchError)
      return NextResponse.json({ error: 'Track not found' }, { status: 404 })
    }

    // Extract filename from URL to delete from storage
    const audioUrl = track.audio_url
    const filename = audioUrl.split('/').pop()

    // Delete from storage
    if (filename) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('music-files')
        .remove([filename])

      if (storageError) {
        console.error('Error deleting from storage:', storageError)
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('music_tracks')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting track:', deleteError)
      return NextResponse.json({ error: 'Failed to delete track' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Track deleted successfully' })

  } catch (error) {
    console.error('Error deleting track:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const { status, isNew } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updates: any = {}
    if (status !== undefined) updates.status = status
    if (isNew !== undefined) updates.is_new = isNew

    const { data, error } = await supabaseAdmin
      .from('music_tracks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating track:', error)
      return NextResponse.json({ error: 'Failed to update track' }, { status: 500 })
    }

    // Transform response
    const transformedTrack = {
      id: data.id,
      title: data.title,
      artist: data.artist,
      genre: data.genre,
      price: data.price,
      audioUrl: data.audio_url,
      description: data.description,
      duration: data.duration,
      bpm: data.bpm,
      key: data.key,
      tags: data.tags,
      uploadedAt: data.uploaded_at,
      isUploaded: data.is_uploaded,
      isNew: data.is_new,
      status: data.status
    }

    return NextResponse.json({ music: transformedTrack })

  } catch (error) {
    console.error('Error updating track:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}