import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-white/10 bg-[#07100b] px-4 py-10 text-stone-300 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-white">Lydskog</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone-400">
            Miksing, artwork og Artist-side med rolig uttrykk og tydelig helhet.
          </p>
          <a href="mailto:lydskog@proton.me" className="mt-4 inline-block text-sm text-[#d8caa8] hover:text-white">
            lydskog@proton.me
          </a>
        </div>

        <div className="flex flex-col gap-3 text-sm md:items-end">
          <div className="flex flex-wrap gap-4">
            <Link href="/#services" className="hover:text-white">Tjenester</Link>
            <Link href="/#projects" className="hover:text-white">Prosjekter</Link>
            <Link href="/#om" className="hover:text-white">Om</Link>
            <Link href="/#contact" className="hover:text-white">Kontakt</Link>
          </div>
          <p className="text-stone-500">&copy; {currentYear} Lydskog. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  );
} 