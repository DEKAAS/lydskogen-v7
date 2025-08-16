'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { genreData } from '@/data/genres'

type Music = {
  id: string
  title: string
  genre: string
  price: number
  description: string
  tags?: string[]
  status?: string
  isNew?: boolean
}

  type Artwork = {
  id: string
  title: string
  category: string
  price: number
    imageUrl: string
  description?: string
  tags?: string[]
  status?: string
  isNew?: boolean
}

export default function ManagePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [music, setMusic] = useState<Music[]>([])
  const [art, setArt] = useState<Artwork[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [thumbs, setThumbs] = useState<Record<string, string>>({})
  const [demos, setDemos] = useState<Record<string, string>>({})
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }
    Promise.all([
      fetch('/api/music').then(r => r.json()).then(d => setMusic(d.music || [])),
      fetch('/api/artwork').then(r => r.json()).then(d => setArt(d.artwork || [])),
      fetch('/api/genres/overrides').then(r => r.json()).then(d => {
        setThumbs((d.overrides?.thumbnails) || {})
        setDemos((d.overrides?.demos) || {})
      }).catch(()=>{})
    ]).catch(() => {})
  }, [session, status, router])

  const updateMusic = async (m: Music) => {
    setSaving(m.id)
    try {
      const res = await fetch(`/api/admin/music/${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: m.title,
          price: m.price,
          description: m.description,
          tags: m.tags || [],
          status: m.status,
          isNew: m.isNew
        })
      })
      const data = await res.json()
      if (data?.ok) {
        setMusic(list => list.map(x => x.id === m.id ? (data.music as Music) : x))
      }
    } finally {
      setSaving(null)
    }
  }

  const updateArt = async (a: Artwork) => {
    setSaving(a.id)
    try {
      const res = await fetch(`/api/admin/artwork/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: a.title,
          price: a.price,
          description: a.description,
          tags: a.tags || [],
          status: a.status,
          isNew: a.isNew,
          category: a.category
        })
      })
      const data = await res.json()
      if (data?.ok) {
        setArt(list => list.map(x => x.id === a.id ? (data.artwork as Artwork) : x))
      }
    } finally {
      setSaving(null)
    }
  }

  const saveThumbs = async () => {
    setSaving('thumbs')
    try {
      await fetch('/api/genres/overrides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thumbnails: thumbs, demos })
      })
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="min-h-screen bg-base-dark p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Rediger innhold</h1>
            <p className="text-gray-400 mt-1">Oppdater tittel, pris, beskrivelse, tags og status for alt innhold</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={async () => { await fetch('/api/artwork/generate-metadata', { method: 'POST' }); alert('Metadata generert for artwork.'); }} className="px-4 py-2 rounded border border-white/10 text-white/90">Generer artwork‑metadata</button>
            <button onClick={() => router.push('/admin/dashboard')} className="px-4 py-2 rounded" style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}>Til dashboard</button>
          </div>
        </div>

        {/* Music editor */}
        <div className="p-6 rounded-2xl mb-10 border" style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Musikk</h2>
            <span className="text-xs text-gray-400">{music.length} elementer</span>
          </div>
          <div className="space-y-6">
            {music.map((m) => (
              <div key={m.id} className="rounded-xl border border-white/10 p-4" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)' }}>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-start">
                  <input className="md:col-span-2 p-2 bg-base-dark text-white rounded border border-white/10" value={m.title} onChange={(e) => setMusic(list => list.map(x => x.id === m.id ? { ...x, title: e.target.value } : x))} />
                  <input className="p-2 bg-base-dark text-white rounded border border-white/10" type="number" value={m.price} onChange={(e) => setMusic(list => list.map(x => x.id === m.id ? { ...x, price: Number(e.target.value) } : x))} />
                  <input className="md:col-span-2 p-2 bg-base-dark text-white rounded border border-white/10" placeholder="Tags (komma)" value={m.tags?.join(', ') || ''} onChange={(e) => setMusic(list => list.map(x => x.id === m.id ? { ...x, tags: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) } : x))} />
                  <select className="p-2 bg-base-dark text-white rounded border border-white/10" value={m.status || 'available'} onChange={(e) => setMusic(list => list.map(x => x.id === m.id ? { ...x, status: e.target.value } : x))}>
                    <option value="available">Tilgjengelig</option>
                    <option value="sold">Solgt</option>
                    <option value="private">Privat</option>
                  </select>
                  <label className="flex items-center gap-2 text-white">
                    <input type="checkbox" checked={Boolean(m.isNew)} onChange={(e) => setMusic(list => list.map(x => x.id === m.id ? { ...x, isNew: e.target.checked } : x))} /> Nyhet
                  </label>
                <button
                  disabled={saving === m.id}
                  onClick={async () => {
                    if (!confirm('Bekreft lagring av endringer for denne låten?')) return
                    await updateMusic(m)
                    alert('Endringer lagret. Angre ikke tilgjengelig enda, men kan implementeres.');
                  }}
                  className="px-3 py-2 rounded"
                  style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}
                >{saving === m.id ? 'Lagrer…' : 'Lagre'}</button>
                </div>
                <textarea className="w-full mt-3 p-2 bg-base-dark text-white rounded border border-white/10" rows={2} value={m.description} onChange={(e) => setMusic(list => list.map(x => x.id === m.id ? { ...x, description: e.target.value } : x))} />
              </div>
            ))}
          </div>
        </div>

        {/* Artwork editor */}
        <div className="p-6 rounded-2xl border" style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Artwork</h2>
            <span className="text-xs text-gray-400">{art.length} elementer</span>
          </div>
          <div className="space-y-6">
            {art.map((a) => (
              <div key={a.id} className="rounded-xl border border-white/10 p-4" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)' }}>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-start">
                  <div className="md:col-span-1">
                    <img src={a.imageUrl} alt={a.title} className="w-full h-16 object-cover rounded border border-white/10" />
                  </div>
                  <input className="md:col-span-2 p-2 bg-base-dark text-white rounded border border-white/10" value={a.title} onChange={(e) => setArt(list => list.map(x => x.id === a.id ? { ...x, title: e.target.value } : x))} />
                  <input className="p-2 bg-base-dark text-white rounded border border-white/10" type="number" value={a.price} onChange={(e) => setArt(list => list.map(x => x.id === a.id ? { ...x, price: Number(e.target.value) } : x))} />
                  <input className="md:col-span-2 p-2 bg-base-dark text-white rounded border border-white/10" placeholder="Tags (komma)" value={a.tags?.join(', ') || ''} onChange={(e) => setArt(list => list.map(x => x.id === a.id ? { ...x, tags: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) } : x))} />
                  <select className="p-2 bg-base-dark text-white rounded border border-white/10" value={a.status || 'available'} onChange={(e) => setArt(list => list.map(x => x.id === a.id ? { ...x, status: e.target.value } : x))}>
                    <option value="available">Tilgjengelig</option>
                    <option value="sold">Solgt</option>
                    <option value="private">Privat</option>
                  </select>
                  <label className="flex items-center gap-2 text-white">
                    <input type="checkbox" checked={Boolean(a.isNew)} onChange={(e) => setArt(list => list.map(x => x.id === a.id ? { ...x, isNew: e.target.checked } : x))} /> Nyhet
                  </label>
                <button
                  disabled={saving === a.id}
                  onClick={async () => {
                    if (!confirm('Bekreft lagring av endringer for dette artworket?')) return
                    await updateArt(a)
                    alert('Endringer lagret. Angre ikke tilgjengelig enda, men kan implementeres.')
                  }}
                  className="px-3 py-2 rounded"
                  style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}
                >{saving === a.id ? 'Lagrer…' : 'Lagre'}</button>
                </div>
                <textarea className="w-full mt-3 p-2 bg-base-dark text-white rounded border border-white/10" rows={2} value={a.description || ''} onChange={(e) => setArt(list => list.map(x => x.id === a.id ? { ...x, description: e.target.value } : x))} />
              </div>
            ))}
          </div>
        </div>

        {/* Genre thumbnails & demo overrides */}
        <div className="p-6 rounded-2xl border mt-10" style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Produksjon – Thumbnails & Demos</h2>
            <button disabled={saving === 'thumbs'} onClick={saveThumbs} className="px-3 py-2 rounded" style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}>{saving === 'thumbs' ? 'Lagrer…' : 'Lagre'}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {genreData.map((g) => (
              <div key={g.slug} className="rounded-xl border border-white/10 p-3" style={{ background: 'rgba(0,0,0,0.35)' }}>
                <div className="text-white font-medium mb-2">{g.title}</div>
                <input className="w-full p-2 bg-base-dark text-white rounded border border-white/10 mb-2" placeholder="https://…" value={thumbs[g.slug] || ''} onChange={(e) => setThumbs(prev => ({ ...prev, [g.slug]: e.target.value }))} />
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploadingSlug(g.slug)
                      const fd = new FormData()
                      fd.append('file', file)
                      fd.append('slug', g.slug)
                      try {
                        const res = await fetch('/api/genres/overrides/upload', { method: 'POST', body: fd })
                        const json = await res.json()
                        if (json?.ok && json.url) {
                          setThumbs(prev => ({ ...prev, [g.slug]: json.url }))
                        } else {
                          alert('Kunne ikke laste opp bilde')
                        }
                      } catch {
                        alert('Feil ved opplasting')
                      } finally {
                        setUploadingSlug(null)
                      }
                    }}
                    className="flex-1 text-sm text-white"
                  />
                  {uploadingSlug === g.slug && <span className="text-xs text-gray-400">Laster opp…</span>}
                </div>
                <div className="mt-2 text-xs text-gray-300">Demo lyd (30s klipp)</div>
                <input className="w-full p-2 bg-base-dark text-white rounded border border-white/10 mb-2" placeholder="https://…" value={demos[g.slug] || ''} onChange={(e) => setDemos(prev => ({ ...prev, [g.slug]: e.target.value }))} />
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploadingSlug(g.slug)
                      const fd = new FormData()
                      fd.append('file', file)
                      fd.append('slug', g.slug)
                      fd.append('kind', 'audio')
                      try {
                        const res = await fetch('/api/genres/overrides/upload', { method: 'POST', body: fd })
                        const json = await res.json()
                        if (json?.ok && json.url) {
                          setDemos(prev => ({ ...prev, [g.slug]: json.url }))
                        } else {
                          alert('Kunne ikke laste opp lyd')
                        }
                      } catch {
                        alert('Feil ved opplasting')
                      } finally {
                        setUploadingSlug(null)
                      }
                    }}
                    className="flex-1 text-sm text-white"
                  />
                </div>
                <div className="mt-2 h-24 rounded overflow-hidden border border-white/10 bg-black/20">
                  <img src={(thumbs[g.slug] || g.thumbnailImage)} alt={g.title} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects editor */}
      <div className="max-w-7xl mx-auto mt-10 p-6 rounded-2xl border" style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
        <h2 className="text-xl font-semibold text-white mb-4">Prosjekter</h2>
        <ProjectAdmin />
      </div>
    </div>
  )
}

function ProjectAdmin() {
  const [projects, setProjects] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || [])).catch(()=>{})
  }, [])

  const addEmpty = () => setProjects(prev => [...prev, { id: `temp-${Date.now()}`, title: '', artworkUrl: '', musicUrl: '', description: '', tags: [] }])

  const saveProject = async (p: any) => {
    setSaving(true)
    try {
      const method = (p.id && p.id.startsWith('project-')) ? 'PUT' : 'POST'
      const body = method === 'PUT' ? p : { title: p.title, artworkUrl: p.artworkUrl, musicUrl: p.musicUrl, description: p.description, tags: p.tags }
      const res = await fetch('/api/projects', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (json?.ok || json?.project) {
        const saved = json.project || p
        if (method === 'POST') {
          setProjects(list => list.map(x => x.id === p.id ? { ...saved } : x))
        } else {
          setProjects(list => list.map(x => x.id === p.id ? saved : x))
        }
      }
    } finally { setSaving(false) }
  }

  const removeProject = async (id: string) => {
    if (!confirm('Slette prosjekt?')) return
    setSaving(true)
    try {
      await fetch('/api/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      setProjects(list => list.filter(p => p.id !== id))
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="text-gray-400">Legg til artwork + lenke til musikk</p>
        <button onClick={addEmpty} className="px-3 py-2 rounded" style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}>Nytt prosjekt</button>
      </div>
      {projects.map((p, idx) => (
        <div key={p.id || idx} className="rounded-xl border border-white/10 p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-start">
            <input className="md:col-span-2 p-2 bg-base-dark text-white rounded border border-white/10" placeholder="Tittel" value={p.title} onChange={(e)=> setProjects(list => list.map(x => x === p ? { ...x, title: e.target.value } : x))} />
            <input className="md:col-span-2 p-2 bg-base-dark text-white rounded border border-white/10" placeholder="Artwork URL" value={p.artworkUrl} onChange={(e)=> setProjects(list => list.map(x => x === p ? { ...x, artworkUrl: e.target.value } : x))} />
            <input className="p-2 bg-base-dark text-white rounded border border-white/10" placeholder="Musikklenke" value={p.musicUrl || ''} onChange={(e)=> setProjects(list => list.map(x => x === p ? { ...x, musicUrl: e.target.value } : x))} />
            <button disabled={saving} onClick={() => saveProject(p)} className="px-3 py-2 rounded" style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}>{saving ? 'Lagrer…' : 'Lagre'}</button>
          </div>
          <textarea className="w-full mt-3 p-2 bg-base-dark text-white rounded border border-white/10" rows={2} placeholder="Beskrivelse" value={p.description || ''} onChange={(e)=> setProjects(list => list.map(x => x === p ? { ...x, description: e.target.value } : x))} />
          <div className="flex justify-end mt-2">
            <button onClick={() => removeProject(p.id)} className="px-3 py-2 rounded border border-white/10 text-white/80">Fjern</button>
          </div>
        </div>
      ))}
    </div>
  )
}

