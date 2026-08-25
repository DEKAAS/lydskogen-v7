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
    <section id="hero" className="hero-section bg-[#f4efe4] px-5 text-[#1d241d]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
        <header className="flex items-center justify-between py-6">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-[#1d241d]">
            Lydskog
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-[#5c604f] md:flex">
            <Link href="#services" className="transition-colors hover:text-[#1d241d]">
              Tjenester
            </Link>
            <Link href="#projects" className="transition-colors hover:text-[#1d241d]">
              Prosjekter
            </Link>
            <Link href="#om" className="transition-colors hover:text-[#1d241d]">
              Om
            </Link>
            <Link href="#contact" className="transition-colors hover:text-[#1d241d]">
              Kontakt
            </Link>
          </nav>
        </header>

        <div className="flex flex-1 items-center py-16 lg:py-24">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#8a7d62]">
              Miksing · Artwork · Artist-side
            </p>
            <h1 className="text-6xl font-semibold tracking-tight text-[#1d241d] md:text-8xl lg:text-9xl">
              Lydskog
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4f5749] md:text-2xl md:leading-10">
              {tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#contact"
                className="rounded-full bg-[#35412f] px-6 py-3 text-center text-sm font-semibold text-[#f8f3e8] transition-colors hover:bg-[#4f5749]"
              >
                Start en samtale
              </Link>
              <Link
                href="#services"
                className="rounded-full border border-[#d8caa8] px-6 py-3 text-center text-sm font-medium text-[#2d352b] transition-colors hover:bg-[#e7ddc9]"
              >
                Se tjenester
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
