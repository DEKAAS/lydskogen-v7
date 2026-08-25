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
  const legacyImages = [content['about_side_image'], content['about_bg_image']].filter(Boolean);
  const configuredImages = Array.from(
    { length: 6 },
    (_, index) => content[`about_gallery_${index + 1}`]
  ).filter(Boolean);
  const aboutImages = configuredImages.length > 0
    ? configuredImages
    : Array.from(new Set(legacyImages));
  
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
      <div className="relative z-10 mx-auto w-full max-w-6xl border-t border-[#d8caa8] py-16 md:py-24">
        <div className={`grid gap-10 ${aboutImages.length > 0 ? 'lg:grid-cols-[0.9fr_1.1fr]' : ''} items-start`}>
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

          {aboutImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {aboutImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={`relative overflow-hidden rounded-[1.25rem] border border-[#d8caa8] bg-[#ded2ba] ${
                    aboutImages.length === 1
                      ? 'col-span-2 aspect-[4/3]'
                      : index === 0 && aboutImages.length % 2 === 1
                        ? 'col-span-2 aspect-[16/9]'
                        : 'aspect-square'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Om Lydskog ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 30vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
