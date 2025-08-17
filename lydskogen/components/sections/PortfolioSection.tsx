'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PortfolioTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  spotifyUrl: string;
  spotifyEmbedId: string;
  workDescription: string;
  services: string[];
}

const portfolioTracks: PortfolioTrack[] = [
  {
    id: 'projections',
    title: 'Projections',
    artist: 'MODAN',
    albumArt: '/images/portfolio/projections-cover.jpg', // Vi kan legge til dette senere
    spotifyUrl: 'https://open.spotify.com/track/1uGZylNkCMtme6KzBXAzDu',
    spotifyEmbedId: '1uGZylNkCMtme6KzBXAzDu',
    workDescription: 'Komplett produksjon for MODAN sin "Projections" EP. Fra konsept til ferdig produkt.',
    services: ['Komposisjon', 'Miksing', 'Artwork Design', 'Mastering']
  },
  {
    id: 'album-track',
    title: 'Album Track',
    artist: 'MODAN', 
    albumArt: '/images/portfolio/album-cover.jpg', // Vi kan legge til dette senere
    spotifyUrl: 'https://open.spotify.com/track/5kNG6HZPpHdOpDLmJwzM3L',
    spotifyEmbedId: '5kNG6HZPpHdOpDLmJwzM3L',
    workDescription: 'Profesjonell miksing og mastering av MODAN albumspor med fokus på atmosfærisk sound design.',
    services: ['Miksing', 'Mastering', 'Sound Design']
  }
];

export default function PortfolioSection() {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);

  return (
    <section id="portfolio" className="py-20 bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nylige prosjekter
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Utvalgte arbeider som viser bredden i Lydskog sine tjenester - 
            fra komposisjon til ferdig masterpiece.
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {portfolioTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm overflow-hidden"
            >
              {/* Album Art Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-accent-green/20 to-emerald-600/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold text-white/20">
                    {track.artist.charAt(0)}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <motion.a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </motion.a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {track.title}
                  </h3>
                  <p className="text-accent-green font-medium">
                    {track.artist}
                  </p>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">
                  {track.workDescription}
                </p>

                {/* Services Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {track.services.map((service) => (
                    <span
                      key={service}
                      className="px-3 py-1 bg-accent-green/20 text-accent-green text-sm rounded-full border border-accent-green/30"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Spotify Embed Toggle */}
                <motion.button
                  onClick={() => setActiveTrack(activeTrack === track.id ? null : track.id)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  {activeTrack === track.id ? 'Skjul avspilling' : 'Spill av på Spotify'}
                </motion.button>

                {/* Spotify Embed */}
                {activeTrack === track.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden rounded-xl"
                  >
                    <iframe
                      src={`https://open.spotify.com/embed/track/${track.spotifyEmbedId}?utm_source=generator&theme=0`}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen={false}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-xl"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-300 mb-6 text-lg">
            Vil du ha din neste release på dette nivået?
          </p>
          <motion.button
            onClick={() => {
              const subject = 'Interessert i Lydskog sine tjenester';
              const body = `Hei!

Jeg så portfolio-eksemplene dine og er interessert i å høre mer om hvordan dere kan hjelpe med mitt prosjekt.

Mvh,
[Ditt navn]`;

              window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            className="bg-gradient-to-r from-accent-green to-green-600 hover:from-green-500 hover:to-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start ditt prosjekt med Lydskog
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}