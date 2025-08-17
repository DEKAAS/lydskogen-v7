'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UploadedArtwork {
  id: string
  title: string
  category: string
  price: number
  imageUrl: string
  description: string
  tags: string[]
  uploadedAt: string
  isNew?: boolean
  status?: 'available' | 'sold' | 'pending'
}

export default function AdminArtwork() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<UploadedArtwork | null>(null)
  const [uploadedList, setUploadedList] = useState<UploadedArtwork[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '200',
    category: 'gallery',
    tags: ''
  })

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated" || session?.user?.role !== 'admin') {
      router.push('/admin/login')
    }
    fetch('/api/admin/artwork').then(r => r.json()).then(d => setUploadedList(d.artwork || [])).catch(() => setUploadedList([]))
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Laster...</div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  const handleDeleteArtwork = async (id: string) => {
    if (!confirm('Er du sikker på at du vil slette dette artwork? Dette kan ikke angres.')) return
    
    try {
      const response = await fetch(`/api/admin/artwork?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setUploadedList(list => list.filter(x => x.id !== id))
        alert('Artwork slettet')
      } else {
        alert('Feil ved sletting')
      }
    } catch (error) {
      console.error('Error deleting artwork:', error)
      alert('Feil ved sletting')
    }
  }

  const handleUpdateArtwork = async (id: string, updates: { status?: string, isNew?: boolean }) => {
    try {
      const response = await fetch(`/api/admin/artwork?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (response.ok) {
        const result = await response.json()
        setUploadedList(list => list.map(x => x.id === id ? result.artwork : x))
      } else {
        alert('Feil ved oppdatering')
      }
    } catch (error) {
      console.error('Error updating artwork:', error)
      alert('Feil ved oppdatering')
    }
  }

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setUploadSuccess(null)

    const form = e.currentTarget
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    const file = fileInput.files?.[0]

    if (!file) {
      alert('Vennligst velg en bildefil')
      setUploading(false)
      return
    }

    try {
      const formDataObj = new FormData()
      formDataObj.append('file', file)
      formDataObj.append('title', formData.title)
      formDataObj.append('description', formData.description)
      formDataObj.append('price', formData.price)
      formDataObj.append('category', formData.category)
      formDataObj.append('tags', formData.tags)

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formDataObj
      })

      const result = await response.json()

      if (response.ok) {
        setUploadSuccess(result.artwork)
        setUploadedList(prev => [result.artwork, ...prev])
        setFormData({
          title: '',
          description: '',
          price: '200',
          category: 'gallery',
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
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Artwork Administrasjon</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Tilbake til Dashboard
          </button>
        </div>

        {/* Upload Form */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Last opp nytt artwork</h2>
          
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Tittel</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 bg-black text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Pris (NOK)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full p-3 bg-black text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 bg-black text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                >
                  <option value="gallery">Galleri</option>
                  <option value="custom">Skreddersydd</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Tags (komma-separert)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="natura, abstract, premium"
                  className="w-full p-3 bg-black text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Beskrivelse</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full p-3 bg-black text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Velg bildefil</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-3 bg-black text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-green file:text-base-dark hover:file:bg-accent-green/80"
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-accent-green text-base-dark font-semibold py-3 rounded hover:bg-accent-green/80 disabled:opacity-50 transition-colors"
            >
              {uploading ? 'Laster opp...' : 'Last opp artwork'}
            </button>
          </form>
        </div>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="bg-green-900/50 border border-green-500 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Opplasting vellykket!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300"><strong>ID:</strong> {uploadSuccess.id}</p>
                <p className="text-gray-300"><strong>Tittel:</strong> {uploadSuccess.title}</p>
                <p className="text-gray-300"><strong>Kategori:</strong> {uploadSuccess.category}</p>
                <p className="text-gray-300"><strong>Pris:</strong> {uploadSuccess.price} NOK</p>
                <p className="text-gray-300"><strong>Tags:</strong> {uploadSuccess.tags.join(', ')}</p>
              </div>
              <div className="flex justify-center">
                <img 
                  src={uploadSuccess.imageUrl} 
                  alt={uploadSuccess.title}
                  className="max-w-40 max-h-40 object-cover rounded border"
                />
              </div>
            </div>
          </div>
        )}

        {/* Uploaded artwork management */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Opplastet artwork</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-300">
                  <th className="py-2">Tittel</th>
                  <th className="py-2">Kategori</th>
                  <th className="py-2">Pris</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Nyhet</th>
                  <th className="py-2">Handlinger</th>
                </tr>
              </thead>
              <tbody>
                {uploadedList.map((a) => (
                  <tr key={a.id} className="border-t border-white/10 text-gray-200">
                    <td className="py-2">{a.title}</td>
                    <td className="py-2">{a.category}</td>
                    <td className="py-2">{a.price} kr</td>
                    <td className="py-2">{a.status || 'available'}</td>
                    <td className="py-2">{a.isNew ? 'Ja' : 'Nei'}</td>
                    <td className="py-2 flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-yellow-600/20 text-yellow-300 hover:bg-yellow-600/30"
                        onClick={() => handleUpdateArtwork(a.id, { isNew: !a.isNew })}
                      >
                        {a.isNew ? 'Fjern nyhet' : 'Marker nyhet'}
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-green-600/20 text-green-300 hover:bg-green-600/30"
                        onClick={() => handleUpdateArtwork(a.id, { status: a.status === 'sold' ? 'available' : 'sold' })}
                      >
                        {a.status === 'sold' ? 'Marker tilgjengelig' : 'Marker solgt'}
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-600/20 text-red-300 hover:bg-red-600/30"
                        onClick={() => handleDeleteArtwork(a.id)}
                      >
                        Slett
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