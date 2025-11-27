'use client';

import { useState } from 'react';
import WindowMockup from '@/components/WindowMockup';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  type: 'linktree' | 'artist-side';
  description: string;
}

export default function ArtistNettsideSection() {
  const [activeTab, setActiveTab] = useState<'linktree' | 'artist'>('linktree');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', type: 'linktree', description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrder = () => setShowModal(true);
  const handleCloseModal = () => { setShowModal(false); setFormData({ name: '', email: '', type: 'linktree', description: '' }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          type: formData.type,
          message: formData.description,
          source: 'ArtistNettside',
          subject: `Bestilling: ${formData.type}`
        })
      });
      if (response.ok) { alert('Takk! Din bestilling er sendt.'); handleCloseModal(); }
      else { alert('Det oppstod en feil.'); }
    } catch { alert('Det oppstod en feil.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    // Extended bottom padding (pb-48) and forced full-height gradient ensure the transition completes well before the divider
    <section id="artist" className="pt-32 pb-48 relative overflow-hidden bg-[#050605]">
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-24 text-accent-warm/80 font-mono text-xs tracking-widest uppercase">
          <span className="w-12 h-[1px] bg-accent-warm/50"></span>
          [01] Tjenester — Digital Tilstedeværelse
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          {/* LEFT: Technical Spec Sheet */}
          <div className="space-y-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-mono font-bold text-white mb-8 tracking-tighter">
                ARTIST<br/>PAKKE_V1
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed font-light max-w-md">
                Din digitale hub. Samle alt på ett sted med et design som matcher din lydsignatur. Minimalistisk, funksjonelt og profesjonelt.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex gap-12 border-b border-white/10 pb-6">
              <button 
                onClick={() => setActiveTab('linktree')}
                className={`text-sm font-mono uppercase tracking-wider pb-6 -mb-6 transition-all ${activeTab === 'linktree' ? 'text-accent-green border-b-2 border-accent-green' : 'text-gray-500 hover:text-white'}`}
              >
                Valg A: Linktree
              </button>
              <button 
                onClick={() => setActiveTab('artist')}
                className={`text-sm font-mono uppercase tracking-wider pb-6 -mb-6 transition-all ${activeTab === 'artist' ? 'text-accent-green border-b-2 border-accent-green' : 'text-gray-500 hover:text-white'}`}
              >
                Valg B: Nettside
              </button>
            </div>

            {/* Technical Details Table */}
            <div className="font-mono text-sm space-y-6">
              <div className="flex justify-between border-b border-white/5 py-3">
                <span className="text-gray-500">TYPE</span>
                <span className="text-white">{activeTab === 'linktree' ? 'Bio Link Aggregator' : 'Full En-Siders Side'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-3">
                <span className="text-gray-500">LEVERING</span>
                <span className="text-white">~5 Virkedager</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-3">
                <span className="text-gray-500">INKLUDERER</span>
                <span className="text-white text-right">
                  {activeTab === 'linktree' ? 'Hosting, Design, Statistikk' : 'Hosting, Lydspiller, Galleri'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-3">
                <span className="text-gray-500">ETABLERING</span>
                <span className="text-accent-green font-bold">700 NOK</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-500">MÅNEDLIG</span>
                <span className="text-white">99 NOK</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <button 
                onClick={handleOrder}
                className="bg-accent-green text-base-dark font-mono font-bold px-10 py-4 hover:bg-white transition-colors text-center"
              >
                BESTILL NÅ
              </button>
              <button 
                onClick={() => window.open(activeTab === 'linktree' ? '/artist/eksempel-linktree' : '/artist/eksempel-artist', '_blank')}
                className="border border-white/20 text-white font-mono px-8 py-4 hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
              >
                <span>SE EKSEMPEL</span>
                <span className="text-xs">↗</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Visual Mockup (Floating) */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-green/5 to-transparent rounded-full blur-3xl opacity-20 pointer-events-none" />
            <WindowMockup type={activeTab} />
          </div>

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={handleCloseModal}>
          <div className="bg-base-dark border border-white/10 p-10 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseModal} className="absolute top-6 right-6 text-gray-500 hover:text-white font-mono">[LUKK]</button>
            <h3 className="text-2xl font-mono text-white mb-8">START PROSJEKT</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5 font-mono text-sm">
              <div className="space-y-2">
                <label className="text-xs text-gray-500">NAVN / ARTISTNAVN</label>
                <input 
                  className="w-full bg-black border border-white/20 p-4 text-white focus:border-accent-green outline-none transition-colors"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-500">E-POST ADRESSE</label>
                <input 
                  type="email" 
                  className="w-full bg-black border border-white/20 p-4 text-white focus:border-accent-green outline-none transition-colors"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500">PAKKEVALG</label>
                <select 
                  className="w-full bg-black border border-white/20 p-4 text-white focus:border-accent-green outline-none transition-colors"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="linktree">LINKTREE PAKKE</option>
                  <option value="artist-side">ARTIST NETTSIDE PAKKE</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500">KORT OM PROSJEKTET</label>
                <textarea 
                  rows={4}
                  className="w-full bg-black border border-white/20 p-4 text-white focus:border-accent-green outline-none transition-colors"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-accent-green text-black font-bold p-4 hover:bg-white transition-colors mt-4">
                {isSubmitting ? 'SENDER...' : 'BEKREFT BESTILLING'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
