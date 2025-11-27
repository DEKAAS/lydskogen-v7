'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function HeaderHero() {
  const [tagline, setTagline] = useState('Laster...');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.hero_tagline) setTagline(data.hero_tagline);
      })
      .catch(err => console.error('Error fetching tagline:', err));
  }, []);

  // Split tagline into words for staggered animation
  const words = tagline.split(' ');

  return (
    <section id="hero" className="hero-section relative h-screen flex flex-col overflow-hidden bg-base-dark">
      {/* Background Image with darkening */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.6
        }}
      />
      
      {/* Gradient Overlay for text readability and bottom transition */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-base-dark/80 via-base-dark/40 to-[#000000]" />

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col p-6 md:p-12 max-w-[1600px] mx-auto w-full">
        
        {/* Header Row: Title Left, Nav Right */}
        <div className="flex justify-between items-start">
          
          {/* Brand Title (Top Left) */}
          <div className="flex flex-col">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-7xl lg:text-8xl font-mono font-bold tracking-tighter text-white"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
            >
              LYDSKOG
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-2 flex items-center gap-2 text-accent-green font-mono text-xs md:text-sm tracking-widest uppercase"
            >
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
              <span>Fokus på lyd og bilde</span>
            </motion.div>
          </div>

          {/* Navigation (Top Right) */}
          <nav className="hidden md:flex flex-col items-end gap-2 font-mono text-sm">
            <Link href="#artist" className="text-gray-300 hover:text-white hover:underline decoration-accent-green underline-offset-4 transition-all">
              [01] TJENESTER
            </Link>
            <Link href="#portfolio" className="text-gray-300 hover:text-white hover:underline decoration-accent-green underline-offset-4 transition-all">
              [02] PROSJEKTER
            </Link>
            <Link href="#om" className="text-gray-300 hover:text-white hover:underline decoration-accent-green underline-offset-4 transition-all">
              [03] OM OSS
            </Link>
            <Link href="#contact" className="text-gray-300 hover:text-white hover:underline decoration-accent-green underline-offset-4 transition-all">
              [04] KONTAKT
            </Link>
          </nav>
        </div>

        {/* Dynamic Tagline (Middle Left) */}
        <div className="mt-24 md:mt-48 max-w-2xl">
          <div className="text-lg md:text-3xl lg:text-4xl font-light leading-relaxed text-gray-200">
            {mounted && words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ 
                  delay: 1 + (i * 0.05), 
                  duration: 0.8,
                  ease: "easeOut"
                }}
                className="inline-block mr-2 md:mr-3"
              >
                {word}
              </motion.span>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100px' }}
            transition={{ delay: 2, duration: 1 }}
            className="h-1 bg-accent-green mt-8"
          />
        </div>

        {/* Bottom Info */}
        <div className="mt-auto flex justify-between items-end text-xs md:text-sm font-mono text-gray-500">
          <div>
            <p>EST. 2025</p>
            <p>OSLO, NORWAY</p>
          </div>
          <div className="flex flex-col items-end">
            <p>SCROLL TO EXPLORE</p>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-2"
            >
              ↓
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
