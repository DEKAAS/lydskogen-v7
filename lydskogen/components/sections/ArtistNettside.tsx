'use client';

import WindowMockup from '@/components/WindowMockup';
import Link from 'next/link';

export default function ArtistNettsideSection() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="artist" className="relative overflow-hidden bg-[#07100b] px-4 py-24 text-stone-100 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#b6a98c]">Artist-side</p>
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            En enkel nettside for artistprofilen din.
          </h2>
          <p className="mt-6 text-base leading-8 text-stone-300">
            Samle bio, utgivelser, lenker og kontakt på et sted som føles mer personlig enn en standard lenkeside.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToContact}
              className="rounded-full bg-[#d8caa8] px-5 py-3 text-sm font-semibold text-[#10180f] transition-colors hover:bg-white"
            >
              Ta kontakt
            </button>
            <Link
              href="/artist/eksempel-artist"
              className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Se showcase
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <WindowMockup />
        </div>
      </div>
    </section>
  );
}
