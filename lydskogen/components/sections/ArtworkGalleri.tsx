'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { artworkItems } from '@/data/artwork';

export default function ArtworkGalleri() {
  const [selectedArtwork, setSelectedArtwork] = useState(0);

  // Take first 5 items for thumbnails
  const artworkThumbnails = artworkItems.slice(0, 5);

  return (
    <div className="h-full flex flex-col">
      {/* Artwork thumbnails row */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {artworkThumbnails.map((artwork, index) => (
          <motion.button
            key={artwork.id}
            onClick={() => setSelectedArtwork(index)}
            className={`aspect-square rounded-lg overflow-hidden ${
              selectedArtwork === index ? 'ring-2' : ''
            }`}
            style={{
              '--tw-ring-color': selectedArtwork === index ? 'var(--section-bg)' : 'transparent'
            } as React.CSSProperties}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover"
              style={{
                filter: selectedArtwork === index ? 'brightness(1)' : 'brightness(0.7)'
              }}
            />
          </motion.button>
        ))}
      </div>

      {/* Selected artwork display */}
      <div className="flex-1 mb-8">
        <motion.div
          className="w-full h-80 rounded-lg overflow-hidden"
          style={{
            background: 'var(--glass-card)',
            backdropFilter: 'blur(15px)',
            border: '1px solid var(--border-dark)'
          }}
          key={selectedArtwork}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={artworkThumbnails[selectedArtwork]?.imageUrl}
            alt={artworkThumbnails[selectedArtwork]?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4" style={{
            background: 'linear-gradient(transparent, rgba(66, 74, 69, 0.8))'
          }}>
            <h3 className="text-lg font-semibold" style={{color: 'var(--text-on-dark)'}}>
              {artworkThumbnails[selectedArtwork]?.title}
            </h3>
            <p className="text-sm opacity-80" style={{color: 'var(--text-on-dark)'}}>
              {artworkThumbnails[selectedArtwork]?.price} kr
            </p>
          </div>
        </motion.div>
      </div>

      {/* Info section */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm" style={{color: 'var(--text-on-dark)', opacity: 0.8}}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full" style={{background: 'var(--section-bg)'}}></div>
            <span>Gallerikort: 200</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full" style={{background: 'var(--section-bg)'}}></div>
            <span>Egendefinert: 350</span>
          </div>
        </div>
      </div>

      {/* Se galleri button */}
      <div className="flex justify-center">
        <motion.button
          className="px-6 py-3 rounded-lg font-medium"
          style={{
            background: 'var(--glass-section)',
            color: 'var(--text-on-dark)',
            border: '1px solid var(--border-light)'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Se galleri
        </motion.button>
      </div>
    </div>
  );
}