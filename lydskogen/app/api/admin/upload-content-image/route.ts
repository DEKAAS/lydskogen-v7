import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    // Verify Supabase connection
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Server configuration error: Supabase client not initialized" }, { status: 500 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const key = data.get('key') as string || 'content_image'

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload image files only." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine output format and extension based on input
    let outputFormat: 'jpeg' | 'png' | 'webp' = 'jpeg';
    let outputContentType = 'image/jpeg';
    let fileExtension = 'jpg';

    if (file.type === 'image/png') {
      outputFormat = 'png';
      outputContentType = 'image/png';
      fileExtension = 'png';
    } else if (file.type === 'image/webp') {
      outputFormat = 'webp';
      outputContentType = 'image/webp';
      fileExtension = 'webp';
    }

    // Process image with Sharp
    let processedBuffer: Buffer
    try {
      // Resize if it's very large, otherwise just optimize
      // For backgrounds, 1920px width is reasonable
      const pipeline = sharp(buffer)
        .resize({ width: 1920, withoutEnlargement: true });

      if (outputFormat === 'png') {
        processedBuffer = await pipeline.png({ quality: 85 }).toBuffer();
      } else if (outputFormat === 'webp') {
        processedBuffer = await pipeline.webp({ quality: 85 }).toBuffer();
      } else {
        processedBuffer = await pipeline.jpeg({ quality: 85 }).toBuffer();
      }
    } catch (sharpError) {
      console.error('Sharp processing error:', sharpError)
      return NextResponse.json({ 
        error: "Failed to process image",
        details: sharpError instanceof Error ? sharpError.message : 'Unknown image processing error'
      }, { status: 500 })
    }

    // Create unique filename
    const timestamp = Date.now()
    const filename = `content/${key}_${timestamp}.${fileExtension}`

    // Upload to Supabase Storage (using artwork-images bucket)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('artwork-images')
      .upload(filename, processedBuffer, {
        contentType: outputContentType,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json({ error: "Failed to upload image to storage" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('artwork-images')
      .getPublicUrl(filename)

    return NextResponse.json({ 
      message: "Image uploaded successfully",
      url: urlData.publicUrl
    })

  } catch (error) {
    console.error("Error uploading content image:", error)
    return NextResponse.json({ 
      error: "Error uploading image",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
