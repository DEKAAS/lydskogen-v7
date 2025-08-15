'use client';

import { motion } from 'framer-motion';
// Removed page navigation; this grid is used inline on the homepage
import Image from 'next/image';
import { useState } from 'react';
import { genreData, Genre } from '../data/genres';
import { useEffect } from 'react';
import GenreModal from './GenreModal';
import InlineGenrePanel from './InlineGenrePanel';

export default function GenreGrid() {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inlineGenre, setInlineGenre] = useState<Genre | null>(null);
  const [inlineIndex, setInlineIndex] = useState<number>(-1);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [demos, setDemos] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load overrides if any
    fetch('/api/genres/overrides').then(r => r.json()).then(d => {
      setThumbs((d.overrides?.thumbnails) || {})
      setDemos((d.overrides?.demos) || {})
    }).catch(()=>{})
  }, [])

  const handleLearnMore = (genre: Genre, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedGenre(genre);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGenre(null);
  };

  const handleInlineOpen = (genre: Genre, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInlineGenre((current) => (current?.id === genre.id ? null : genre));
    const index = genreData.findIndex((g) => g.id === genre.id);
    setInlineIndex(index);
    // Ensure the panel comes into view on open
    setTimeout(() => {
      const el = document.getElementById('inline-genre-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const goPrev = () => {
    if (inlineIndex < 0) return;
    const prevIndex = (inlineIndex - 1 + genreData.length) % genreData.length;
    setInlineIndex(prevIndex);
    setInlineGenre(genreData[prevIndex]);
  };

  const goNext = () => {
    if (inlineIndex < 0) return;
    const nextIndex = (inlineIndex + 1) % genreData.length;
    setInlineIndex(nextIndex);
    setInlineGenre(genreData[nextIndex]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {genreData.map((genre, idx) => (
        <motion.div
          key={genre.id}
          variants={cardVariants}
          whileHover={{ y: -5 }}
          className="group h-full"
        >
          <div className={`relative overflow-hidden rounded-lg ${genre.cardBgClass} border border-white/10 backdrop-blur-sm transition-shadow duration-300 group-hover:border-white/20 h-full flex flex-col`}
               style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.28)' }}>
              {/* Background Image */}
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={thumbs[genre.slug] || genre.adminThumbnailImage || genre.thumbnailImage}
                  alt={genre.title}
                  fill
                className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Demo mini player */}
                {demos[genre.slug] && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <audio src={demos[genre.slug]} controls preload="metadata" className="w-full h-8 opacity-90" />
                  </div>
                )}
                
                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {genre.title}
                  </h3>
                  <div 
                    className="w-8 h-1 rounded-full"
                    style={{ backgroundColor: genre.accentColor }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col h-full">
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {genre.shortDescription}
                </p>

                {/* Primær handling */}
                <div className="grid grid-cols-1 mt-auto">
                  <button
                    onClick={(e) => handleInlineOpen(genre, e)}
                    className="w-full py-2.5 px-4 rounded-lg text-black text-sm font-semibold transition-all duration-200 cursor-pointer hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(219,186,54,0.95), rgba(219,186,54,0.8))',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.25)'
                    }}
                  >
                    Book {genre.title}
                  </button>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
        </motion.div>
      ))}
    </motion.div>

    {/* Full-width inline panel below the grid */}
    {inlineGenre && (
      <div id="inline-genre-panel" className="w-full mt-4">
        <InlineGenrePanel 
          genre={inlineGenre} 
          onClose={() => setInlineGenre(null)}
          onPrev={goPrev}
          onNext={goNext}
          currentIndex={inlineIndex}
          total={genreData.length}
        />
      </div>
    )}

    {/* Keep modal available if you still want deep details */}
    <GenreModal
      genre={selectedGenre}
      isOpen={isModalOpen}
      onClose={closeModal}
    />
    </>
  );
} 