'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const genres = [
  { id: 'ambient', name: 'AMBIENT', bpm: 80, color: 'bg-emerald-500' },
  { id: 'hiphop', name: 'HIP_HOP', bpm: 90, color: 'bg-yellow-500' },
  { id: 'lofi', name: 'LO_FI', bpm: 75, color: 'bg-purple-500' },
  { id: 'soundscape', name: 'SOUNDSCAPE', bpm: 60, color: 'bg-blue-500' }
];

const SequencerRow = ({ genre, isActive, onClick }: { genre: any, isActive: boolean, onClick: () => void }) => {
  // Reduce steps on mobile (8 instead of 16)
  const steps = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 16;

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
        <div className="font-mono text-[10px] text-gray-600">{genre.bpm} BPM</div>
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

      {/* Mute/Solo Controls (Visual Only) - Hide on mobile */}
      <div className="hidden md:flex gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
        <div className="w-6 h-6 border border-white/20 rounded flex items-center justify-center text-[8px] font-mono text-gray-400">M</div>
        <div className="w-6 h-6 border border-white/20 rounded flex items-center justify-center text-[8px] font-mono text-gray-400">S</div>
      </div>
    </div>
  );
};

export default function MusikkproduksjonSeksjon() {
  const [activeGenre, setActiveGenre] = useState(genres[0].id);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="musikkproduksjon" className="py-32 bg-[#050605] relative border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        
        <div className="flex items-center gap-4 mb-16 text-accent-warm/80 font-mono text-xs tracking-widest uppercase">
          <span className="w-12 h-[1px] bg-accent-warm/50"></span>
          [03] Tjenester — Produksjon
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Left: Info */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-mono font-bold text-white mb-6 tracking-tighter">
                LYD<br/>DESIGN
              </h2>
              <p className="text-gray-400 text-lg font-light leading-relaxed">
                Skreddersydd musikkproduksjon for ditt prosjekt. Fra teksturelle lydlandskap til rytmiske beats.
              </p>
            </div>

            <div className="p-6 border border-white/10 bg-white/5 rounded-lg">
              <h3 className="font-mono text-white text-sm mb-4">AKTIVT SPOR INFO</h3>
              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">SJANGER</span>
                  <span className="text-accent-green">{genres.find(g => g.id === activeGenre)?.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">TEMPO</span>
                  <span className="text-white">{genres.find(g => g.id === activeGenre)?.bpm} BPM</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">STATUS</span>
                  <span className="text-white">KLAR FOR BESTILLING</span>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="w-full mt-6 bg-accent-green text-black font-mono font-bold py-3 text-sm hover:bg-white transition-colors"
              >
                START PROSJEKT
              </button>
            </div>
          </div>

          {/* Right: The Sequencer */}
          <div className="lg:col-span-8">
            <div className="bg-[#080a08] border border-white/10 rounded-xl p-1">
              {/* Transport Bar */}
              <div className="flex items-center justify-between p-4 border-b border-white/5 mb-1 bg-[#0a0c0a]">
                <div className="flex gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="font-mono text-[10px] text-gray-600 tracking-widest">SEQUENCER_VIEW_V2.0</div>
              </div>

              {/* Tracks */}
              <div className="space-y-1 p-4">
                {mounted && genres.map((genre) => (
                  <SequencerRow 
                    key={genre.id} 
                    genre={genre} 
                    isActive={activeGenre === genre.id}
                    onClick={() => setActiveGenre(genre.id)}
                  />
                ))}
                
                {/* Empty Slots */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 border border-white/5 border-dashed opacity-30 flex items-center justify-center">
                    <span className="font-mono text-[10px] text-gray-700">EMPTY_SLOT</span>
                  </div>
                ))}
              </div>

              {/* Timeline/Playhead Area */}
              <div className="h-8 border-t border-white/5 bg-[#0a0c0a] relative overflow-hidden">
                <motion.div 
                  animate={{ x: ['0%', '100%'] }}
                  transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                  className="absolute top-0 bottom-0 w-px bg-accent-green/50 shadow-[0_0_10px_rgba(132,140,114,0.5)]"
                />
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
          <div className="bg-[#0a0c0a] border border-white/10 p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-mono text-white mb-6">PRODUKSJON FORESPØRSEL</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Takk!'); setShowModal(false); }}>
              <input 
                type="email" placeholder="DIN E-POST" 
                className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none"
                required
              />
              <select 
                className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none"
                value={activeGenre}
                onChange={(e) => setActiveGenre(e.target.value)}
              >
                {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <textarea 
                placeholder="BESKRIV PROSJEKTET DITT..." rows={4}
                className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-accent-green outline-none"
                required
              />
              <button className="w-full bg-accent-green text-black font-mono font-bold py-3 hover:bg-white transition-colors">
                SEND
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
