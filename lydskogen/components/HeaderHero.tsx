'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function HeaderHero() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return (
    <section id="hero" className="hero-section relative h-screen flex items-center justify-center overflow-hidden" style={{
      backgroundImage: 'url(/images/hero.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Diffuse overlay animations */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.35)' }}>
        <motion.div
          className="absolute -top-32 -left-24 w-[60vw] h-[60vw] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(20,80,60,0.35), transparent 60%)' }}
          animate={{ x: [0, 30, -20, 0], y: [0, 10, -10, 0], opacity: [0.25, 0.4, 0.3, 0.25] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -right-16 w-[55vw] h-[55vw] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(10,120,80,0.25), transparent 60%)' }}
          animate={{ x: [0, -20, 15, 0], y: [0, -10, 10, 0], opacity: [0.2, 0.35, 0.25, 0.2] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 40%, rgba(0,0,0,0.2))' }}
          animate={{ opacity: [0.6, 0.7, 0.6] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Glass Container with Navbar and Content */}
      <motion.div 
        className="glass-container relative z-10 mx-4 flex flex-col text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Internal Navigation - transparent */}
        <nav 
          className="internal-navbar flex justify-center space-x-4 mb-8 px-3 py-2 sticky top-4 z-20"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(10px)' }}
        >
          <Link href="#artist" className="nav-link-small text-sm" style={{color: 'rgba(255, 255, 255, 0.9)'}}>
            Tjenester
          </Link>
          <Link href="#contact" className="nav-link-small text-sm" style={{color: 'rgba(255, 255, 255, 0.9)'}}>
            Kontakt
          </Link>
          {session?.user?.role === 'admin' ? (
            <Link href="/admin/dashboard" className="nav-link-small text-sm px-3 py-1 rounded-full border border-white/30" style={{color: 'rgba(255, 255, 255, 0.9)', backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
              Admin
            </Link>
          ) : (
            <Link href="/admin/login" className="nav-link-small text-sm px-3 py-1 rounded-full border border-white/30" style={{color: 'rgba(255, 255, 255, 0.9)', backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
              Logg inn
            </Link>
          )}
        </nav>

        {/* Content Container - Centered */}
        <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title text-5xl md:text-7xl font-extrabold mb-6 tracking-tight relative">
            {/* Subtil grønn glow */}
            <div
              className="absolute inset-0 text-4xl md:text-6xl font-bold tracking-tight opacity-15 blur-2xl"
              style={{ color: '#5a9068' }}
            >
              Lydskog
            </div>
            
            {/* Main text - naturlig grønn */}
            <div className="relative z-10">
              <span
                style={{ 
                  color: '#c8e6d0',
                  fontWeight: 700,
                  letterSpacing: '0.02em'
                }}
              >
                Lydskog
              </span>
            </div>
          </h1>
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed"
          style={{color: 'var(--text-on-dark)', opacity: 0.9}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Velkommen hit!
        </motion.p>

        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <motion.div
          className="flex flex-col items-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg 
            className="w-6 h-6 text-white/60" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </motion.div>
      </motion.div>
      </section>
  );
} 