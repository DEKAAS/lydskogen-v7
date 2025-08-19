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
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">Musikk Tracks</h3>
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
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">Artwork Items</h3>
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