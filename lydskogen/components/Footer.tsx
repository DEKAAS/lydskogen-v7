import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#f4efe4] px-5 text-[#5c604f]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-[#d8caa8] py-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-[#1d241d]">Lydskog</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#5c604f]">
            Miksing, artwork og Artist-side med rolig uttrykk og tydelig helhet.
          </p>
          <a href="mailto:lydskog@proton.me" className="mt-4 inline-block text-sm text-[#2d352b] hover:text-[#1d241d]">
            lydskog@proton.me
          </a>
        </div>

        <div className="flex flex-col gap-3 text-sm md:items-end">
          <div className="flex flex-wrap gap-4">
            <Link href="/#services" className="hover:text-[#1d241d]">Tjenester</Link>
            <Link href="/#projects" className="hover:text-[#1d241d]">Prosjekter</Link>
            <Link href="/#om" className="hover:text-[#1d241d]">Om</Link>
            <Link href="/#contact" className="hover:text-[#1d241d]">Kontakt</Link>
          </div>
          <p className="text-[#8a7d62]">&copy; {currentYear} Lydskog. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  );
} 