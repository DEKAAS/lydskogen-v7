'use client';

import { useState } from 'react';
import PhoneMockup from '@/components/PhoneMockup';
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
    <section id="artist" className="py-24 bg-base-dark relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16 text-accent-warm/80 font-mono text-xs tracking-widest uppercase">
          <span className="w-12 h-[1px] bg-accent-warm/50"></span>
          [01] Tjenester — Digital Presence
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* LEFT: Technical Spec Sheet */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mb-6 tracking-tighter">
                ARTIST<br/>PACKAGE_V1
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed font-light max-w-md">
                Din digitale hub. Samle alt på ett sted med et design som matcher din lydsignatur.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex gap-8 border-b border-white/10 pb-4">
              <button 
                onClick={() => setActiveTab('linktree')}
                className={`text-sm font-mono uppercase tracking-wider pb-4 -mb-4 transition-all ${activeTab === 'linktree' ? 'text-accent-green border-b-2 border-accent-green' : 'text-gray-500 hover:text-white'}`}
              >
                Option A: Linktree
              </button>
              <button 
                onClick={() => setActiveTab('artist')}
                className={`text-sm font-mono uppercase tracking-wider pb-4 -mb-4 transition-all ${activeTab === 'artist' ? 'text-accent-green border-b-2 border-accent-green' : 'text-gray-500 hover:text-white'}`}
              >
                Option B: Artist Site
              </button>
            </div>

            {/* Technical Details Table */}
            <div className="font-mono text-sm space-y-4">
              <div className="flex justify-between border-b border-white/5 py-2">
                <span className="text-gray-500">TYPE</span>
                <span className="text-white">{activeTab === 'linktree' ? 'Bio Link Aggregator' : 'Full Single-Page Site'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-2">
                <span className="text-gray-500">DELIVERY</span>
                <span className="text-white">~5 Virkedager</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-2">
                <span className="text-gray-500">INCLUDES</span>
                <span className="text-white text-right">
                  {activeTab === 'linktree' ? 'Hosting, Custom Design, Analytics' : 'Hosting, Audio Player, Gallery'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-2">
                <span className="text-gray-500">SETUP_FEE</span>
                <span className="text-accent-green font-bold">700 NOK</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">MONTHLY</span>
                <span className="text-white">99 NOK</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleOrder}
                className="bg-accent-green text-base-dark font-mono font-bold px-8 py-4 hover:bg-white transition-colors"
              >
                INITIATE_ORDER
              </button>
              <button 
                onClick={() => window.open(activeTab === 'linktree' ? '/artist/eksempel-linktree' : '/artist/eksempel-artist', '_blank')}
                className="border border-white/20 text-white font-mono px-6 py-4 hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <span>LIVE_PREVIEW</span>
                <span className="text-xs">↗</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Visual Mockup (Floating) */}
          <div className="relative flex justify-center lg:justify-end h-[600px] lg:h-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-green/5 to-transparent rounded-full blur-3xl opacity-20 pointer-events-none" />
            <PhoneMockup type={activeTab} />
          </div>

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={handleCloseModal}>
          <div className="bg-base-dark border border-white/10 p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-500 hover:text-white font-mono">[CLOSE]</button>
            <h3 className="text-2xl font-mono text-white mb-6">START_PROJECT</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
              <input 
                placeholder="DITT NAVN" 
                className="w-full bg-black border border-white/20 p-3 text-white focus:border-accent-green outline-none"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required
              />
              <input 
                type="email" placeholder="E-POST" 
                className="w-full bg-black border border-white/20 p-3 text-white focus:border-accent-green outline-none"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required
              />
              <select 
                className="w-full bg-black border border-white/20 p-3 text-white focus:border-accent-green outline-none"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="linktree">LINKTREE PACKAGE</option>
                <option value="artist-side">ARTIST SITE PACKAGE</option>
              </select>
              <textarea 
                placeholder="KORT OM PROSJEKTET..." rows={3}
                className="w-full bg-black border border-white/20 p-3 text-white focus:border-accent-green outline-none"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <button type="submit" disabled={isSubmitting} className="w-full bg-accent-green text-black font-bold p-3 hover:bg-white transition-colors">
                {isSubmitting ? 'SENDING...' : 'CONFIRM ORDER'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
