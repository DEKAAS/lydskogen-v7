import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const slug = (form.get('slug') as string) || 'unknown'
    const kind = (form.get('kind') as string) || 'image' // 'image' | 'audio'

    if (!file) {
      return NextResponse.json({ ok: false, error: 'NO_FILE' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const baseDir = kind === 'audio' ? path.join(process.cwd(), 'public', 'audio', 'genre_demos') : path.join(process.cwd(), 'public', 'images', 'genre_thumbs')
    await mkdir(baseDir, { recursive: true })

    const timestamp = Date.now()
    let url = ''
    if (kind === 'audio') {
      const safeName = `${slug}_${timestamp}.mp3`
      const outPath = path.join(baseDir, safeName)
      await writeFile(outPath, buffer)
      url = `/audio/genre_demos/${safeName}`
    } else {
      const safeName = `${slug}_${timestamp}.jpg`
      const outPath = path.join(baseDir, safeName)
      await sharp(buffer).resize(800, 800, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(outPath)
      url = `/images/genre_thumbs/${safeName}`
    }
    return NextResponse.json({ ok: true, url })
  } catch (e) {
    console.error('Thumbnail upload error', e)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}


