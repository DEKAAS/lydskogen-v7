'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AboutSection() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Failed to load content:', err));
  }, []);

  const title = content['about_title'] || 'HVEM ER LYDSKOG';
  const text = content['about_content'] || 'Lydskog er et kreativt studio som tilbyr profesjonelle lyd- og designtjenester for artister og skapere.\n\nMed fokus på kvalitet og personlig tilnærming hjelper vi deg med å løfte dine prosjekter til et nytt nivå.';
  const bgImage = content['about_bg_image']; // Optional background
  const sideImage = content['about_side_image']; // Optional side image
  
  const titleSize = content['about_title_size'] || 'medium';
  const isMono = content['about_title_mono'] === 'true';

  // Map size names to Tailwind classes
  const sizeClasses: Record<string, string> = {
    small: 'text-2xl md:text-3xl',
    medium: 'text-3xl md:text-5xl',
    large: 'text-4xl md:text-6xl',
    xl: 'text-5xl md:text-7xl',
    giga: 'text-6xl md:text-9xl'
  };

  if (!mounted) return null;

  return (
    <section
      className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-[#07100b] px-4 py-24 md:px-8 md:py-32"
      id="om"
    >
      {bgImage && (
        <div className="absolute inset-0 z-0 h-full w-full">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07100b]/90 via-[#07100b]/75 to-[#07100b]" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-10 left-[-10%] h-80 w-80 rounded-full bg-[#4f6f52]/15 blur-3xl" />
        <div className="absolute right-[-8%] top-10 h-72 w-72 rounded-full bg-[#8a6f4d]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className={`grid gap-8 ${sideImage ? 'lg:grid-cols-[1.1fr_0.9fr]' : ''} items-start`}>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-10">
            <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#b6a98c]">Kort om</p>
            <h2
              className={`
                font-semibold text-white leading-tight tracking-tight
                ${sizeClasses[titleSize]}
                ${isMono ? 'font-mono' : 'font-sans'}
              `}
            >
              <span className="whitespace-pre-wrap block max-w-full break-words">{title}</span>
            </h2>

            <div
              className="mt-8 max-w-3xl whitespace-pre-wrap break-words text-lg font-light leading-8 text-stone-300 md:text-xl md:leading-9"
            >
              {text}
            </div>
          </div>

          {sideImage && (
            <div className="w-full">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                <Image
                  src={sideImage}
                  alt="Om oss bilde"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
