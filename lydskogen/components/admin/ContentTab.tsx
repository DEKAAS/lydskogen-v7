'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MusicTrack {
  id: string
  title: string
  artist: string
  genre: string
  price: number
  status: 'available' | 'sold' | 'pending'
  isNew?: boolean
  uploadedAt: string
}

interface ArtworkItem {
  id: string
  title: string
  category: string
  price: number
  imageUrl: string
  status: 'available' | 'sold' | 'pending'
  isNew?: boolean
  uploadedAt: string
}

export default function ContentTab() {
  const [activeSubTab, setActiveSubTab] = useState<'music' | 'artwork'>('music')
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([])
  const [artworkItems, setArtworkItems] = useState<ArtworkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    artist: '',
    description: '',
    price: '450',
    genre: 'ambient',
    status: 'available',
    duration: '',
    bpm: '',
    key: '',
    tags: '',
    file: null as File | null
  })
  const [artworkFormData, setArtworkFormData] = useState({
    title: '',
    description: '',
    price: '200',
    category: 'gallery',
    tags: '',
    file: null as File | null
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const [musicRes, artworkRes] = await Promise.all([
        fetch('/api/admin/music'),
        fetch('/api/admin/artwork')
      ])
      
      const musicData = await musicRes.json()
      const artworkData = await artworkRes.json()
      
      setMusicTracks(musicData.music || [])
      setArtworkItems(artworkData.artwork || [])
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string, type: 'music' | 'artwork') => {
    try {
      const endpoint = type === 'music' ? '/api/admin/music' : '/api/admin/artwork'
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchContent() // Refresh data
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: string, type: 'music' | 'artwork') => {
    if (!confirm('Er du sikker på at du vil slette dette elementet?')) return

    try {
      const endpoint = type === 'music' ? '/api/admin/music' : '/api/admin/artwork'
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchContent() // Refresh data
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleMusicUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFormData.file || !uploadFormData.title.trim()) {
      alert('Tittel og fil er påkrevd')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadFormData.file)
      formData.append('title', uploadFormData.title)
      formData.append('artist', uploadFormData.artist || 'Lydskog')
      formData.append('description', uploadFormData.description)
      formData.append('price', uploadFormData.price)
      formData.append('genre', uploadFormData.genre)
      formData.append('status', uploadFormData.status)
      formData.append('duration', uploadFormData.duration)
      formData.append('bpm', uploadFormData.bpm)
      formData.append('key', uploadFormData.key)
      formData.append('tags', uploadFormData.tags)

      const response = await fetch('/api/admin/upload-music', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        alert('Musikk lastet opp!')
        setShowUploadForm(false)
        setUploadFormData({
          title: '',
          artist: '',
          description: '',
          price: '450',
          genre: 'ambient',
          status: 'available',
          duration: '',
          bpm: '',
          key: '',
          tags: '',
          file: null
        })
        fetchContent()
      } else {
        alert(`Feil: ${result.error || 'Kunne ikke laste opp'}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Det oppstod en feil ved opplasting')
    } finally {
      setUploading(false)
    }
  }

  const handleArtworkUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artworkFormData.file || !artworkFormData.title.trim()) {
      alert('Tittel og fil er påkrevd')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', artworkFormData.file)
      formData.append('title', artworkFormData.title)
      formData.append('description', artworkFormData.description)
      formData.append('price', artworkFormData.price)
      formData.append('category', artworkFormData.category)
      formData.append('tags', artworkFormData.tags)

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        alert('Artwork lastet opp!')
        setShowUploadForm(false)
        setArtworkFormData({
          title: '',
          description: '',
          price: '200',
          category: 'gallery',
          tags: '',
          file: null
        })
        fetchContent()
      } else {
        alert(`Feil: ${result.error || 'Kunne ikke laste opp'}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Det oppstod en feil ved opplasting')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white">Laster innhold...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Innholdsadministrasjon</h2>
          <p className="text-gray-400">Administrer musikk og artwork</p>
        </div>
        
        {/* Sub Navigation */}
        <div className="flex gap-3 p-2 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveSubTab('music')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeSubTab === 'music' 
                ? 'text-base-dark bg-accent-green' 
                : 'text-white hover:text-white/80'
            }`}
          >
            🎵 Musikk ({musicTracks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('artwork')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeSubTab === 'artwork' 
                ? 'text-base-dark bg-accent-green' 
                : 'text-white hover:text-white/80'
            }`}
          >
            🎨 Artwork ({artworkItems.length})
          </button>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">
              Last opp {activeSubTab === 'music' ? 'Musikk' : 'Artwork'}
            </h3>
            <button
              onClick={() => setShowUploadForm(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {activeSubTab === 'music' ? (
            <form onSubmit={handleMusicUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Tittel *</label>
                  <input
                    type="text"
                    value={uploadFormData.title}
                    onChange={(e) => setUploadFormData({...uploadFormData, title: e.target.value})}
                    className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Artist</label>
                  <input
                    type="text"
                    value={uploadFormData.artist}
                    onChange={(e) => setUploadFormData({...uploadFormData, artist: e.target.value})}
                    placeholder="Lydskog"
                    className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Sjanger</label>
                  <select
                    value={uploadFormData.genre}
                    onChange={(e) => setUploadFormData({...uploadFormData, genre: e.target.value})}
                    className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                  >
                    <option value="ambient">Ambient</option>
                    <option value="hiphop">Hip-Hop</option>
                    <option value="lofi">Lo-Fi</option>
                    <option value="soundscape">Soundscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Pris (NOK)</label>
                  <input
                    type="number"
                    value={uploadFormData.price}
                    onChange={(e) => setUploadFormData({...uploadFormData, price: e.target.value})}
                    className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Beskrivelse</label>
                <textarea
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData({...uploadFormData, description: e.target.value})}
                  rows={3}
                  className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Velg lydfil *</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setUploadFormData({...uploadFormData, file: e.target.files?.[0] || null})}
                  className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-accent-green text-base-dark font-semibold py-3 rounded hover:bg-accent-green/80 disabled:opacity-50"
              >
                {uploading ? 'Laster opp...' : 'Last opp musikk'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleArtworkUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Tittel *</label>
                  <input
                    type="text"
                    value={artworkFormData.title}
                    onChange={(e) => setArtworkFormData({...artworkFormData, title: e.target.value})}
                    className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Pris (NOK)</label>
                  <input
                    type="number"
                    value={artworkFormData.price}
                    onChange={(e) => setArtworkFormData({...artworkFormData, price: e.target.value})}
                    className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Kategori</label>
                  <select
                    value={artworkFormData.category}
                    onChange={(e) => setArtworkFormData({...artworkFormData, category: e.target.value})}
                    className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                  >
                    <option value="gallery">Galleri</option>
                    <option value="custom">Skreddersydd</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Tags (komma-separert)</label>
                  <input
                    type="text"
                    value={artworkFormData.tags}
                    onChange={(e) => setArtworkFormData({...artworkFormData, tags: e.target.value})}
                    placeholder="natura, abstract, premium"
                    className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Beskrivelse</label>
                <textarea
                  value={artworkFormData.description}
                  onChange={(e) => setArtworkFormData({...artworkFormData, description: e.target.value})}
                  rows={3}
                  className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Velg bildefil *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setArtworkFormData({...artworkFormData, file: e.target.files?.[0] || null})}
                  className="w-full p-3 bg-black/50 text-white rounded border border-white/20"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-accent-green text-base-dark font-semibold py-3 rounded hover:bg-accent-green/80 disabled:opacity-50"
              >
                {uploading ? 'Laster opp...' : 'Last opp artwork'}
              </button>
            </form>
          )}
        </motion.div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'music' ? (
          <motion.div
            key="music"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Musikk Tracks</h3>
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="px-4 py-2 bg-accent-green text-base-dark font-semibold rounded hover:bg-accent-green/80"
              >
                {showUploadForm ? 'Avbryt' : '+ Last opp musikk'}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium">Tittel</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Artist</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Sjanger</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Pris</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {musicTracks.map((track) => (
                    <tr key={track.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-white font-medium">{track.title}</div>
                            {track.isNew && <span className="text-xs text-accent-green">Nyhet</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{track.artist}</td>
                      <td className="p-4 text-gray-300 capitalize">{track.genre}</td>
                      <td className="p-4 text-white font-medium">{track.price} kr</td>
                      <td className="p-4">
                        <select
                          value={track.status}
                          onChange={(e) => handleStatusUpdate(track.id, e.target.value, 'music')}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value="available">Tilgjengelig</option>
                          <option value="sold">Solgt</option>
                          <option value="pending">Venter</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(track.id, 'music')}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            title="Slett"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {musicTracks.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-4">🎵</div>
                  <p>Ingen musikk tracks funnet</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="artwork"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Artwork Items</h3>
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="px-4 py-2 bg-accent-green text-base-dark font-semibold rounded hover:bg-accent-green/80"
              >
                {showUploadForm ? 'Avbryt' : '+ Last opp artwork'}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium">Bilde</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Tittel</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Kategori</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Pris</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {artworkItems.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-white font-medium">{item.title}</div>
                            {item.isNew && <span className="text-xs text-accent-green">Nyhet</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300 capitalize">{item.category}</td>
                      <td className="p-4 text-white font-medium">{item.price} kr</td>
                      <td className="p-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusUpdate(item.id, e.target.value, 'artwork')}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value="available">Tilgjengelig</option>
                          <option value="sold">Solgt</option>
                          <option value="pending">Venter</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(item.id, 'artwork')}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            title="Slett"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {artworkItems.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-4">🎨</div>
                  <p>Ingen artwork items funnet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}