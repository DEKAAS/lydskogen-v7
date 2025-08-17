'use client';

import { motion } from 'framer-motion';
import GenreGrid from '@/components/GenreGrid';
import MusicGrid from '@/components/MusicGrid';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as m } from 'framer-motion';

const genres = [
  {
    id: 'ambient',
    name: 'Ambient',
    icon: '🌌',
    description: 'Atmosfærisk og meditativ musikk som skaper ro og kontemplasjon',
    color: 'rgb(147, 197, 253)' // blue-300
  },
  {
    id: 'hiphop',
    name: 'Hip-hop',
    icon: '🎤',
    description: 'Kraftfulle beats og grooves med moderne produksjonsteknikker',
    color: 'rgb(251, 146, 60)' // orange-400
  },
  {
    id: 'lofi',
    name: 'Lo-fi',
    icon: '📻',
    description: 'Nostalgisk og avslappende musikk med vintage karakteristikker',
    color: 'rgb(251, 191, 36)' // amber-400
  },
  {
    id: 'soundscape',
    name: 'Soundscape',
    icon: '🏞️',
    description: 'Cinematiske lydlandskap og atmosfærisk musikk for film og media',
    color: 'rgb(148, 163, 184)' // slate-400
  }
];

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
  isNew?: boolean
  status?: 'available' | 'sold' | 'pending'
}

export default function MusikkproduksjonSeksjon() {
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGenre, setActiveGenre] = useState<'ambient' | 'hiphop' | 'lofi' | 'soundscape'>('ambient')
  const [activeView, setActiveView] = useState<'custom' | 'ready'>('ready')
  const [showInfoPopup, setShowInfoPopup] = useState(false)
  const genreOrder: Array<'ambient' | 'hiphop' | 'lofi' | 'soundscape'> = ['ambient','hiphop','lofi','soundscape']
  const titleMap: Record<string, string> = {
    ambient: 'Ambient',
    hiphop: 'Hip-hop',
    lofi: 'Lo-fi',
    soundscape: 'Soundscape'
  }
  const tabsRef = useRef<HTMLDivElement>(null)
  const [isTabsStuck, setIsTabsStuck] = useState(false)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/music')
        const data = await response.json()
        setTracks(data.music || [])
      } catch (e) {
        setTracks([])
      } finally {
        setLoading(false)
      }
    }
    fetchTracks()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = tabsRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      setIsTabsStuck(top <= 85) // navbar ~80px
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="services" className="relative py-16" style={{backgroundColor: 'var(--primary-bg)'}}>
      {/* Info Button */}
      <motion.button
        onClick={() => setShowInfoPopup(true)}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 bg-accent-green/80 hover:bg-accent-green/90 backdrop-blur-sm text-white p-3 rounded-full border border-accent-green/30 transition-all duration-300 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.button>

      <div className="container mx-auto px-4">
        {/* Section Header (ikon fjernet) */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'var(--text-on-dark)'}}>
            Musikkproduksjon
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>
            Velg din sjanger og bestill skreddersydd musikk. Ferdiglåter finner du under – sortert per sjanger.
          </p>
        </motion.div>

        {/* Unified dark container with view-toggle */}
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div 
            className="p-4 md:p-6 rounded-3xl border backdrop-blur-sm"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <button
                onClick={() => setActiveView('ready')}
                className={`px-4 py-2 rounded-lg font-medium ${activeView === 'ready' ? 'text-black' : 'text-white/85 hover:text-white'}`}
                style={{
                  background: activeView === 'ready' 
                    ? 'linear-gradient(135deg, rgba(219,186,54,1), rgba(219,186,54,0.85))' 
                    : 'transparent',
                  border: '1px solid var(--border-light)',
                  boxShadow: activeView === 'ready' ? '0 6px 16px rgba(0,0,0,0.25)' : 'none'
                }}
              >
                Ferdig musikk
              </button>
              <button
                onClick={() => setActiveView('custom')}
                className={`px-4 py-2 rounded-lg font-medium ${activeView === 'custom' ? 'text-black' : 'text-white/85 hover:text-white'}`}
                style={{
                  background: activeView === 'custom' 
                    ? 'linear-gradient(135deg, rgba(219,186,54,1), rgba(219,186,54,0.85))' 
                    : 'transparent',
                  border: '1px solid var(--border-light)',
                  boxShadow: activeView === 'custom' ? '0 6px 16px rgba(0,0,0,0.25)' : 'none'
                }}
              >
                Skreddersy
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeView === 'custom' ? (
                <m.div
                  key="custom"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <GenreGrid />
                </m.div>
              ) : (
                <m.div
                  key="ready"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Tabs for genre */}
                  <div ref={tabsRef} className={`px-2 md:px-4 pt-1 transition-all duration-300`} onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                      e.preventDefault()
                      const idx = genreOrder.indexOf(activeGenre)
                      const delta = e.key === 'ArrowRight' ? 1 : -1
                      const next = genreOrder[(idx + delta + genreOrder.length) % genreOrder.length]
                      setActiveGenre(next)
                    }
                  }}>
                    <div role="tablist" aria-label="Sjanger" className={`flex flex-wrap items-center justify-center gap-2 md:gap-3 rounded-2xl`}>
                      {genreOrder.map((id) => (
                        <button
                          key={id}
                          role="tab"
                          aria-selected={activeGenre === id}
                          tabIndex={activeGenre === id ? 0 : -1}
                          onClick={() => setActiveGenre(id)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeGenre === id ? 'text-black' : 'text-white/80 hover:text-white'}`}
                          style={{
                            background: activeGenre === id 
                              ? 'linear-gradient(135deg, rgba(219,186,54,1), rgba(219,186,54,0.85))' 
                              : 'var(--glass-section)',
                            border: '1px solid var(--border-light)'
                          }}
                        >
                          {titleMap[id]}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Grid */}
                  <div className="p-3 md:p-4">
                    <AnimatePresence mode="wait">
                      <m.div
                        key={`grid-${activeGenre}`}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <MusicGrid tracks={tracks.filter(t => t.genre === activeGenre)} showAll />
                      </m.div>
                    </AnimatePresence>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ensure data fetched */}
        <div className="sr-only">{!loading && tracks.length}</div>

        {/* Info Popup */}
        <AnimatePresence>
          {showInfoPopup && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowInfoPopup(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
              >
                <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl p-8 rounded-3xl border border-accent-green/30 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-accent-green to-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white">Musikkproduksjon</h3>
                    </div>
                    <button
                      onClick={() => setShowInfoPopup(false)}
                      className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6 text-gray-200">
                    <div>
                      <h4 className="text-lg font-semibold text-accent-green mb-2">🎵 Skreddersydd Musikk</h4>
                      <p className="leading-relaxed">
                        Bestill original musikk laget spesielt for ditt prosjekt. Vi produserer i fire hovedsjangre: 
                        Ambient, Hip-hop, Lo-fi og Soundscape.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-accent-green mb-2">🎧 Ferdiglåter</h4>
                      <p className="leading-relaxed">
                        Bla gjennom vårt bibliotek av ferdigproduserte låter. Perfekt for raske prosjekter 
                        eller når du trenger kvalitetsmusikk umiddelbart.
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-accent-green/20">
                      <h4 className="text-lg font-semibold text-white mb-2">✨ Hva får du?</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                          Profesjonell produksjon og miksing
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                          Høykvalitets WAV og MP3 filer
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                          Kommersielle rettigheter inkludert
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                          Revideringer til du er fornøyd
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}