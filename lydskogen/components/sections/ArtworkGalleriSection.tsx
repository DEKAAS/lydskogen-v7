'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArtworkGalleriSection() {
  const [selectedArtwork, setSelectedArtwork] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const artworks = [
    {
      id: 0,
      image: '/images/artwork/10_Natura_2.png',
      title: 'Natura Essence',
      description:
        'Organiske former og naturinspirerte teksturer som fanger essensen av vill natur. Perfekt for ambient og naturinspirert musikk.',
      price: 200
    },
    {
      id: 1,
      image: '/images/artwork/26_Natura_4.png',
      title: 'Natura Flow',
      description:
        'Flytende bevegelser som speiler naturens rytmer og sykluser. Ideell for lo-fi og avslappende musikk.',
      price: 200
    },
    {
      id: 2,
      image: '/images/artwork/29_Natura.png',
      title: 'Natura Harmony',
      description:
        'Harmoniske komposisjoner inspirert av naturens balanse. Passer perfekt for ambient og soundscape.',
      price: 200
    },
    {
      id: 3,
      image: '/images/artwork/31_Natura.png',
      title: 'Natura Spirit',
      description:
        'Spirituelle uttrykk gjennom naturens kraft og skjønnhet. Ideell for meditativ og transcendental musikk.',
      price: 200
    },
    {
      id: 4,
      image: '/images/artwork/34_Natura_1.png',
      title: 'Natura Dreams',
      description:
        'Drømmeaktige scener som vekker indre naturbilder. Perfekt for ambient og eterisk uttrykk.',
      price: 200
    }
  ];

  const openPopup = (index: number) => {
    setSelectedArtwork(index);
    setIsPopupOpen(true);
  };

  const closePopup = () => setIsPopupOpen(false);
  const nextImage = () => setSelectedArtwork((prev) => (prev + 1) % artworks.length);
  const prevImage = () => setSelectedArtwork((prev) => (prev - 1 + artworks.length) % artworks.length);
  const handlePurchase = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: `Artwork – ${artworks[selectedArtwork].title}`,
          genre: 'Artwork',
          amount: 20000
        })
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch {}
  };

  return (
    <>
    <section id="artwork" className="py-20" style={{backgroundColor: 'var(--primary-bg)'}}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block p-3 mb-6"
            style={{
              background: 'var(--glass-section)',
              backdropFilter: 'blur(15px)',
              border: '1px solid var(--border-light)',
              borderRadius: '16px'
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-5xl">🎨</div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'var(--text-on-dark)'}}>
            Artwork galleri
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>
            Kreative visuelle uttrykk og kunstneriske design
          </p>
        </motion.div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {/* Main artwork display */}
          <div className="mb-8">
            <motion.div
              className="w-full h-96 rounded-xl overflow-hidden cursor-pointer"
              style={{
                background: 'var(--glass-card)',
                backdropFilter: 'blur(15px)',
                border: '1px solid var(--border-dark)'
              }}
              key={selectedArtwork}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => openPopup(selectedArtwork)}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={artworks[selectedArtwork].image}
                alt={artworks[selectedArtwork].title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Thumbnail grid */}
          <div className="grid grid-cols-5 gap-4 mb-12">
            {artworks.map((artwork, index) => (
              <motion.button
                key={artwork.id}
                onClick={() => setSelectedArtwork(index)}
                className={`aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                  selectedArtwork === index ? 'ring-2' : ''
                }`}
                style={{
                  background: 'var(--glass-card)',
                  backdropFilter: 'blur(15px)',
                  border: `2px solid ${selectedArtwork === index ? 'var(--section-bg)' : 'var(--border-dark)'}`,
                  '--tw-ring-color': 'var(--section-bg)'
                } as React.CSSProperties}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  onClick={() => openPopup(index)}
                />
              </motion.button>
            ))}
          </div>

          {/* Navigation dots */}
          <motion.div 
            className="flex justify-center space-x-3 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-opacity duration-300 ${i === selectedArtwork ? 'opacity-100' : 'opacity-40'}`}
                style={{background: 'var(--section-bg)'}}
              />
            ))}
          </motion.div>

          {/* Service button */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="px-8 py-4 rounded-xl font-medium text-lg"
              style={{
                background: 'var(--glass-section)',
                color: 'var(--text-on-dark)',
                border: '1px solid var(--border-light)',
                boxShadow: '0 4px 16px 0 rgba(207, 197, 176, 0.2)'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 24px 0 rgba(207, 197, 176, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              se tjeneste
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Popup Gallery */}
    <AnimatePresence>
      {isPopupOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePopup}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Popup Content */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Lukk"
            >
              ✕
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Forrige bilde"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Neste bilde"
            >
              ›
            </button>

            {/* Image */}
            <div className="relative h-96 md:h-[500px]">
              <img
                src={artworks[selectedArtwork].image}
                alt={artworks[selectedArtwork].title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Panel */}
            <div className="bg-white/10 backdrop-blur-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {artworks[selectedArtwork].title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {artworks[selectedArtwork].description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-accent-green">
                      {artworks[selectedArtwork].price} kr
                    </span>
                    <span className="text-sm text-gray-400">
                      {selectedArtwork + 1} av {artworks.length}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handlePurchase}
                    className="px-6 py-3 bg-accent-green text-black font-semibold rounded-lg hover:bg-accent-green/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Kjøp ferdig laget
                  </motion.button>
                  <motion.button
                    className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Kontakt oss
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}