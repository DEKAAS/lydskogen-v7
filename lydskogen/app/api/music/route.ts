import { NextResponse } from 'next/server'
import { readdir, stat, readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const musicDir = path.join(process.cwd(), 'public/audio')
    
    // Check if directory exists
    try {
      await stat(musicDir)
    } catch {
      return NextResponse.json({ music: [] })
    }

    // Get all files in music directory
    const files = await readdir(musicDir)
    
    // Filter metadata files and read them
    const musicFiles = []
    for (const file of files) {
      if (file.endsWith('_metadata.json')) {
        try {
          const metadataPath = path.join(musicDir, file)
          const metadataContent = await readFile(metadataPath, 'utf-8')
          const musicData = JSON.parse(metadataContent)
          
          // Only include available tracks
          if (musicData.status === 'available') {
            musicFiles.push(musicData)
          }
        } catch (error) {
          console.error('Error reading metadata file:', file, error)
        }
      }
    }

    // Fallback fjernet for å unngå at slettede elementer dukker opp igjen

    // Sort by upload date (newest first)
    musicFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({ music: musicFiles })

  } catch (error) {
    console.error('Error fetching uploaded music:', error)
    return NextResponse.json({ music: [] })
  }
}