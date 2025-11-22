import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import sharp from 'sharp'

const ALLOWED_GENRES = ['ambient', 'hiphop', 'lofi', 'soundscape']

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const genreId = data.get('genreId') as string

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 })
    }

    if (!genreId || !ALLOWED_GENRES.includes(genreId)) {
      return NextResponse.json({ error: "Invalid genre ID" }, { status: 400 })
    }

    // Validate file type (image files)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload image files only." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process image with Sharp for optimization
    // Resize to 1920x1080 (16:9) maintaining aspect ratio, fit inside
    const processedBuffer = await sharp(buffer)
      .resize(1920, 1080, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toBuffer()

    // Create filename with timestamp to avoid conflicts
    const timestamp = Date.now()
    const filename = `genre_${genreId}_${timestamp}.jpg`

    // Upload processed image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('artwork-images')
      .upload(filename, processedBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json({ error: "Failed to upload image to storage" }, { status: 500 })
    }

    // Get public URL for the uploaded image
    const { data: urlData } = supabaseAdmin.storage
      .from('artwork-images')
      .getPublicUrl(filename)

    // Upsert record in database (update if exists, insert if not)
    const { data: backgroundData, error: dbError } = await supabaseAdmin
      .from('genre_backgrounds')
      .upsert({
        genre_id: genreId,
        background_image_url: urlData.publicUrl
      }, {
        onConflict: 'genre_id'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Try to clean up uploaded file
      await supabaseAdmin.storage.from('artwork-images').remove([filename])
      return NextResponse.json({ error: "Failed to save background metadata" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Background image uploaded successfully",
      background: backgroundData
    })

  } catch (error) {
    console.error("Error uploading background image:", error)
    return NextResponse.json({ error: "Error uploading background image" }, { status: 500 })
  }
}

