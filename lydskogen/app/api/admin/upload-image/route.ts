import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const category = data.get('category') as string || 'gallery'
    const title = data.get('title') as string
    const description = data.get('description') as string
    const price = data.get('price') as string
    const tags = data.get('tags') as string

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process image with Sharp for optimization
    const processedBuffer = await sharp(buffer)
      .resize(1200, 1200, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toBuffer()

    // Create filename with timestamp to avoid conflicts
    const timestamp = Date.now()
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}.jpg`

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

    // Insert record into database
    const { data: artworkData, error: dbError } = await supabaseAdmin
      .from('artwork_items')
      .insert({
        title: title || `Uploaded ${timestamp}`,
        category: category,
        price: parseFloat(price) || 200,
        image_url: urlData.publicUrl,
        description: description || '',
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        status: 'available' as 'available' | 'sold' | 'pending',
        is_new: false
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Try to clean up uploaded file
      await supabaseAdmin.storage.from('artwork-images').remove([filename])
      return NextResponse.json({ error: "Failed to save artwork metadata" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Image uploaded successfully",
      artwork: artworkData
    })

  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Error uploading image" }, { status: 500 })
  }
}