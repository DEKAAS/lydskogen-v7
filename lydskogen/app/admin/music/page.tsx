'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UploadedMusic {
  id: string
  title: string
  genre: string
  price: number
  audioUrl: string
  description: string
  status: string
  duration: string
  bpm: number | null
  key: string
  uploadedAt: string
}

export default function AdminMusic() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<UploadedMusic | null>(null)
  const [uploadedList, setUploadedList] = useState<UploadedMusic[]>([])
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    price: '450',
    genre: 'ambient',
    status: 'available',
    duration: '',
    bpm: '',
    key: '',
    tags: ''
  })

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated" || session?.user?.role !== 'admin') {
      router.push('/admin/login')
    }
    // fetch existing music list
    fetch('/api/music').then(r => r.json()).then(d => setUploadedList(d.music || [])).catch(() => setUploadedList([]))
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-base-dark flex items-center justify-center">
        <div className="text-white">Laster...</div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setUploadSuccess(null)

    const form = e.currentTarget
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    const file = fileInput.files?.[0]

    if (!file) {
      alert('Vennligst velg en lydfil')
      setUploading(false)
      return
    }

    try {
      const formDataObj = new FormData()
      formDataObj.append('file', file)
      formDataObj.append('title', formData.title)
      formDataObj.append('description', formData.description)
      formDataObj.append('artist', formData.artist)
      formDataObj.append('price', formData.price)
      formDataObj.append('genre', formData.genre)
      formDataObj.append('status', formData.status)
      formDataObj.append('duration', formData.duration)
      formDataObj.append('bpm', formData.bpm)
      formDataObj.append('key', formData.key)
      formDataObj.append('tags', formData.tags)

      const response = await fetch('/api/admin/upload-music', {
        method: 'POST',
        body: formDataObj
      })

      const result = await response.json()

      if (response.ok) {
        setUploadSuccess(result.music)
        setUploadedList(prev => [result.music, ...prev])
        setFormData({
          title: '',
          artist: '',
          description: '',
          price: '450',
          genre: 'ambient',
          status: 'available',
          duration: '',
          bpm: '',
          key: '',
          tags: ''
        })
        fileInput.value = ''
      } else {
        alert(`Feil ved opplasting: ${result.error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Det oppstod en feil ved opplasting')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Musikk Administrasjon</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Tilbake til Dashboard
          </button>
        </div>

        {/* Upload Form */}
        <div className="bg-secondary-dark p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Last opp ny låt</h2>
          
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Tittel *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Artist</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({...formData, artist: e.target.value})}
                  placeholder="Lydskog"
                  className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Pris (NOK)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Sjanger</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({...formData, genre: e.target.value})}
                  className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                >
                  <option value="ambient">Ambient</option>
                  <option value="hiphop">Hip-Hop</option>
                  <option value="lofi">Lo-Fi</option>
                  <option value="soundscape">Soundscape</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                >
                  <option value="available">Tilgjengelig</option>
                  <option value="sold">Solgt</option>
                  <option value="private">Privat</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Varighet (f.eks. 3:42)</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="3:42"
                  className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">BPM</label>
                <input
                  type="number"
                  value={formData.bpm}
                  onChange={(e) => setFormData({...formData, bpm: e.target.value})}
                  placeholder="120"
                  min="60"
                  max="200"
                  className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Toneart</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({...formData, key: e.target.value})}
                  placeholder="C major, A minor"
                  className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Tags (komma-separert)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="ambient, fokus, nature"
                  className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Beskrivelse</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                placeholder="Beskriv stemningen, instrumentering, og stilen til låten..."
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Velg lydfil *</label>
              <input
                type="file"
                accept="audio/*"
                className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-green file:text-base-dark hover:file:bg-accent-green/80"
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-accent-green text-base-dark font-semibold py-3 rounded hover:bg-accent-green/80 disabled:opacity-50 transition-colors"
            >
              {uploading ? 'Laster opp...' : 'Last opp låt'}
            </button>
          </form>
        </div>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="bg-green-900/50 border border-green-500 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Opplasting vellykket!</h3>
            <div className="space-y-2">
              <p className="text-gray-300"><strong>ID:</strong> {uploadSuccess.id}</p>
              <p className="text-gray-300"><strong>Tittel:</strong> {uploadSuccess.title}</p>
              <p className="text-gray-300"><strong>Sjanger:</strong> {uploadSuccess.genre}</p>
              <p className="text-gray-300"><strong>Pris:</strong> {uploadSuccess.price} NOK</p>
              <p className="text-gray-300"><strong>Status:</strong> {uploadSuccess.status}</p>
              {uploadSuccess.duration && <p className="text-gray-300"><strong>Varighet:</strong> {uploadSuccess.duration}</p>}
              {uploadSuccess.bpm && <p className="text-gray-300"><strong>BPM:</strong> {uploadSuccess.bpm}</p>}
              {uploadSuccess.key && <p className="text-gray-300"><strong>Toneart:</strong> {uploadSuccess.key}</p>}
              
              {/* Audio Preview */}
              <div className="mt-4">
                <p className="text-gray-300 mb-2"><strong>Forhåndsvisning:</strong></p>
                <audio controls className="w-full">
                  <source src={uploadSuccess.audioUrl} type="audio/mpeg" />
                  Din nettleser støtter ikke audio-elementet.
                </audio>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded tracks management */}
        <div className="bg-secondary-dark p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Opplastede låter</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-300">
                  <th className="py-2">Tittel</th>
                  <th className="py-2">Sjanger</th>
                  <th className="py-2">Pris</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Nyhet</th>
                  <th className="py-2">Handlinger</th>
                </tr>
              </thead>
              <tbody>
                {uploadedList.map((m) => (
                  <tr key={m.id} className="border-t border-white/10 text-gray-200">
                    <td className="py-2">{m.title}</td>
                    <td className="py-2">{m.genre}</td>
                    <td className="py-2">{m.price} kr</td>
                    <td className="py-2">{m.status}</td>
                    <td className="py-2">{(m as any).isNew ? 'Ja' : 'Nei'}</td>
                    <td className="py-2 flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-yellow-600/20 text-yellow-300"
                        onClick={() => {
                          // toggle isNew locally; persistence to be added
                          setUploadedList(list => list.map(x => x.id === m.id ? ({...x, isNew: !(x as any).isNew} as any) : x))
                        }}
                      >
                        Marker nyhet
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-600/20 text-red-300"
                        onClick={() => {
                          if (!confirm('Slett denne låten fra listen? (fil slettes ikke)')) return
                          setUploadedList(list => list.filter(x => x.id !== m.id))
                        }}
                      >
                        Fjern
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}