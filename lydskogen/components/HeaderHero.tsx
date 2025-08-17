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
        {/* Internal Navigation */}
        <motion.nav 
          className="internal-navbar flex justify-center space-x-4 mb-8 px-3 py-2 sticky top-4 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link href="/" className="nav-link-small transition-colors duration-300 text-sm" style={{color: 'var(--text-on-dark)'}}>
            🏠
          </Link>
          <Link href="#artist" className="nav-link-small transition-colors duration-300 text-sm" style={{color: 'var(--text-on-dark)'}}>
            Tjenester
          </Link>
          <Link href="#contact" className="nav-link-small transition-colors duration-300 text-sm" style={{color: 'var(--text-on-dark)'}}>
            Kontakt
          </Link>
          {session?.user?.role === 'admin' ? (
            <Link href="/admin/dashboard" className="nav-link-small transition-colors duration-300 text-sm bg-accent-green/20 px-3 py-1 rounded-full border border-accent-green/30" style={{color: 'var(--accent-green)'}}>
              Admin Panel
            </Link>
          ) : (
            <Link href="/admin/login" className="nav-link-small transition-colors duration-300 text-sm bg-white/10 px-3 py-1 rounded-full border border-white/20" style={{color: 'var(--text-on-dark)'}}>
              Logg inn
            </Link>
          )}
        </motion.nav>

        {/* Content Container - Centered */}
        <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title text-5xl md:text-7xl font-extrabold mb-6 tracking-tight relative" style={{color: 'var(--text-on-dark)'}}>
            {/* Subtle glow background */}
            <motion.div
              className="absolute inset-0 text-4xl md:text-6xl font-bold tracking-tight opacity-30 blur-2xl"
              animate={{
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-accent-green/60">Lyd</span>
              <span className="text-accent-green/80">skog</span>
            </motion.div>
            
            {/* Main text */}
            <div className="relative z-10">
              <motion.span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #059669, #0d9488, #14b8a6)' }}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.15 }}
              >
                Lydskog
              </motion.span>
              {/* overlay sheen */}
              {mounted && (
              <motion.div
                className="absolute inset-0 overflow-hidden rounded"
                initial={{ opacity: 0.15 }}
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* particle-like dust */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      top: `${Math.random() * 80 + 10}%`,
                      left: `${Math.random() * 80 + 10}%`,
                      background: 'rgba(255,255,255,0.6)'
                    }}
                    animate={{
                      y: [0, -6, 0],
                      x: [0, 4, -3, 0],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
              )}
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