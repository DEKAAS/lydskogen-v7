import { NextResponse } from 'next/server'
import { readFile, writeFile, mkdir, stat } from 'fs/promises'
import path from 'path'

const PROJECTS_PATH = path.join(process.cwd(), 'data/projects.json')

async function ensureFile() {
  try { await stat(PROJECTS_PATH) } catch {
    await mkdir(path.dirname(PROJECTS_PATH), { recursive: true })
    await writeFile(PROJECTS_PATH, JSON.stringify({ projects: [] }, null, 2))
  }
}

export async function GET() {
  await ensureFile()
  const raw = await readFile(PROJECTS_PATH, 'utf-8')
  const json = JSON.parse(raw)
  return NextResponse.json({ projects: json.projects || [] })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, artworkUrl, musicUrl, description, tags } = body
    await ensureFile()
    const raw = await readFile(PROJECTS_PATH, 'utf-8')
    const json = JSON.parse(raw)
    const newProject = {
      id: `project-${Date.now()}`,
      title: title || 'Prosjekt',
      artworkUrl,
      musicUrl,
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date().toISOString()
    }
    json.projects.push(newProject)
    await writeFile(PROJECTS_PATH, JSON.stringify(json, null, 2))
    return NextResponse.json({ ok: true, project: newProject })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    await ensureFile()
    const raw = await readFile(PROJECTS_PATH, 'utf-8')
    const json = JSON.parse(raw)
    const idx = json.projects.findIndex((p: any) => p.id === id)
    if (idx === -1) return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 })
    json.projects[idx] = { ...json.projects[idx], ...updates }
    await writeFile(PROJECTS_PATH, JSON.stringify(json, null, 2))
    return NextResponse.json({ ok: true, project: json.projects[idx] })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body
    await ensureFile()
    const raw = await readFile(PROJECTS_PATH, 'utf-8')
    const json = JSON.parse(raw)
    json.projects = json.projects.filter((p: any) => p.id !== id)
    await writeFile(PROJECTS_PATH, JSON.stringify(json, null, 2))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}


