'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface DemoTrack {
  id: string;
  title: string;
  genre: string;
  audioUrl: string;
  description?: string;
  duration?: string;
}

// Default genres structure
const defaultGenres = [
  { id: 'ambient', name: 'AMBIENT', bpm: 80, color: 'bg-emerald-500' },
  { id: 'hiphop', name: 'HIP_HOP', bpm: 90, color: 'bg-yellow-500' },
  { id: 'lofi', name: 'LO_FI', bpm: 75, color: 'bg-purple-500' },
  { id: 'soundscape', name: 'SOUNDSCAPE', bpm: 60, color: 'bg-blue-500' }
];

const SequencerRow = ({ genre, isActive, isPlaying, onClick }: { genre: any, isActive: boolean, isPlaying: boolean, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative flex items-center gap-4 p-4 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${isActive ? 'bg-white/5 border-l-2 border-l-accent-green' : ''}`}
    >
      {/* Track Info */}
      <div className="w-24 md:w-32 flex-shrink-0">
        <div className={`font-mono text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
          {genre.name}
        </div>
        <div className="font-mono text-[10px] text-gray-600 flex items-center gap-2">
            {genre.bpm} BPM
            {isActive && isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"/>}
        </div>
      </div>

      {/* Steps Grid */}
      <div className="flex-1 flex gap-1 h-8 items-center">
        {[...Array(16)].map((_, i) => (
          <div 
            key={i}
            className={`flex-1 h-full rounded-sm transition-all duration-300 
              ${i % 4 === 0 ? 'w-1.5' : 'w-1'} 
              ${isActive && Math.random() > 0.5 ? genre.color : 'bg-[#1a1c1a]'} 
              ${isActive ? 'opacity-80' : 'opacity-30'}
              ${i >= 8 ? 'hidden md:block' : ''} // Hide steps 8-15 on mobile
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default function AudioDemosSection() {
  const [genres, setGenres] = useState<any[]>(defaultGenres);
  const [activeGenre, setActiveGenre] = useState(defaultGenres[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [formData, setFormData] = useState({ email: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    audioRef.current = new Audio();
    
    // Fetch tracks from API
    fetch('/api/music')
      .then(res => res.json())
      .then(data => {
        const tracks: DemoTrack[] = data.music || [];
        
        // Update genres with audio URLs from fetched tracks
        const updatedGenres = defaultGenres.map(genre => {
          // Find a track for this genre
          const track = tracks.find(t => t.genre === genre.id);
          return {
            ...genre,
            audioUrl: track ? track.audioUrl : null, // Use track URL if found
            trackTitle: track ? track.title : null
          };
        });
        
        setGenres(updatedGenres);
      })
      .catch(err => console.error('Failed to load demo tracks:', err));

    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  useEffect(() => {
      if (!audioRef.current) return;
      
      const genre = genres.find(g => g.id === activeGenre);
      if (genre && genre.audioUrl) {
          audioRef.current.src = genre.audioUrl;
          audioRef.current.load(); // Ensure new source is loaded
      } else {
          // No audio for this genre
          audioRef.current.removeAttribute('src');
      }
      
      setIsPlaying(false);
      
  }, [activeGenre, genres]); // Re-run when activeGenre changes OR when genres (and audioUrls) are loaded

  const togglePlay = () => {
      if (!audioRef.current) return;
      
      const genre = genres.find(g => g.id === activeGenre);
      if (!genre?.audioUrl) {
          alert('Ingen demo lastet opp for denne sjangeren ennå.');
          return;
      }

      if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
      } else {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => {
                console.error("Audio play failed:", e);
                setIsPlaying(false);
            });
          
          // Auto-stop when ended
          audioRef.current.onended = () => setIsPlaying(false);
      }
  };
  
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
            type: `Produksjon: ${genres.find(g => g.id === activeGenre)?.name}`,
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

  const currentGenre = genres.find(g => g.id === activeGenre);

  return (
    <section id="audio-demos" className="py-12 md:py-24 bg-[#050605] relative border-b border-white/5">
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        
        <div className="flex items-center gap-4 mb-12 text-accent-warm/80 font-mono text-xs tracking-widest uppercase">
          <span className="w-12 h-[1px] bg-accent-warm/50"></span>
          [02.5] Showcase — Lydproduksjon
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left: Info & Player Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-mono font-bold text-white mb-6 tracking-tighter">
                HØR PÅ VÅRE<br/>DEMOER
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
                Utforsk et utvalg av våre produksjoner. Fra atmosfæriske lydlandskap til tunge beats.
              </p>
            </div>

            <div className="p-6 border border-white/10 bg-white/5 rounded-lg backdrop-blur-sm">
              <h3 className="font-mono text-white text-sm mb-4 flex justify-between items-center">
                  <span>NOW_PLAYING</span>
                  {isPlaying && <span className="text-accent-green text-[10px] animate-pulse">● LIVE</span>}
              </h3>
              
              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">SPOR</span>
                  <span className="text-accent-green font-bold truncate pl-4">
                    {currentGenre?.trackTitle || currentGenre?.name || 'IKKE VALGT'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">TEMPO</span>
                  <span className="text-white">{currentGenre?.bpm} BPM</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">STATUS</span>
                  <span className={currentGenre?.audioUrl ? "text-white" : "text-gray-600"}>
                    {currentGenre?.audioUrl ? 'KLAR TIL AVSPILLING' : 'INGEN LYDFIL'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                  <button 
                    onClick={togglePlay}
                    disabled={!currentGenre?.audioUrl}
                    className={`py-3 font-mono font-bold text-sm border transition-all ${
                        isPlaying 
                        ? 'border-accent-green text-accent-green bg-accent-green/10' 
                        : !currentGenre?.audioUrl
                            ? 'border-gray-800 text-gray-600 cursor-not-allowed'
                            : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    {isPlaying ? 'PAUSE ||' : 'PLAY ▶'}
                  </button>
                  <button 
                    onClick={() => setShowModal(true)}
                    className="bg-accent-green text-black font-mono font-bold py-3 text-sm hover:bg-white transition-colors"
                  >
                    BESTILL
                  </button>
              </div>
            </div>
          </div>

          {/* Right: The Sequencer Visualizer */}
          <div className="lg:col-span-8">
            <div className="bg-[#080a08] border border-white/10 rounded-xl p-1 h-full flex flex-col">
              {/* Transport Bar */}
              <div className="flex items-center justify-between p-4 border-b border-white/5 mb-1 bg-[#0a0c0a]">
                <div className="flex gap-4">
                  <div className={`w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 ${isPlaying ? 'animate-pulse' : ''}`} />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="font-mono text-[10px] text-gray-600 tracking-widest">
                    {isPlaying ? 'PLAYBACK_ACTIVE' : 'SEQUENCER_READY'}
                </div>
              </div>

              {/* Tracks */}
              <div className="space-y-1 p-4 flex-1">
                {mounted && genres.map((genre) => (
                  <SequencerRow 
                    key={genre.id} 
                    genre={genre} 
                    isActive={activeGenre === genre.id}
                    isPlaying={isPlaying}
                    onClick={() => setActiveGenre(genre.id)}
                  />
                ))}
                
                {/* Empty Slots filler */}
                <div className="h-full min-h-[100px] border border-white/5 border-dashed opacity-20 flex items-center justify-center mt-2 rounded">
                   <span className="font-mono text-[10px] text-gray-600">Drag & Drop Samples (Demo)</span>
                </div>
              </div>

              {/* Timeline/Playhead Area */}
              <div className="h-8 border-t border-white/5 bg-[#0a0c0a] relative overflow-hidden">
                {isPlaying && (
                    <motion.div 
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                    className="absolute top-0 bottom-0 w-px bg-accent-green/50 shadow-[0_0_10px_rgba(132,140,114,0.5)]"
                    />
                )}
                <div className="flex justify-between px-4 pt-2">
                  {[...Array(8)].map((_, i) => (
                    <span key={i} className="font-mono text-[8px] text-gray-700">{i + 1}.0</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Simple Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-[#0a0c0a] border border-white/10 p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">[LUKK]</button>
            <h3 className="text-xl font-mono text-white mb-6">PRODUKSJON FORESPØRSEL</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input 
                type="email" placeholder="DIN E-POST" 
                className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <textarea 
                placeholder="BESKRIV PROSJEKTET DITT..." rows={4}
                className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none"
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <button 
                disabled={isSubmitting}
                className="w-full bg-accent-green text-black font-mono font-bold py-3 hover:bg-white transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'SENDER...' : 'SEND'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
