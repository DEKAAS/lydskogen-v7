'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function HeaderHero() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return (
    <section id="hero" className="hero-section relative h-screen flex flex-col overflow-hidden" style={{
      backgroundImage: 'url(/images/hero.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      marginTop: 0,
      paddingTop: 0
    }}>
      {/* Subtle overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.4)' }} />

      {/* Full-width Navigation - Top of screen */}
      <nav 
        className="relative z-30 w-full px-6 py-5 flex justify-center items-center"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.25)', 
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: 0
        }}
      >
        <div className="flex justify-center items-center space-x-6 max-w-6xl w-full mx-auto">
          <Link 
            href="#artist" 
            className="nav-link-hero text-base font-medium px-4 py-2 rounded-lg transition-all hover:bg-white/10 flex items-center justify-center" 
            style={{color: 'rgba(255, 255, 255, 0.95)'}}
          >
            Tjenester
          </Link>
          <Link 
            href="#om" 
            className="nav-link-hero text-base font-medium px-4 py-2 rounded-lg transition-all hover:bg-white/10 flex items-center justify-center" 
            style={{color: 'rgba(255, 255, 255, 0.95)'}}
          >
            Om
          </Link>
          <Link 
            href="#contact" 
            className="nav-link-hero text-base font-medium px-4 py-2 rounded-lg transition-all hover:bg-white/10 flex items-center justify-center" 
            style={{color: 'rgba(255, 255, 255, 0.95)'}}
          >
            Kontakt
          </Link>
          {session?.user?.role === 'admin' ? (
            <Link 
              href="/admin/dashboard" 
              className="nav-link-hero text-base font-medium px-4 py-2 rounded-lg border border-white/20 transition-all hover:bg-white/10 flex items-center justify-center" 
              style={{color: 'rgba(255, 255, 255, 0.95)'}}
            >
              Admin
            </Link>
          ) : (
            <Link 
              href="/admin/login" 
              className="nav-link-hero text-base font-medium px-4 py-2 rounded-lg border border-white/20 transition-all hover:bg-white/10 flex items-center justify-center" 
              style={{color: 'rgba(255, 255, 255, 0.95)'}}
            >
              Logg inn
            </Link>
          )}
        </div>
      </nav>

      {/* Main Hero Content - Centered and Spacious */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="text-center max-w-5xl mx-auto">
          <div>
            <h1 className="hero-title text-6xl md:text-8xl lg:text-9xl font-extrabold mb-6 tracking-tight relative">
              {/* Subtil grønn glow */}
              <div
                className="absolute inset-0 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight opacity-20 blur-3xl"
                style={{ color: '#5a9068' }}
              >
                Lydskog
              </div>
            
              {/* Main text - naturlig grønn */}
              <div className="relative z-10">
                <span
                  style={{ 
                    color: '#c8e6d0',
                    fontWeight: 800,
                    letterSpacing: '0.03em',
                    textShadow: '0 4px 20px rgba(90, 144, 104, 0.3)'
                  }}
                >
                  Lydskog
                </span>
              </div>
            </h1>
          </div>

          <div className="space-y-4">
            <p 
              className="text-2xl md:text-3xl lg:text-4xl mb-4 max-w-3xl mx-auto leading-relaxed font-light"
              style={{color: 'rgba(255, 255, 255, 0.95)'}}
            >
             Produksjon og miksing
            </p>
            <p 
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
              style={{opacity: 0.85}}
            >
              Hvor lyd blir til opplevelse
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center">
          <svg 
            className="w-6 h-6 text-white/50" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
} 