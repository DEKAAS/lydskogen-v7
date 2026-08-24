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
      className="relative w-full overflow-hidden bg-[#f4efe4] px-5 text-[#1d241d]"
      id="om"
    >
      {bgImage && (
        <div className="absolute inset-0 z-0 h-full w-full">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover opacity-[0.08]"
            priority
          />
          <div className="absolute inset-0 bg-[#f4efe4]/85" />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl border-t border-[#d8caa8] py-16 md:py-24">
        <div className={`grid gap-8 ${sideImage ? 'lg:grid-cols-[1.1fr_0.9fr]' : ''} items-start`}>
          <div>
            <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#8a7d62]">Kort om</p>
            <h2
              className={`
                font-semibold text-[#1d241d] leading-tight tracking-tight
                ${sizeClasses[titleSize]}
                ${isMono ? 'font-mono' : 'font-sans'}
              `}
            >
              <span className="whitespace-pre-wrap block max-w-full break-words">{title}</span>
            </h2>

            <div
              className="mt-8 max-w-3xl whitespace-pre-wrap break-words text-lg font-light leading-8 text-[#4f5749] md:text-xl md:leading-9"
            >
              {text}
            </div>
          </div>

          {sideImage && (
            <div className="w-full">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.5rem] border border-[#d8caa8] bg-[#ded2ba] p-3">
                <Image
                  src={sideImage}
                  alt="Om oss bilde"
                  fill
                  className="rounded-[1.1rem] object-cover p-3"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
