'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { artworkItems } from '@/data/artwork';
import { ArtworkItem } from '@/types/services';

interface GalleryGridProps {
  selectedCategory?: string;
  onItemClick?: (item: ArtworkItem) => void;
  artworkItems?: ArtworkItem[];
  showAll?: boolean;
}

interface ArtworkCardProps {
  item: ArtworkItem;
  index: number;
  onClick: (item: ArtworkItem) => void;
}

// Create placeholder image with SVG
const createPlaceholder = (title: string, index: number = 0) => {
  const colors = ['#26244F', '#1F4036', '#3C1F1F', '#3C2B4F'];
  const color = colors[index % colors.length];
  
  try {
    const svgContent = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.6" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad${index})"/>
      <rect x="40" y="40" width="320" height="240" fill="none" stroke="#10b981" stroke-width="2" opacity="0.6"/>
      <text x="200" y="180" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.8">
        ${title}
      </text>
      <circle cx="200" cy="220" r="20" fill="none" stroke="#10b981" stroke-width="2" opacity="0.4"/>
      <polygon points="195,210 195,230 210,220" fill="#10b981" opacity="0.6"/>
    </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  } catch (error) {
    console.error('Error creating placeholder:', error);
    // Fallback to simple colored div
    return `data:image/svg+xml;utf8,<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/><text x="200" y="200" font-family="Arial" font-size="16" fill="white" text-anchor="middle">${title}</text></svg>`;
  }
};

function ArtworkCard({ item, index, onClick }: ArtworkCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.02
      }
    }
  };


  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -8,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      className="group cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="relative overflow-hidden rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl" style={{
        background: 'var(--glass-card)',
        backdropFilter: 'blur(15px)',
        border: '1px solid var(--border-dark)',
        boxShadow: '0 10px 28px rgba(0,0,0,0.28)'
      }}>
        
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          
          {/* Simple Image with fallback */}
          <img
            src={item.imageUrl || createPlaceholder(item.title, index)}
            alt={item.title}
            className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: 'center' }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const target = e.currentTarget;
              target.src = createPlaceholder(item.title, index);
              setImageLoaded(true);
            }}
          />
          
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Category/New/Sold Badge */}
          <div className="absolute top-3 left-3">
            {item.status === 'sold' ? (
              <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(220,38,38,0.25)', color: '#fecaca', border: '1px solid rgba(220,38,38,0.45)' }}>
                Solgt
              </span>
            ) : item.isNew ? (
              <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(219,186,54,0.2)', color: 'var(--accent-gold)', border: '1px solid rgba(219,186,54,0.45)' }}>
                Nyhet
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                background: item.category === 'custom' ? 'var(--glass-section)' : 'var(--glass-card)',
                color: 'var(--text-on-dark)',
                border: '1px solid var(--border-light)'
              }}>
                {item.category === 'custom' ? 'Skreddersydd' : 'Galleri'}
              </span>
            )}
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-sm font-semibold" style={{
              background: 'var(--glass-section)',
              color: 'var(--text-on-dark)',
              border: '1px solid var(--border-light)'
            }}>
              {item.price} kr
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Hover CTA */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <button className="w-full font-semibold py-2 px-4 rounded-lg transition-colors duration-300" style={{
              background: 'var(--glass-section)',
              color: 'var(--text-on-dark)',
              border: '1px solid var(--border-light)'
            }}>
              Vis mer
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-semibold mb-2 transition-colors duration-300" style={{color: 'var(--text-on-dark)'}}>
            {item.title}
          </h3>
          
          <p className="text-sm mb-3 line-clamp-2" style={{color: 'var(--text-on-dark)', opacity: 0.8}}>
            {item.description}
          </p>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 text-xs rounded"
                  style={{
                    background: 'var(--glass-section)',
                    color: 'var(--text-on-dark)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="px-2 py-1 text-xs" style={{color: 'var(--text-on-dark)', opacity: 0.6}}>
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Selection Indicator */}
        <div className="absolute inset-0 border-2 border-accent-green opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
      </div>
    </motion.div>
  );
}

export default function GalleryGrid({ selectedCategory = 'all', onItemClick, artworkItems: propArtworkItems, showAll = false }: GalleryGridProps) {
  const [lightboxItem, setLightboxItem] = useState<ArtworkItem | null>(null);
  const [lightboxItems, setLightboxItems] = useState<ArtworkItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  // Center into view when opened
  useEffect(() => {
    if (!lightboxItem) return
    const el = document.querySelector('[data-lightbox-root]') as HTMLElement | null
    el?.focus()
  }, [lightboxItem])

  // Use provided artwork items or fallback to default
  const itemsToUse = propArtworkItems || artworkItems;
  
  // Filter items based on selected category
  const filteredItems = selectedCategory === 'all' 
    ? itemsToUse 
    : itemsToUse.filter(item => item.category === selectedCategory);
  

  const handleItemClick = (item: ArtworkItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      const currentItems = filteredItems;
      setLightboxItems(currentItems);
      const idx = currentItems.findIndex(i => i.id === item.id);
      setLightboxIndex(idx >= 0 ? idx : 0);
      setLightboxItem(item);
    }
  };

  const closeLightbox = () => setLightboxItem(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.02
      }
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={showAll ? "all" : "limited"}
      >
        {filteredItems.map((item, index) => (
          <ArtworkCard
            key={item.id}
            item={item}
            index={index}
            onClick={handleItemClick}
          />
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Ingen artwork funnet
          </h3>
          <p className="text-gray-400">
            Prøv å velge en annen kategori eller kontakt oss for skreddersydd design
          </p>
        </motion.div>
      )}

      {/* Simple Lightbox Modal with arrows and ESC */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeLightbox()
              if (e.key === 'ArrowLeft') {
                e.preventDefault()
                setLightboxIndex((prev) => {
                  const next = (prev - 1 + lightboxItems.length) % lightboxItems.length
                  setLightboxItem(lightboxItems[next])
                  return next
                })
              }
              if (e.key === 'ArrowRight') {
                e.preventDefault()
                setLightboxIndex((prev) => {
                  const next = (prev + 1) % lightboxItems.length
                  setLightboxItem(lightboxItems[next])
                  return next
                })
              }
            }}
            tabIndex={0}
            data-lightbox-root
          >
            <motion.div
              className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-base-dark rounded-2xl border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Lukk"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Arrows */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((prev) => {
                      const next = (prev - 1 + lightboxItems.length) % lightboxItems.length
                      setLightboxItem(lightboxItems[next])
                      return next
                    })
                  }}
                  className="pointer-events-auto w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                  aria-label="Forrige"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((prev) => {
                      const next = (prev + 1) % lightboxItems.length
                      setLightboxItem(lightboxItems[next])
                      return next
                    })
                  }}
                  className="pointer-events-auto w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                  aria-label="Neste"
                >
                  ›
                </button>
              </div>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="min-h-[400px] md:min-h-[500px] bg-gray-900 flex items-center justify-center p-6">
                  <img
                    src={lightboxItem.imageUrl || createPlaceholder(lightboxItem.title, 0)}
                    alt={lightboxItem.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>

                {/* Details */}
                <div className="p-8 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {lightboxItem.title}
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    {lightboxItem.description}
                  </p>

                  <div className="text-2xl font-bold mb-6" style={{ color: 'var(--accent-gold)' }}>
                    {lightboxItem.price} kr
                  </div>

                  {/* Tags */}
                  {lightboxItem.tags && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {lightboxItem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-lg border border-white/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Order Button */}
                  <button
                    onClick={() => {
                      const subject = `Bestilling av artwork: ${lightboxItem.title}`;
                      const body = `Hei Lydskog!

Jeg vil gjerne bestille følgende artwork:

Tittel: ${lightboxItem.title}
Pris: ${lightboxItem.price} kr
Beskrivelse: ${lightboxItem.description}

Kan dere kontakte meg for å gjennomføre bestillingen?

Mvh,
[Ditt navn]`;

                      window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    }}
                    className="w-full font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
                    style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}
                  >
                    Bestill artwork
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 