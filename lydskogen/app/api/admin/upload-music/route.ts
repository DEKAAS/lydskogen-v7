import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { mkdir } from 'fs/promises'
import path from 'path'

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

    // Validate file type (audio files)
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/flac', 'audio/aac']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload audio files only." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create filename with timestamp to avoid conflicts
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/audio')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    const filepath = path.join(uploadDir, filename)

    // Write the file
    await writeFile(filepath, buffer)

    // Create music item data
    // Normalize genre to canonical slugs
    const normalizeGenre = (g: string) => {
      const lower = (g || '').toLowerCase()
      if (lower === 'hip-hop' || lower === 'hip hop' || lower === 'hiphop') return 'hiphop'
      if (lower === 'lo-fi' || lower === 'lofi' || lower === 'lo fi') return 'lofi'
      if (lower === 'soundscape') return 'soundscape'
      return 'ambient'
    }

    const normalizedGenre = normalizeGenre(genre)

    const musicItem = {
      id: `music-${timestamp}`,
      title: title || `Track ${timestamp}`,
      artist,
      genre: normalizedGenre,
      price: parseInt(price) || 450,
      audioUrl: `/audio/${filename}`,
      description: description || '',
      status: status,
      isNew: false,
      duration: duration || '',
      bpm: bpm ? parseInt(bpm) : null,
      key: key || '',
      tags: tags
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : [],
      uploadedAt: new Date().toISOString(),
      isUploaded: true
    }

    // Persist metadata alongside audio file for categorization
    try {
      const metadataPath = path.join(process.cwd(), 'public/audio', `${timestamp}_metadata.json`)
      await writeFile(metadataPath, JSON.stringify(musicItem, null, 2))
    } catch (metaErr) {
      console.error('Error saving music metadata:', metaErr)
    }

    return NextResponse.json({ 
      message: "Music file uploaded successfully",
      music: musicItem
    })

  } catch (error) {
    console.error("Error uploading music file:", error)
    return NextResponse.json({ error: "Error uploading music file" }, { status: 500 })
  }
}