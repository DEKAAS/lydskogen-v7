import { NextResponse } from 'next/server'
import { readdir, stat, readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const artworkDir = path.join(process.cwd(), 'public/images/artwork')
    
    // Get all files in artwork directory
    const files = await readdir(artworkDir)
    
    // Filter metadata files and read them
    const artworkFiles = []
    for (const file of files) {
      if (file.endsWith('_metadata.json')) {
        try {
          const metadataPath = path.join(artworkDir, file)
          const metadataContent = await readFile(metadataPath, 'utf-8')
          const artworkData = JSON.parse(metadataContent)
          artworkFiles.push(artworkData)
        } catch (error) {
          console.error('Error reading metadata file:', file, error)
        }
      }
    }

    // Fallback: scan for image files without metadata to include legacy/static items
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        const timestamp = file.split('_')[0]
        const hasMetadata = artworkFiles.some((item: any) => (item.id === `artwork-${timestamp}` || item.id === `uploaded-${timestamp}`))
        if (!hasMetadata) {
          try {
            const filePath = path.join(artworkDir, file)
            const fileStat = await stat(filePath)
            const [, ...titleParts] = file.replace(/\.[^/.]+$/, "").split('_')
            const title = titleParts.join(' ').replace(/[_-]/g, ' ') || 'Artwork'
            artworkFiles.push({
              id: `uploaded-${timestamp}`,
              title,
              category: 'gallery',
              price: 200,
              imageUrl: `/images/artwork/${file}`,
              description: 'Artwork',
              tags: [],
              status: 'available',
              isNew: false,
              uploadedAt: fileStat.birthtime.toISOString(),
              isUploaded: true
            })
          } catch {}
        }
      }
    }

    // Sort by upload date (newest first)
    artworkFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({ artwork: artworkFiles })

  } catch (error) {
    console.error('Error fetching uploaded artwork:', error)
    return NextResponse.json({ artwork: [] })
  }
}