'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GalleryGrid from './GalleryGrid'
import CustomArtworkModal from './CustomArtworkModal'
import { artworkItems, getUploadedArtwork } from '@/data/artwork'
import { ArtworkItem } from '@/types/services'

export default function CombinedArtworkSection() {
  const [allArtwork, setAllArtwork] = useState<ArtworkItem[]>(artworkItems)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [expanding, setExpanding] = useState(false)
  const [showCustomModal, setShowCustomModal] = useState(false)

  useEffect(() => {
    const fetchUploadedArtwork = async () => {
      try {
        const response = await fetch('/api/artwork')
        const data = await response.json()
        const uploadedArtwork = data.artwork || []
        
        // Combine static and uploaded artwork
        const combined = [...uploadedArtwork, ...artworkItems]
        setAllArtwork(combined)
      } catch (error) {
        console.error('Error fetching uploaded artwork:', error)
        setAllArtwork(artworkItems)
      } finally {
        setLoading(false)
      }
    }

    fetchUploadedArtwork()
  }, [])

  const categories = [
    { id: 'all', name: 'Alle', count: allArtwork.length },
    { id: 'gallery', name: 'Galleri', count: allArtwork.filter(item => item.category === 'gallery').length },
    { id: 'custom', name: 'Skreddersydd', count: allArtwork.filter(item => item.category === 'custom').length }
  ]

  return (
    <section id="artwork" className="py-20" style={{backgroundColor: 'var(--primary-bg)'}}>
      <div className="container mx-auto px-4">
        {/* Section Header (ikon fjernet for minimalistisk design) */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'var(--text-on-dark)'}}>
            Artwork Galleri
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>
            Kreative visuelle uttrykk og kunstneriske design for din musikk
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap gap-3 p-2 rounded-2xl" style={{
            background: 'var(--glass-section)',
            backdropFilter: 'blur(15px)',
            border: '1px solid var(--border-light)'
          }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  if (category.id === 'custom') {
                    setShowCustomModal(true)
                  } else {
                    setSelectedCategory(category.id)
                  }
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'text-base-dark' 
                    : 'text-white hover:text-white/80'
                }`}
                style={{
                  background: selectedCategory === category.id 
                    ? 'var(--accent-green)'
                    : 'transparent'
                }}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Transparent dark background container that expands with content */}
        <motion.div
          layout
          className={`max-w-7xl mx-auto transition-all duration-500`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div
            className="rounded-3xl border"
            style={{
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
          {loading ? (
            <div className="text-center py-20">
              <div className="text-white text-lg">Laster artwork...</div>
            </div>
          ) : (
            <>
              <motion.div layout className="p-4 md:p-6 lg:p-8">
                <GalleryGrid 
                  selectedCategory={selectedCategory}
                  artworkItems={showAll ? allArtwork : allArtwork.slice(0, 8)}
                  showAll={showAll}
                  key={`gallery-${showAll}-${selectedCategory}-${allArtwork.length}`}
                />
              </motion.div>
              
              {!showAll && allArtwork.length > 8 && (
                <div className="flex justify-center mt-4 mb-8">
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
                      border: '1px solid var(--border-light)'
                    }}
                     whileHover={{ scale: expanding ? 1 : 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {expanding ? 'Laster...' : `Vis alle (${allArtwork.length}) artwork`}
                  </motion.button>
                </div>
              )}
            </>
          )}
          </div>
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
              const subject = 'Skreddersydd artwork bestilling';
              const body = `Hei Lydskog!

Jeg vil gjerne bestille skreddersydd artwork for mitt prosjekt.

Kan dere kontakte meg for å diskutere detaljer?

Mvh,
[Ditt navn]`;

              window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            className="px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
            style={{
              background: 'var(--glass-section)',
              color: 'var(--text-on-dark)',
              border: '1px solid var(--border-light)'
            }}
            whileHover={{ 
              scale: 1.03
            }}
            whileTap={{ scale: 0.95 }}
          >
            Bestill skreddersydd artwork
          </motion.button>
        </motion.div>

        {/* Custom Artwork Modal */}
        <CustomArtworkModal 
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
        />
      </div>
    </section>
  )
}