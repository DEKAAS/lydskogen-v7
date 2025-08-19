'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'

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

interface MusicGridProps {
  tracks: MusicTrack[]
  showAll?: boolean
}

interface TrackCardProps {
  track: MusicTrack
  index: number
  isPlaying: boolean
  onPlayToggle: (track: MusicTrack) => void
  onPurchase: (track: MusicTrack) => void
  purchasingId?: string | null
}

function TrackCard({ track, index, isPlaying, onPlayToggle, onPurchase, purchasingId }: TrackCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.1
      }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      style={{ cursor: 'pointer' }}
    >
      <div className="relative overflow-hidden rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl" style={{
        background: 'var(--glass-card)',
        backdropFilter: 'blur(15px)',
        border: '1px solid var(--border-dark)',
        boxShadow: '0 10px 28px 0 rgba(0,0,0,0.28)'
      }}>
        
        {/* Waveform Visualization Area */}
        <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden breathing-gradient">
          
          {/* Animated Background */}
          {/* Rolig diffus gradient – fjernet grønn/gul fargestikk */}
          
          {/* Play Button */}
          <button
            onClick={() => onPlayToggle(track)}
            className="relative z-10 w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300"
            style={{ cursor: 'pointer' }}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Mini transport hint */}
          <div className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded-full opacity-70" style={{ background: 'var(--glass-section)', border: '1px solid var(--border-light)', color: 'var(--text-on-dark)' }}>
            Forhåndsvis
          </div>

          {/* Genre Badge */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm" style={{
                background: 'var(--glass-section)',
                color: 'var(--text-on-dark)',
                border: '1px solid var(--border-light)'
              }}>
                {track.genre}
              </span>
              {track.isNew && (
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(219,186,54,0.2)', color: 'var(--accent-gold)', border: '1px solid rgba(219,186,54,0.45)' }}>
                  Nyhet
                </span>
              )}
              {track.status === 'sold' && (
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(220,38,38,0.25)', color: '#fecaca', border: '1px solid rgba(220,38,38,0.45)' }}>
                  Solgt
                </span>
              )}
            </div>
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-sm font-semibold backdrop-blur-sm" style={{
              background: 'rgba(219, 186, 54, 0.18)',
              color: 'var(--accent-gold)',
              border: '1px solid rgba(219,186,54,0.35)'
            }}>
              {track.price} kr
            </span>
          </div>

          {/* Playing Indicator */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                className="absolute inset-0 bg-accent-green/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-accent-green rounded-full"
                        animate={{
                          height: [10, 30, 10],
                        }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 transition-colors duration-300" style={{color: 'var(--text-on-dark)'}}>
            {track.title}
          </h3>
          
          <p className="text-sm mb-3 opacity-80" style={{color: 'var(--text-on-dark)'}}>
            av {track.artist}
          </p>

          <p className="text-sm mb-4 line-clamp-2 opacity-75" style={{color: 'var(--text-on-dark)'}}>
            {track.description}
          </p>

          {/* Track Info */}
          <div className="flex gap-3 text-xs mb-3 opacity-60" style={{color: 'var(--text-on-dark)'}}>
            {track.duration && <span>⏱️ {track.duration}</span>}
            {track.bpm && <span>🎵 {track.bpm} BPM</span>}
            {track.key && <span>🎹 {track.key}</span>}
          </div>

          {/* Tags */}
          {track.tags && track.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {track.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 text-xs rounded"
                  style={{
                    background: 'var(--glass-section)',
                    color: 'var(--text-on-dark)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  {tag}
                </span>
              ))}
              {track.tags.length > 3 && (
                <span className="px-2 py-1 text-xs opacity-60" style={{color: 'var(--text-on-dark)'}}>
                  +{track.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action: Show details before purchase */}
          <Disclosure track={track} purchasingId={purchasingId} onPurchase={onPurchase} />
        </div>
      </div>
    </motion.div>
  )
}

function Disclosure({ track, purchasingId, onPurchase }: { track: MusicTrack, purchasingId?: string | null, onPurchase: (t: MusicTrack) => void }) {
  const [open, setOpen] = useState(false)
  const { addItem, isInCart } = useCart()
  const inCart = isInCart(track.id)

  const handleAddToCart = () => {
    addItem({
      id: track.id,
      type: 'music',
      title: track.title,
      artist: track.artist,
      price: track.price,
      audioUrl: track.audioUrl
    })
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ background: 'rgba(0,0,0,0.35)', color: 'var(--text-on-dark)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Se detaljer
        </button>
      ) : (
        <div className="mt-3 p-3 rounded-lg border" style={{ background: 'var(--glass-section)', borderColor: 'var(--border-light)' }}>
          <div className="text-sm mb-2" style={{ color: 'var(--text-on-dark)' }}>
            <div className="opacity-80">{track.description}</div>
            <div className="mt-2 flex flex-wrap gap-3 opacity-70">
              {track.duration && <span>⏱️ {track.duration}</span>}
              {track.bpm && <span>🎵 {track.bpm} BPM</span>}
              {track.key && <span>🎹 {track.key}</span>}
            </div>
            {track.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {track.tags.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs rounded" style={{ background: 'var(--glass-card)', border: '1px solid var(--border-dark)' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className="w-full py-2.5 px-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60"
              style={{ 
                background: inCart ? 'var(--accent-green)' : 'var(--accent-gold)', 
                color: '#1b1b1b' 
              }}
            >
              {inCart ? '✓ I kurv' : '🛒 Legg til'}
            </button>
            <button
              onClick={() => onPurchase(track)}
              disabled={purchasingId === track.id}
              className="w-full py-2.5 px-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60"
              style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}
            >
              {purchasingId === track.id ? 'Videresender…' : `Kjøp nå`}
            </button>
            <a
              href="#services"
              className="w-full py-2.5 px-3 rounded-lg font-semibold transition-all duration-300 text-center"
              style={{ background: 'transparent', color: 'var(--text-on-dark)', border: '1px solid var(--border-light)' }}
            >
              Bestill
            </a>
          </div>
          <div className="mt-2 text-right">
            <button onClick={() => setOpen(false)} className="text-xs opacity-70 hover:opacity-100" style={{ color: 'var(--text-on-dark)' }}>
              Lukk detaljer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MusicGrid({ tracks, showAll = false }: MusicGridProps) {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTrack(null)
    }

    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  const handlePlayToggle = (track: MusicTrack) => {
    const audio = audioRef.current
    if (!audio) return

    if (currentTrack?.id === track.id && isPlaying) {
      // Pause current track
      audio.pause()
      setIsPlaying(false)
    } else {
      // Play new track
      if (currentTrack?.id !== track.id) {
        audio.src = track.audioUrl
        setCurrentTrack(track)
      }
      audio.play()
      setIsPlaying(true)
    }
  }

  const handlePurchase = async (track: MusicTrack) => {
    try {
      setPurchasingId(track.id)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: track.title,
          productId: track.id,
          genre: track.genre,
          amount: Math.max(0, Math.round((track.price || 0) * 100))
        })
      })
      const data = await response.json()
      if (response.ok && data?.url) {
        window.location.href = data.url
        return
      }
    } catch (e) {
      // Fallback below
    } finally {
      setPurchasingId(null)
    }

    const subject = `Kjøp av låt: ${track.title}`
    const body = `Hei Lydskog!\n\nJeg vil gjerne kjøpe følgende låt:\n\nTittel: ${track.title}\nArtist: ${track.artist}\nSjanger: ${track.genre}\nPris: ${track.price} kr\n\nKan dere kontakte meg for å gjennomføre kjøpet?\n\nMvh,\n[Ditt navn]`
    window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const displayTracks = showAll ? tracks : tracks.slice(0, 6)

  if (tracks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-2xl font-semibold text-white mb-2">
          Ingen musikk tilgjengelig
        </h3>
        <p className="text-gray-400">
          Sjekk tilbake senere for nye låter fra Lydskog
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
      
      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={showAll ? "all" : "limited"}
      >
        {displayTracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index}
            isPlaying={currentTrack?.id === track.id && isPlaying}
            onPlayToggle={handlePlayToggle}
            onPurchase={handlePurchase}
            purchasingId={purchasingId}
          />
        ))}
      </motion.div>
    </>
  )
}