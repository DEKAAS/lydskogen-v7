'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface DemoTrack {
  id: string;
  title: string;
  genre: string;
  audioUrl: string;
  description?: string;
  duration?: string;
  bpm?: number;
}

// Default genres structure
const defaultGenres = [
  { id: 'ambient', name: 'AMBIENT', bpm: 80, color: 'bg-emerald-500', gradient: 'from-emerald-500/20 to-emerald-900/10' },
  { id: 'hiphop', name: 'HIP_HOP', bpm: 90, color: 'bg-yellow-500', gradient: 'from-yellow-500/20 to-yellow-900/10' },
  { id: 'lofi', name: 'LO_FI', bpm: 75, color: 'bg-purple-500', gradient: 'from-purple-500/20 to-purple-900/10' },
  { id: 'soundscape', name: 'SOUNDSCAPE', bpm: 60, color: 'bg-blue-500', gradient: 'from-blue-500/20 to-blue-900/10' }
];

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function AudioDemosSection() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [activeTrack, setActiveTrack] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [backgrounds, setBackgrounds] = useState<Record<string, string>>({});
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ email: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Fetch backgrounds first
    fetch('/api/genres/backgrounds')
      .then(res => res.json())
      .then(data => {
        setBackgrounds(data.backgrounds || {});
      })
      .catch(err => console.error('Failed to load backgrounds:', err));

    // Fetch tracks from API
    fetch('/api/music')
      .then(res => res.json())
      .then(data => {
        const fetchedTracks: DemoTrack[] = data.music || [];
        
        // Map tracks to include genre info from defaults
        const enrichedTracks = fetchedTracks.map(track => {
          const genreInfo = defaultGenres.find(g => g.id === track.genre);
          return {
            ...track,
            genreName: genreInfo?.name || track.genre.toUpperCase(),
            genreBpm: genreInfo?.bpm || track.bpm || 0,
            genreColor: genreInfo?.color || 'bg-gray-500',
            genreGradient: genreInfo?.gradient || 'from-gray-500/20 to-gray-900/10'
          };
        });
        
        setTracks(enrichedTracks);
        
        // Set first track as active if available
        if (enrichedTracks.length > 0 && !activeTrack) {
          setActiveTrack(enrichedTracks[0]);
        }
      })
      .catch(err => console.error('Failed to load demo tracks:', err));

    // Initialize audio element
    audioRef.current = new Audio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !activeTrack?.audioUrl) return;

    const audio = audioRef.current;
    
    // Update audio source
    audio.src = activeTrack.audioUrl;
    audio.load();

    // Event listeners
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [activeTrack]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(e => {
        console.error("Audio play failed:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!activeTrack?.audioUrl) {
      alert('Ingen demo lastet opp for dette sporet ennå.');
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (track: any) => {
    if (activeTrack?.id === track.id && isPlaying) {
      setIsPlaying(false);
    }
    setActiveTrack(track);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || !duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Produksjon Forespørsel',
          email: formData.email,
          type: `Produksjon: ${activeTrack?.genreName || 'Generell'}`,
          message: formData.description,
          source: 'AudioDemosSection',
          subject: `Bestilling Produksjon`
        })
      });
      if (response.ok) {
        alert('Takk! Din forespørsel er sendt.');
        setShowModal(false);
        setFormData({ email: '', description: '' });
      } else {
        alert('Feil ved sending.');
      }
    } catch {
      alert('Feil ved sending.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get background image for current track's genre
  const currentBgImage = activeTrack ? backgrounds[activeTrack.genre] : null;

  return (
    <section id="audio-demos" className="py-12 md:py-24 bg-[#050605] relative border-b border-white/5">
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        
        <div className="flex items-center gap-4 mb-12 text-accent-warm/80 font-mono text-xs tracking-widest uppercase">
          <span className="w-12 h-[1px] bg-accent-warm/50"></span>
          [02.5] Showcase — Lydproduksjon
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left: Track List */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-mono font-bold text-white mb-4 tracking-tighter">
                HØR PÅ VÅRE<br/>DEMOER
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
                Utforsk et utvalg av våre produksjoner. Fra atmosfæriske lydlandskap til tunge beats.
              </p>
            </div>

            {/* Track List */}
            <div className="space-y-2">
              {mounted && tracks.length > 0 ? (
                tracks.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => selectTrack(track)}
                    className={`
                      p-4 border rounded-sm cursor-pointer transition-all
                      ${activeTrack?.id === track.id
                        ? 'border-accent-green bg-accent-green/5 shadow-[0_0_20px_rgba(132,140,114,0.1)]'
                        : 'border-white/5 hover:border-white/10 hover:bg-white/5'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-bold text-white mb-1 truncate">
                          {track.title || track.genreName}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                          <span className="text-accent-green">{track.genreName}</span>
                          {track.genreBpm > 0 && (
                            <>
                              <span className="text-white/30">•</span>
                              <span>{track.genreBpm} BPM</span>
                            </>
                          )}
                        </div>
                      </div>
                      {activeTrack?.id === track.id && isPlaying && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-accent-green flex-shrink-0 mt-1"
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 border border-white/5 rounded-sm text-center">
                  <p className="text-gray-500 text-sm font-mono">
                    {mounted ? 'Ingen demoer tilgjengelig' : 'Laster demoer...'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Center & Right: Player & Info */}
          <div className="lg:col-span-2">
            {activeTrack ? (
              <div className={`
                relative p-8 md:p-12 border border-white/10 rounded-xl overflow-hidden
                bg-gradient-to-br ${activeTrack.genreGradient || 'from-gray-500/20 to-gray-900/10'}
                backdrop-blur-sm
              `}>
                {/* Background Image with Overlay */}
                {currentBgImage && (
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
                    <img 
                      src={currentBgImage} 
                      alt="Background" 
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                )}

                {/* Content Container */}
                <div className="relative z-20">
                  {/* Now Playing Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-mono text-white/60 text-xs tracking-widest uppercase">
                        NOW_PLAYING
                      </h3>
                      {isPlaying && (
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-accent-green" />
                          <span className="font-mono text-accent-green text-[10px]">LIVE</span>
                        </motion.div>
                      )}
                    </div>
                    <h4 className="text-2xl md:text-3xl font-mono font-bold text-white mb-3 drop-shadow-md">
                      {activeTrack.title || activeTrack.genreName}
                    </h4>
                    <div className="flex items-center gap-4 text-sm font-mono text-gray-300">
                      <span className="text-accent-green font-bold">{activeTrack.genreName}</span>
                      {activeTrack.genreBpm > 0 && (
                        <>
                          <span className="text-white/40">•</span>
                          <span>TEMPO: {activeTrack.genreBpm} BPM</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className="space-y-6">
                    {/* Play Button */}
                    <div className="flex items-center justify-center">
                      <button
                        onClick={togglePlay}
                        disabled={!activeTrack.audioUrl}
                        className={`
                          group relative w-20 h-20 md:w-24 md:h-24 rounded-full
                          flex items-center justify-center
                          transition-all duration-300
                          ${activeTrack.audioUrl
                            ? isPlaying
                              ? 'bg-accent-green hover:bg-accent-green/90 shadow-[0_0_40px_rgba(132,140,114,0.4)]'
                              : 'bg-white/10 hover:bg-white/20 border-2 border-white/20 backdrop-blur-md'
                            : 'bg-white/5 border-2 border-white/10 cursor-not-allowed opacity-50'
                          }
                        `}
                      >
                        <AnimatePresence mode="wait">
                          {isPlaying ? (
                            <motion.div
                              key="pause"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Pause className="w-8 h-8 md:w-10 md:h-10 text-black" fill="currentColor" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="play"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>

                    {/* Progress Bar */}
                    {activeTrack.audioUrl && (
                      <div className="space-y-2">
                        <div
                          ref={progressBarRef}
                          onClick={handleProgressClick}
                          className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group backdrop-blur-sm"
                        >
                          <motion.div
                            className="absolute left-0 top-0 h-full bg-accent-green rounded-full shadow-[0_0_10px_rgba(132,140,114,0.5)]"
                            style={{ width: `${progressPercent}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.1, ease: 'linear' }}
                          />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    )}

                    {/* Metadata & Action */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                      <div className="flex-1 space-y-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-gray-400">STATUS</span>
                          <span className={activeTrack.audioUrl ? "text-accent-green font-bold" : "text-gray-500"}>
                            {activeTrack.audioUrl ? 'KLAR' : 'INGEN LYDFIL'}
                          </span>
                        </div>
                        {activeTrack.description && (
                          <p className="text-gray-300 text-xs leading-relaxed mt-3 line-clamp-2">
                            {activeTrack.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setShowModal(true)}
                        className="bg-accent-green text-black font-mono font-bold px-6 py-3 text-sm hover:bg-white transition-colors whitespace-nowrap shadow-lg"
                      >
                        BESTILL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 md:p-16 border border-white/10 rounded-xl bg-white/5 text-center">
                <p className="text-gray-500 text-sm font-mono">
                  Velg en demo for å begynne avspilling
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0c0a] border border-white/10 p-8 max-w-md w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white font-mono text-sm"
              >
                [LUKK]
              </button>
              <h3 className="text-xl font-mono text-white mb-6">PRODUKSJON FORESPØRSEL</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="DIN E-POST"
                  className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <textarea
                  placeholder="BESKRIV PROSJEKTET DITT..."
                  rows={4}
                  className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none resize-none"
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent-green text-black font-mono font-bold py-3 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'SENDER...' : 'SEND'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
