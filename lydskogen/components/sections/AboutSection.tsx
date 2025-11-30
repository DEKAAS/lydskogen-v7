'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
      className="relative py-24 md:py-32 overflow-hidden min-h-[80vh] flex items-center w-full"
      id="om"
    >
      {/* Background Image with Overlay */}
      {bgImage && (
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050605]/90 via-[#050605]/60 to-[#050605]" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </div>
      )}

      <div className="container mx-auto px-6 md:px-12 max-w-[1600px] relative z-10 w-full">
        
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16 text-accent-warm/80 font-mono text-xs tracking-widest uppercase">
          <span className="w-12 h-[1px] bg-accent-warm/50"></span>
          [04] Studio — Bak Kulissene
        </div>

        <div className={`flex flex-col ${sideImage ? 'lg:flex-row' : ''} gap-16 lg:gap-24 items-start`}>
          
          {/* Text Content */}
          <div className={`flex-1 w-full ${sideImage ? 'lg:w-3/5' : 'max-w-4xl'} space-y-12`}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`
                font-bold text-white leading-tight tracking-tighter
                ${sizeClasses[titleSize]}
                ${isMono ? 'font-mono' : 'font-sans'}
              `}
            >
              <span className="whitespace-pre-wrap block max-w-full break-words">{title}</span>
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-gray-300 font-light leading-relaxed whitespace-pre-wrap break-words max-w-full"
            >
              {text}
            </motion.div>
          </div>

          {/* Side Image (Optional) */}
          {sideImage && (
            <div className="w-full lg:w-2/5">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="relative aspect-[3/4] rounded-sm overflow-hidden border border-white/10 shadow-2xl w-full"
              >
                <Image
                  src={sideImage}
                  alt="Om oss bilde"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
