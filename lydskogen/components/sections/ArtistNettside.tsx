'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Example {
  id: string;
  title: string;
  description: string;
  type: 'minimal' | 'music' | 'artist';
  imageUrl?: string; // Path to screenshot image
  mockupUrl?: string; // Path to HTML mockup for screenshot
  liveUrl?: string;
}

const examples: Example[] = [
  {
    id: 'minimal',
    title: 'Minimalistisk Linktree',
    description: 'Enkel og elegant - perfekt for rask tilgang til lenker',
    type: 'minimal',
    imageUrl: '/mockups/minimal-linktree.png', // Will be created from screenshot
    mockupUrl: '/mockups/minimal-linktree.html',
    liveUrl: 'https://dekaas.github.io/MODAN'
  },
  {
    id: 'music',
    title: 'Musikkfokusert',
    description: 'Høyfokus på musikk og streaming-tjenester',
    type: 'music',
    imageUrl: '/mockups/music-linktree.png', // Will be created from screenshot
    mockupUrl: '/mockups/music-linktree.html',
  },
  {
    id: 'artist',
    title: 'Artist-side med Bio',
    description: 'Komplett artistprofil med bio, lenker og kontakt',
    type: 'artist',
    imageUrl: '/mockups/artist-linktree.png', // Will be created from screenshot
    mockupUrl: '/mockups/artist-linktree.html',
  }
];

export default function ArtistNettsideSection() {
  const [activeExample, setActiveExample] = useState(0);

  const handleOrder = () => {
    const subject = 'Bestilling: Artist-nettside / Linktree';
    const body = `Hei Lydskog!\n\nJeg ønsker å bestille en artist-nettside eller linktree.\n\nFortell gjerne litt om hva du trenger:\n\n- Type: Artist-nettside / Linktree / Begge deler\n- Ønsket innhold:\n- Leveringsdato:\n\nSer frem til å høre fra dere!\n\nMvh\n[Ditt navn]`;
    window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const nextExample = () => {
    setActiveExample((prev) => (prev + 1) % examples.length);
  };

  const prevExample = () => {
    setActiveExample((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const currentExample = examples[activeExample];

  return (
    <section id="artist" className="py-16" style={{ backgroundColor: 'var(--section-bg-1)' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>
              Artist-nettside & Linktree
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto mb-4" style={{ color: 'var(--text-muted)' }}>
              En enkel side som samler alle dine lenker på ett sted – perfekt for sosiale medier og musikkpromotering
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ 
              backgroundColor: 'rgba(43, 245, 116, 0.1)', 
              border: '1px solid rgba(43, 245, 116, 0.3)',
              color: '#2BF574'
            }}>
              <span>⚡</span>
              <span>Ferdig på 5-10 arbeidsdager</span>
            </div>
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  Folk vil ha et sted å vise frem det de lager – enten det er bilder, tekst, videoer eller alt mulig annet. En egen nettside gir deg et ryddig sted å samle alt på, og når det ser profesjonelt ut, gjør det rett og slett prosjektet ditt mye mer imponerende.
                </p>
                
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                  Hva får du?
                </h3>
                <ul className="space-y-3 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  <li className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">🎨</span>
                    <span>En skreddersydd side med ditt navn, bilde og lenker</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">🔗</span>
                    <span>Samler Spotify, SoundCloud, Instagram, YouTube og mer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">📱</span>
                    <span>Mobilvennlig design som fungerer overalt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">⚡</span>
                    <span>Enkel å oppdatere med nye lenker når du vil</span>
                  </li>
                </ul>

                {/* Pricing highlight */}
                <div className="rounded-xl p-4 mb-6" style={{ 
                  backgroundColor: 'rgba(60, 43, 79, 0.2)', 
                  border: '1px solid rgba(60, 43, 79, 0.4)' 
                }}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>700 kr</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>oppstart</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>59-99 kr</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>per måned</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    Inkluderer design, hosting og domene
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleOrder}
                  className="flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-200 relative overflow-hidden group"
                  style={{
                    backgroundColor: '#2BF574',
                    color: '#132d1f',
                    border: '1px solid #2BF574'
                  }}
                >
                  <span className="relative z-10">Bestill nå</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
                {currentExample.liveUrl && (
                  <a
                    href={currentExample.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-6 rounded-lg text-sm font-medium text-center transition-all duration-200 relative overflow-hidden group"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)'
                    }}
                  >
                    <span className="relative z-10">Se live demo →</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </a>
                )}
              </div>
            </div>

            {/* Right: Examples Carousel */}
            <div className="space-y-4">
              {/* Example Selector */}
              <div className="flex gap-2 justify-center">
                {examples.map((example, index) => (
                  <button
                    key={example.id}
                    onClick={() => setActiveExample(index)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeExample === index
                        ? 'bg-accent-green text-base-dark'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {example.title}
                  </button>
                ))}
              </div>

              {/* Example Preview */}
              <div className="relative rounded-2xl overflow-hidden group" style={{ 
                backgroundColor: 'var(--section-bg-2)', 
                border: '1px solid var(--border-color)',
                minHeight: '500px'
              }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeExample}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="relative h-full"
                  >
                    {/* Screenshot Image or Fallback */}
                    {currentExample.imageUrl ? (
                      <div className="relative h-full min-h-[500px] flex items-center justify-center p-6">
                        <img
                          src={currentExample.imageUrl}
                          alt={currentExample.title}
                          className="max-w-full h-auto rounded-xl shadow-2xl"
                          onError={(e) => {
                            // Fallback to iframe if image doesn't exist yet
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && currentExample.mockupUrl) {
                              const iframe = document.createElement('iframe');
                              iframe.src = currentExample.mockupUrl;
                              iframe.className = 'w-full h-full min-h-[500px] rounded-xl border-0';
                              parent.appendChild(iframe);
                            }
                          }}
                        />
                        {/* Click overlay */}
                        {currentExample.mockupUrl && (
                          <a
                            href={currentExample.mockupUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"
                          >
                            <div className="px-6 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                              <span className="text-white font-medium">Klikk for å se full størrelse</span>
                            </div>
                          </a>
                        )}
                      </div>
                    ) : currentExample.mockupUrl ? (
                      <div className="relative h-full min-h-[500px]">
                        <iframe
                          src={currentExample.mockupUrl}
                          className="w-full h-full min-h-[500px] rounded-xl border-0"
                          title={currentExample.title}
                        />
                        {/* Click overlay */}
                        <a
                          href={currentExample.mockupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"
                        >
                          <div className="px-6 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                            <span className="text-white font-medium">Klikk for å se full størrelse</span>
                          </div>
                        </a>
                      </div>
                    ) : null}

                    {/* Example Info */}
                    <div className="absolute bottom-4 left-0 right-0 text-center px-6">
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                        {currentExample.title}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {currentExample.description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevExample}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10"
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'var(--text-color)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextExample}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10"
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'var(--text-color)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Live Badge */}
                {currentExample.liveUrl && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ 
                    backgroundColor: 'rgba(43, 245, 116, 0.2)', 
                    border: '1px solid rgba(43, 245, 116, 0.4)',
                    color: '#2BF574'
                  }}>
                    <span className="w-2 h-2 rounded-full bg-[#2BF574] animate-pulse"></span>
                    Live demo
                  </div>
                )}
              </div>

              {/* Example Indicators */}
              <div className="flex justify-center gap-2">
                {examples.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveExample(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      activeExample === index
                        ? 'bg-accent-green w-6'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
