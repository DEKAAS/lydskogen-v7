'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeaderHero() {
  const [tagline, setTagline] = useState(
    'Miksing, artwork og Artist-side for prosjekter som trenger en rolig og tydelig helhet.'
  );

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.hero_tagline) setTagline(data.hero_tagline);
      })
      .catch(err => console.error('Error fetching tagline:', err));
  }, []);

  return (
    <section id="hero" className="hero-section relative min-h-screen overflow-hidden bg-[#07100b] px-4 py-6 text-stone-100 md:px-8">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07100b]/80 via-[#07100b]/75 to-[#07100b]" />
      <div className="absolute left-[-10%] top-1/3 h-80 w-80 rounded-full bg-[#4f6f52]/20 blur-3xl" />
      <div className="absolute bottom-10 right-[-8%] h-96 w-96 rounded-full bg-[#8a6f4d]/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-5 py-4 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-100">
            Lydskog
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-stone-300 md:flex">
            <Link href="#services" className="transition-colors hover:text-white">
              Tjenester
            </Link>
            <Link href="#projects" className="transition-colors hover:text-white">
              Prosjekter
            </Link>
            <Link href="#om" className="transition-colors hover:text-white">
              Om
            </Link>
            <Link href="#contact" className="transition-colors hover:text-white">
              Kontakt
            </Link>
          </nav>
        </header>

        <div className="flex flex-1 items-center py-24">
          <div className="max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.07] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-12">
            <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#d8caa8]">
              Miksing · Artwork · Artist-side
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-white md:text-7xl lg:text-8xl">
              Lydskog
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-stone-200 md:text-2xl md:leading-10">
              {tagline}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#contact"
                className="rounded-full bg-[#d8caa8] px-6 py-3 text-center text-sm font-semibold text-[#10180f] transition-colors hover:bg-white"
              >
                Start en samtale
              </Link>
              <Link
                href="#services"
                className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-center text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Se tjenester
              </Link>
            </div>
        </div>
        </div>

        <div className="mb-6 flex flex-col justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-black/15 px-5 py-4 text-sm text-stone-400 backdrop-blur md:flex-row">
          <span>Oslo, Norway</span>
          <span>Rolig design for lyd, bilde og artistprofiler</span>
        </div>
      </div>
    </section>
  );
}
