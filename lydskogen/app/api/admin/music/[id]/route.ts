import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, readdir, stat, unlink } from 'fs/promises'
import path from 'path'

const AUDIO_DIR = path.join(process.cwd(), 'public/audio')

async function findFileByTimestamp(timestamp: string) {
  const files = await readdir(AUDIO_DIR)
  const audio = files.find(f => f.startsWith(`${timestamp}_`) && f.match(/\.(mp3|wav|flac|aac|m4a)$/i))
  return audio ? { filename: audio, audioUrl: `/audio/${audio}` } : null
}

async function loadExistingMetadata(timestamp: string) {
  const metaPath = path.join(AUDIO_DIR, `${timestamp}_metadata.json`)
  try {
    const raw = await readFile(metaPath, 'utf-8')
    return { metaPath, data: JSON.parse(raw) }
  } catch {
    return { metaPath, data: null }
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id // e.g. music-123456789 or uploaded-music-123456
    const parts = id.split('-')
    const timestamp = parts[parts.length - 1]

    const body = await req.json()
    const { title, price, description, tags, status, isNew } = body || {}

    const { metaPath, data } = await loadExistingMetadata(timestamp)
    let base = data

    if (!base) {
      // reconstruct minimal metadata from file list
      const file = await findFileByTimestamp(timestamp)
      if (!file) {
        return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 })
      }
      base = {
        id: id,
        title: title || `Track ${timestamp}`,
        artist: 'Lydskog',
        genre: 'ambient',
        price: typeof price === 'number' ? price : 450,
        audioUrl: file.audioUrl,
        description: description || '',
        status: status || 'available',
        isNew: Boolean(isNew),
        duration: '',
        bpm: null,
        key: '',
        tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : []),
        uploadedAt: new Date().toISOString(),
        isUploaded: true
      }
    }

    const updated = {
      ...base,
      title: typeof title === 'string' ? title : base.title,
      price: typeof price === 'number' ? price : base.price,
      description: typeof description === 'string' ? description : base.description,
      status: typeof status === 'string' ? status : base.status,
      isNew: typeof isNew === 'boolean' ? isNew : base.isNew,
      tags: Array.isArray(tags)
        ? tags
        : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : base.tags)
    }

    await writeFile(metaPath, JSON.stringify(updated, null, 2))
    return NextResponse.json({ ok: true, music: updated })
  } catch (e) {
    console.error('Admin music PUT error', e)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const timestamp = id.split('-').pop() as string
    const metaPath = path.join(AUDIO_DIR, `${timestamp}_metadata.json`)
    try {
      await stat(metaPath)
      await unlink(metaPath)
    } catch {
      // ignore
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Admin music DELETE error', e)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}


