import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import sharp from 'sharp'

const ALLOWED_GENRES = ['ambient', 'hiphop', 'lofi', 'soundscape']

export async function POST(request: NextRequest) {
  try {
    // Verify Supabase connection and environment variables
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized')
      return NextResponse.json({ error: "Server configuration error: Supabase client not initialized" }, { status: 500 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json({ error: "Server configuration error: Missing Supabase credentials" }, { status: 500 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const genreId = data.get('genreId') as string

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 })
    }

    if (!genreId || !ALLOWED_GENRES.includes(genreId)) {
      return NextResponse.json({ error: `Invalid genre ID. Must be one of: ${ALLOWED_GENRES.join(', ')}` }, { status: 400 })
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
    let processedBuffer: Buffer
    try {
      processedBuffer = await sharp(buffer)
        .resize(1920, 1080, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toBuffer()
    } catch (sharpError) {
      console.error('Sharp processing error:', sharpError)
      return NextResponse.json({
        error: "Failed to process image",
        details: sharpError instanceof Error ? sharpError.message : 'Unknown image processing error'
      }, { status: 500 })
    }

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
    // First check if record exists
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('genre_backgrounds')
      .select('id')
      .eq('genre_id', genreId)
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned, which is fine
      console.error('Error checking existing record:', checkError)
    }

    let backgroundData
    let dbError

    if (existing) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from('genre_backgrounds')
        .update({
          background_image_url: urlData.publicUrl
        })
        .eq('genre_id', genreId)
        .select()
        .single()
      backgroundData = data
      dbError = error
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from('genre_backgrounds')
        .insert({
          genre_id: genreId,
          background_image_url: urlData.publicUrl
        })
        .select()
        .single()
      backgroundData = data
      dbError = error
    }

    if (dbError) {
      console.error('Database error details:', {
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        code: dbError.code
      })
      // Try to clean up uploaded file
      await supabaseAdmin.storage.from('artwork-images').remove([filename])
      return NextResponse.json({
        error: "Failed to save background metadata",
        details: dbError.message || 'Unknown database error',
        code: dbError.code
      }, { status: 500 })
    }

    return NextResponse.json({
      message: "Background image uploaded successfully",
      background: backgroundData
    })

  } catch (error) {
    console.error("Error uploading background image:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({
      error: "Error uploading background image",
      details: errorMessage
    }, { status: 500 })
  }
}

