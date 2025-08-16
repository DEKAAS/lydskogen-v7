import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { mkdir } from 'fs/promises'
import path from 'path'
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

    // Create filename with timestamp to avoid conflicts
    const timestamp = Date.now()
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/images/artwork')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    const filepath = path.join(uploadDir, filename)

    // Process image with Sharp for optimization
    await sharp(buffer)
      .resize(1200, 1200, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toFile(filepath)

    // Create artwork item data
    const artworkItem = {
      id: `artwork-${timestamp}`,
      title: title || `Uploaded ${timestamp}`,
      category: category,
      price: parseInt(price) || 200,
      imageUrl: `/images/artwork/${filename}`,
      description: description || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: 'available',
      isNew: false,
      uploadedAt: new Date().toISOString(),
      isUploaded: true
    }

    // Store metadata in a simple JSON file for persistence
    try {
      const { writeFile } = require('fs/promises')
      const metadataPath = path.join(process.cwd(), 'public/images/artwork', `${timestamp}_metadata.json`)
      await writeFile(metadataPath, JSON.stringify(artworkItem, null, 2))
    } catch (error) {
      console.error('Error saving metadata:', error)
    }

    return NextResponse.json({ 
      message: "File uploaded successfully",
      artwork: artworkItem
    })

  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
  }
}