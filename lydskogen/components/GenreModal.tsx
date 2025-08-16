'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Genre } from '../data/genres';
import AudioPlayer from './AudioPlayer';
import { useState } from 'react';

interface GenreModalProps {
  genre: Genre | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GenreModal({ genre, isOpen, onClose }: GenreModalProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    projectType: ''
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Her kan du implementere faktisk booking-logikk (email/API)
    console.log('Booking submitted:', { genre: genre?.title, ...bookingData });
    alert('Takk for henvendelsen! Vi kontakter deg snart.');
    setShowBooking(false);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  if (!genre) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-base-dark border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`relative p-6 ${genre.bgClass}`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
              
              <h2 className="text-3xl font-bold text-white mb-2">{genre.title}</h2>
              <p className="text-white/80 text-lg">{genre.shortDescription}</p>
              
              <div 
                className="w-12 h-1 rounded-full mt-4"
                style={{ backgroundColor: genre.accentColor }}
              />
            </div>

            <div className="p-6">
              {!showBooking ? (
                <>
                  {/* Beskrivelse */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Om sjangeren</h3>
                    <div className="space-y-4">
                      {genre.description.map((paragraph, index) => (
                        <p key={index} className="text-gray-300 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Karakteristikker */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Karakteristikker</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {genre.characteristics.map((characteristic, index) => (
                        <div key={index} className="flex items-center text-gray-300">
                          <span 
                            className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                            style={{ backgroundColor: genre.accentColor }}
                          />
                          {characteristic}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lytteprøver */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Lytteprøver</h3>
                    <div className="space-y-4">
                      {genre.audioExamples.map((example, index) => (
                        <div key={index} className="bg-secondary-dark rounded-lg p-4">
                          <h4 className="text-white font-medium mb-2">{example.title}</h4>
                          <AudioPlayer
                            src={example.src}
                            title={example.title}
                            duration={example.duration}
                            accentColor={genre.accentColor}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pris og Booking */}
                  <div className="bg-secondary-dark rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Pris</h3>
                        <p className="text-gray-300 mb-2">
                          Fra <span className="text-2xl font-bold" style={{ color: genre.accentColor }}>
                            {genre.pricing.basic.toLocaleString('no-NO')} kr
                          </span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Endelig pris avhenger av prosjektets kompleksitet og krav
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setShowBooking(true)}
                        className="bg-accent-green hover:bg-accent-green/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Book {genre.title}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Booking Form */
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">
                      Book {genre.title} produksjon
                    </h3>
                    <button
                      onClick={() => setShowBooking(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Tilbake
                    </button>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Navn *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={bookingData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                          placeholder="Ditt navn"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          E-post *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={bookingData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                          placeholder="din@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={bookingData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                          placeholder="Ditt telefonnummer"
                        />
                      </div>

                      <div>
                        <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
                          Prosjekttype
                        </label>
                        <input
                          type="text"
                          id="projectType"
                          name="projectType"
                          value={bookingData.projectType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green"
                          placeholder="F.eks. single, album, film, etc."
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Melding *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={bookingData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-secondary-dark border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-green resize-none"
                        placeholder="Beskriv ditt prosjekt, deadline, budsjett og andre relevante detaljer..."
                      />
                    </div>

                    <div className="bg-secondary-dark rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Valgt sjanger: {genre.title}</p>
                          <p className="text-sm text-gray-400">
                            Startpris: {genre.pricing.basic.toLocaleString('no-NO')} kr
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-accent-green hover:bg-accent-green/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Send henvendelse
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBooking(false)}
                        className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                      >
                        Avbryt
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}