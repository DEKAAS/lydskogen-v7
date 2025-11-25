import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const genre = data.get('genre') as string || 'ambient'
    const title = data.get('title') as string
    const description = data.get('description') as string
    const price = data.get('price') as string
    const status = data.get('status') as string || 'available'
    const duration = data.get('duration') as string
    const bpm = data.get('bpm') as string
    const key = data.get('key') as string
    const artist = (data.get('artist') as string) || 'Lydskog'
    const tags = (data.get('tags') as string) || ''

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 })
    }

    // Validate file type (audio files) - more permissive check
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/flac', 'audio/aac', 'audio/wave', 'audio/x-wav', 'audio/x-mpeg']
    const fileExtension = file.name.toLowerCase().split('.').pop()
    const allowedExtensions = ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'mp4']
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      return NextResponse.json({ 
        error: `Invalid file type. Please upload audio files only. Received: ${file.type || 'unknown'}` 
      }, { status: 400 })
    }

    // Normalize genre to canonical slugs
    const normalizeGenre = (g: string) => {
      const lower = (g || '').toLowerCase()
      if (lower === 'hip-hop' || lower === 'hip hop' || lower === 'hiphop') return 'hiphop'
      if (lower === 'lo-fi' || lower === 'lofi' || lower === 'lo fi') return 'lofi'
      if (lower === 'soundscape') return 'soundscape'
      return 'ambient'
    }

    const normalizedGenre = normalizeGenre(genre)
    const timestamp = Date.now()
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Convert File to Buffer for Supabase Storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('music-files')
      .upload(filename, buffer, {
        contentType: file.type || 'audio/mpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)

      // Gi tydelig beskjed hvis filen er for stor
      const statusCode = (uploadError as any).statusCode || (uploadError as any).status
      if (statusCode === '413' || statusCode === 413) {
        return NextResponse.json(
          { error: 'Filen er for stor. Prøv en komprimert versjon (for eksempel MP3) eller en kortere fil.' },
          { status: 413 }
        )
      }

      return NextResponse.json(
        { error: 'Kunne ikke laste opp fil til lagring. Prøv igjen eller kontakt utvikler.' },
        { status: 500 }
      )
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabaseAdmin.storage
      .from('music-files')
      .getPublicUrl(filename)

    // Insert record into database
    const { data: musicData, error: dbError } = await supabaseAdmin
      .from('music_tracks')
      .insert({
        title: title || `Track ${timestamp}`,
        artist,
        genre: normalizedGenre,
        price: parseFloat(price) || 450,
        audio_url: urlData.publicUrl,
        description: description || '',
        status: status as 'available' | 'sold' | 'pending',
        is_new: false,
        duration: duration || '',
        bpm: bpm ? parseInt(bpm) : null,
        key: key || '',
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        is_uploaded: true
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error details:', {
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        code: dbError.code
      })
      // Try to clean up uploaded file
      await supabaseAdmin.storage.from('music-files').remove([filename])
      return NextResponse.json({ 
        error: "Failed to save music metadata",
        details: dbError.message || 'Unknown database error',
        code: dbError.code
      }, { status: 500 })
    }

    // Transform response to match frontend expectations
    const transformedMusic = {
      id: musicData.id,
      title: musicData.title,
      artist: musicData.artist,
      genre: musicData.genre,
      price: musicData.price,
      audioUrl: musicData.audio_url,
      description: musicData.description,
      duration: musicData.duration,
      bpm: musicData.bpm,
      key: musicData.key,
      tags: musicData.tags,
      uploadedAt: musicData.uploaded_at,
      isUploaded: musicData.is_uploaded,
      isNew: musicData.is_new,
      status: musicData.status
    }

    return NextResponse.json({ 
      message: "Music file uploaded successfully",
      music: transformedMusic
    })

  } catch (error) {
    console.error("Error uploading music file:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ 
      error: "Error uploading music file",
      details: errorMessage
    }, { status: 500 })
  }
}