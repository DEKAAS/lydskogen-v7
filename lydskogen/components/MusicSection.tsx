'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MusicGrid from './MusicGrid'

interface MusicTrack {
  id: string
  title: string
  artist: string
  genre: string
  price: number
  audioUrl: string
  description: string
  duration: string
  bpm?: number
  key?: string
  tags: string[]
  uploadedAt: string
  isUploaded: boolean
}

export default function MusicSection() {
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [expanding, setExpanding] = useState(false)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/music')
        const data = await response.json()
        setTracks(data.music || [])
      } catch (error) {
        console.error('Error fetching music:', error)
        setTracks([])
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [])

  if (loading) {
    return (
      <section className="py-20" style={{backgroundColor: 'var(--primary-bg)'}}>
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-white text-lg">Laster musikk...</div>
          </div>
        </div>
      </section>
    )
  }

  if (tracks.length === 0) {
    return null // Don't show section if no tracks
  }

  return (
    <section className="py-20" style={{backgroundColor: 'var(--primary-bg)'}}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block p-4 mb-8"
            style={{
              background: 'var(--glass-section)',
              backdropFilter: 'blur(15px)',
              border: '1px solid var(--border-light)',
              borderRadius: '20px'
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-6xl">🎵</div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'var(--text-on-dark)'}}>
            Ferdig Musikk
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>
            Høykvalitets låter klare for øyeblikkelig nedlasting og bruk
          </p>
        </motion.div>

        {/* Music Grid */}
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <MusicGrid 
            tracks={showAll ? tracks : tracks.slice(0, 6)}
            showAll={showAll}
          />
          
          {!showAll && tracks.length > 6 && (
            <div className="flex justify-center mt-12">
              <motion.button
                onClick={async () => {
                  setExpanding(true)
                  await new Promise(resolve => setTimeout(resolve, 100))
                  setShowAll(true)
                  setExpanding(false)
                }}
                disabled={expanding}
                className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
                style={{
                  background: 'var(--glass-section)',
                  color: 'var(--text-on-dark)',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 8px 25px 0 rgba(16, 185, 129, 0.15)'
                }}
                whileHover={{ 
                  scale: expanding ? 1 : 1.05, 
                  boxShadow: '0 12px 35px 0 rgba(16, 185, 129, 0.25)' 
                }}
                whileTap={{ scale: 0.95 }}
              >
                {expanding ? 'Laster...' : `Vis alle (${tracks.length}) låter`}
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => {
              const subject = 'Forespørsel om tilpasset musikk'
              const body = `Hei Lydskog!

Jeg vil gjerne bestille tilpasset musikk for mitt prosjekt.

Kan dere kontakte meg for å diskutere detaljer?

Mvh,
[Ditt navn]`

              window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            }}
            className="px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
            style={{
              background: 'var(--glass-section)',
              color: 'var(--text-on-dark)',
              border: '1px solid var(--border-light)',
              boxShadow: '0 8px 25px 0 rgba(16, 185, 129, 0.15)'
            }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 12px 35px 0 rgba(16, 185, 129, 0.25)' 
            }}
            whileTap={{ scale: 0.95 }}
          >
            Bestill tilpasset musikk
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}