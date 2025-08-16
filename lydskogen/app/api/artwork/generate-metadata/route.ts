import { NextResponse } from 'next/server'
import { readdir, stat, writeFile } from 'fs/promises'
import path from 'path'

export async function POST() {
  try {
    const artworkDir = path.join(process.cwd(), 'public/images/artwork')
    const files = await readdir(artworkDir)
    const ops: Promise<any>[] = []
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        const timestamp = file.split('_')[0]
        const metaPath = path.join(artworkDir, `${timestamp}_metadata.json`)
        const filePath = path.join(artworkDir, file)
        const s = await stat(filePath)
        const [, ...titleParts] = file.replace(/\.[^/.]+$/, "").split('_')
        const title = titleParts.join(' ').replace(/[_-]/g, ' ') || 'Artwork'
        const data = {
          id: `uploaded-${timestamp}`,
          title,
          category: 'gallery',
          price: 200,
          imageUrl: `/images/artwork/${file}`,
          description: 'Artwork',
          tags: [],
          status: 'available',
          isNew: false,
          uploadedAt: s.birthtime.toISOString(),
          isUploaded: true
        }
        ops.push(writeFile(metaPath, JSON.stringify(data, null, 2)))
      }
    }
    await Promise.all(ops)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}


