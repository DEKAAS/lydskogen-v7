import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir, stat } from 'fs/promises'
import path from 'path'

const OVERRIDES_PATH = path.join(process.cwd(), 'data/genre_overrides.json')

async function ensureFile() {
  try {
    await stat(OVERRIDES_PATH)
  } catch {
    await mkdir(path.dirname(OVERRIDES_PATH), { recursive: true })
    await writeFile(OVERRIDES_PATH, JSON.stringify({ thumbnails: {}, demos: {} }, null, 2))
  }
}

export async function GET() {
  try {
    await ensureFile()
    const raw = await readFile(OVERRIDES_PATH, 'utf-8')
    const json = JSON.parse(raw)
    return NextResponse.json({ ok: true, overrides: { thumbnails: json.thumbnails || {}, demos: json.demos || {} } })
  } catch (e) {
    return NextResponse.json({ ok: false, overrides: { thumbnails: {}, demos: {} } }, { status: 200 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    await ensureFile()
    const raw = await readFile(OVERRIDES_PATH, 'utf-8')
    const current = JSON.parse(raw)
    const thumbnails = (body && body.thumbnails) || current.thumbnails || {}
    const demos = (body && body.demos) || current.demos || {}
    await writeFile(OVERRIDES_PATH, JSON.stringify({ thumbnails, demos }, null, 2))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}


