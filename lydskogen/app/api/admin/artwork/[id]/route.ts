import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, readdir, stat, unlink } from 'fs/promises'
import path from 'path'

const ART_DIR = path.join(process.cwd(), 'public/images/artwork')

async function findFileByTimestamp(timestamp: string) {
  const files = await readdir(ART_DIR)
  const img = files.find(f => f.startsWith(`${timestamp}_`) && f.match(/\.(jpg|jpeg|png|gif|webp)$/i))
  return img ? { filename: img, imageUrl: `/images/artwork/${img}` } : null
}

async function loadExistingMetadata(timestamp: string) {
  const metaPath = path.join(ART_DIR, `${timestamp}_metadata.json`)
  try {
    const raw = await readFile(metaPath, 'utf-8')
    return { metaPath, data: JSON.parse(raw) }
  } catch {
    return { metaPath, data: null }
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id // artwork-<timestamp> or uploaded-<timestamp>
    const timestamp = id.split('-').pop() as string
    const body = await req.json()
    const { title, price, description, tags, status, isNew, category } = body || {}

    const { metaPath, data } = await loadExistingMetadata(timestamp)
    let base = data

    if (!base) {
      const file = await findFileByTimestamp(timestamp)
      if (!file) return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 })
      base = {
        id,
        title: title || `Uploaded ${timestamp}`,
        category: category || 'gallery',
        price: typeof price === 'number' ? price : 200,
        imageUrl: file.imageUrl,
        description: description || '',
        tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t: string)=>t.trim()) : []),
        status: status || 'available',
        isNew: Boolean(isNew),
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
      category: typeof category === 'string' ? category : base.category,
      tags: Array.isArray(tags)
        ? tags
        : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : base.tags)
    }
    // ensure id and imageUrl are preserved
    updated.id = base.id
    updated.imageUrl = base.imageUrl
    await writeFile(metaPath, JSON.stringify(updated, null, 2))
    return NextResponse.json({ ok: true, artwork: updated })
  } catch (e) {
    console.error('Admin artwork PUT error', e)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const timestamp = id.split('-').pop() as string
    const metaPath = path.join(ART_DIR, `${timestamp}_metadata.json`)
    try {
      await stat(metaPath)
      await unlink(metaPath)
    } catch {}
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Admin artwork DELETE error', e)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}


