'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  type: 'linktree' | 'artist-side';
  description: string;
}

export default function ArtistNettsideSection() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    type: 'linktree',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrder = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      email: '',
      type: 'linktree',
      description: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          type: formData.type === 'linktree' ? 'linktree' : 'artist-side',
          message: formData.description,
          source: 'ArtistNettside',
          subject: `Bestilling: ${formData.type === 'linktree' ? 'Linktree' : 'Artist-side'}`
        })
      });

      const result = await response.json();

      if (result.ok) {
        alert('Takk! Din bestilling er sendt. Vi tar kontakt snart.');
        handleCloseModal();
      } else {
        alert('Det oppstod en feil. Prøv igjen eller send e-post direkte til lydskog@proton.me');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Det oppstod en feil. Prøv igjen eller send e-post direkte til lydskog@proton.me');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="artist" className="py-16" style={{ backgroundColor: 'var(--section-bg-1)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
              <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>
                Spesial designet nettside for dine prosjekter
              </h2>
              
              {/* SVG Icon */}
              <div className="flex justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="1.5" 
                  stroke="currentColor" 
                  className="w-6 h-6"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
              </div>

              <p className="text-base md:text-lg max-w-2xl mx-auto mb-4" style={{ color: 'var(--text-muted)' }}>
                Det er digg å ha en mulighet til å presentere et galleri av din kunst, musikk eller andre prosjekter, eller bare en lang liste med linker. Det ser hvertfall litt profesjonelt ut!
              </p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono tracking-[0.12em] uppercase"
                style={{
                  backgroundColor: 'rgba(9, 30, 20, 0.9)',
                  border: '1px solid rgba(76, 175, 120, 0.4)',
                  color: 'rgba(187, 247, 208, 0.95)',
                }}
              >
                <span>Ferdig på 5–10 arbeidsdager</span>
              </div>
            </div>

            {/* Main content */}
              <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left: Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                    Hva får du?
                  </h3>
                  <ul className="space-y-3 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5">•</span>
                      <span>En skreddersydd side med ditt navn, bilde og lenker</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5">•</span>
                      <span>Samler Spotify, SoundCloud, Instagram, YouTube og mer</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5">•</span>
                      <span>Mobilvennlig design som fungerer overalt</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5">•</span>
                      <span>Enkel å oppdatere med nye lenker når du vil</span>
                    </li>
                  </ul>

                  {/* Pricing highlight */}
                  <div className="rounded-xl p-4 mb-6" style={{ 
                    backgroundColor: 'rgba(22, 24, 21, 0.7)', 
                    border: '1px solid rgba(120, 120, 120, 0.35)' 
                  }}>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>700 kr</span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>oppstart</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>fra 99 kr</span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>per måned</span>
                    </div>
                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                      Inkluderer design, hosting og tilkobling av domene – enten nytt domenenavn eller et du allerede eier.
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleOrder}
                    className="flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-colors duration-200 border"
                    style={{
                      backgroundColor: 'rgba(6, 18, 12, 0.95)',
                      borderColor: 'rgba(76, 175, 120, 0.35)',
                      color: 'rgba(187, 247, 208, 0.95)',
                    }}
                  >
                    <span className="relative z-10">Bestill nå</span>
                  </button>
                </div>
              </div>

              {/* Right: Eksempel-sider */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Eksempel A: Artist-side */}
                <a
                  href="/artist/eksempel-artist"
                  className="rounded-xl overflow-hidden group block no-underline"
                  style={{
                    backgroundColor: 'var(--section-bg-2)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {/* Forhåndsvisning som matcher ny Aurora-layout */}
                  <div className="relative aspect-[3/4] flex items-center justify-center p-4 bg-[#030806]">
                    <div className="w-full h-full rounded-lg border border-emerald-900/60 bg-[#030806] flex flex-col">
                      {/* Topp: nav-linje */}
                      <div className="px-4 pt-3 pb-4 flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-[0.25em] text-emerald-300/70">
                          LYDSKOG
                        </span>
                        <span className="text-[9px] font-mono tracking-[0.25em] text-emerald-300/40">
                          ARTIST-SIDE
                        </span>
                      </div>
                      {/* Midt: stor monospace-tittel og kort tekst */}
                      <div className="px-4 space-y-2">
                        <div className="h-10 md:h-11">
                          <span className="block text-lg font-mono tracking-[0.08em] text-emerald-100 truncate">
                            Aurora Moss
                          </span>
                        </div>
                        <div className="h-10">
                          <span className="block text-[11px] text-emerald-100/70 truncate">
                            Ambient lyd fra norske skoger.
                          </span>
                        </div>
                      </div>
                      {/* Nederst: to horisontale “audio cards” */}
                      <div className="mt-auto px-4 pb-4 space-y-2">
                        <div className="h-8 rounded-xl border border-emerald-800/80 bg-[#07120e] flex items-center px-3">
                          <div className="w-3 h-3 rounded-full bg-emerald-300/80 mr-2" />
                          <div className="h-1 rounded-full bg-emerald-300/30 flex-1" />
                        </div>
                        <div className="h-8 rounded-xl border border-emerald-800/80 bg-[#07120e] flex items-center px-3 opacity-80">
                          <div className="w-3 h-3 rounded-full bg-emerald-300/60 mr-2" />
                          <div className="h-1 rounded-full bg-emerald-300/20 flex-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                      Eksempel A · Artist-side
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Ren, mørk layout med stor monospace-tittel og rolig lydspiller.
                    </p>
                  </div>
                </a>

                {/* Eksempel B: Linktree */}
                <a
                  href="/artist/eksempel-linktree"
                  className="rounded-xl overflow-hidden group block no-underline"
                  style={{
                    backgroundColor: 'var(--section-bg-2)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div className="relative aspect-[3/4] flex items-center justify-center p-4 bg-[#030806]">
                    <div className="w-full h-full rounded-lg border border-emerald-900/60 bg-[#050d0a] relative overflow-hidden">
                      {/* Subtil artefakt/lysstripe som våkner på hover */}
                      <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-60 transition-opacity duration-500 mix-blend-soft-light bg-[radial-gradient(circle_at_0_0,#22c55e22,transparent_55%),radial-gradient(circle_at_100%_100%,#22c55e44,transparent_60%)]" />

                      <div className="relative h-full flex flex-col gap-4 px-4 py-5">
                        <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.22em] text-emerald-300/70 uppercase">
                          <span>LYDSKOG</span>
                          <span>LINKSIDE</span>
                        </div>

                        <div className="space-y-1">
                          <p className="font-mono text-[11px] text-emerald-100">@dittnavn</p>
                          <p className="text-[11px] text-emerald-200/80 truncate">
                            Rolig samleside for lenker og prosjekter.
                          </p>
                        </div>

                        <div className="flex-1 flex flex-col gap-2 justify-center">
                          <div className="h-8 rounded-2xl border border-emerald-900/80 bg-[#030806] flex items-center px-3 text-[11px] justify-between">
                            <span className="text-emerald-50 truncate">Spotify · nyeste utgivelse</span>
                            <span className="text-emerald-300 text-[10px] font-mono tracking-[0.18em] uppercase">
                              ↗
                            </span>
                          </div>
                          <div className="h-8 rounded-2xl border border-emerald-900/80 bg-[#030806] flex items-center px-3 text-[11px] justify-between opacity-90">
                            <span className="text-emerald-50 truncate">YouTube · liveopptak</span>
                            <span className="text-emerald-300 text-[10px] font-mono tracking-[0.18em] uppercase">
                              ↗
                            </span>
                          </div>
                          <div className="h-8 rounded-2xl border border-emerald-900/80 bg-[#030806] flex items-center px-3 text-[11px] justify-between opacity-80">
                            <span className="text-emerald-50 truncate">Instagram · prosess</span>
                            <span className="text-emerald-300 text-[10px] font-mono tracking-[0.18em] uppercase">
                              ↗
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                      Eksempel B · Linktree
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Monospace, mørk bakgrunn og luftige lenker – slik linktreet ditt kan se ut.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={handleCloseModal}
        >
          <div 
            className="bg-black rounded-xl p-6 max-w-md w-full border"
            style={{ 
              borderColor: 'var(--border-color)',
              backdropFilter: 'blur(10px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>
                Bestill nettside
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Navn *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border bg-black"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  E-post *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border bg-black"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'linktree' | 'artist-side' })}
                  className="w-full px-4 py-2 rounded-lg border bg-black"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                >
                  <option value="linktree">Linktree</option>
                  <option value="artist-side">Artist-side</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Beskrivelse
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border bg-black resize-none"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  backdropFilter: 'blur(10px)',
                  backgroundColor: isSubmitting ? 'rgba(43, 245, 116, 0.2)' : 'rgba(43, 245, 116, 0.1)',
                  border: '1px solid rgba(43, 245, 116, 0.3)',
                  color: '#2BF574',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Sender...' : 'Send bestilling'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
