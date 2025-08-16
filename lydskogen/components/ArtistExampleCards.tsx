'use client';

import { motion } from 'framer-motion';
import { artistExamples, ArtistExample } from '@/data/artists';

interface ArtistCardProps {
  artist: ArtistExample;
  index: number;
}

function ArtistCard({ artist, index }: ArtistCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1
      }
    }
  };

  // Create placeholder image with SVG for artist cards
  const createArtistPlaceholder = (name: string, genre: string) => {
    const colors = ['#3C2B4F', '#5C3D78', '#4A2F5E', '#6B4586'];
    const color = colors[index % colors.length];
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="artistGrad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.6" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#artistGrad${index})"/>
        <circle cx="200" cy="150" r="60" fill="none" stroke="#10b981" stroke-width="3" opacity="0.6"/>
        <circle cx="180" cy="135" r="8" fill="#10b981" opacity="0.8"/>
        <circle cx="220" cy="135" r="8" fill="#10b981" opacity="0.8"/>
        <path d="M 170 180 Q 200 200 230 180" stroke="#10b981" stroke-width="3" fill="none" opacity="0.8"/>
        <text x="200" y="280" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">
          ${name}
        </text>
        <text x="200" y="310" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" opacity="0.8">
          ${genre}
        </text>
      </svg>
    `)}`;
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
    >
      <div className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-purple-700/10 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-400/50 group-hover:shadow-xl group-hover:shadow-purple-500/20">
        
        {/* Artist Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={createArtistPlaceholder(artist.name, artist.genre)}
            alt={artist.name}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = createArtistPlaceholder(artist.name, artist.genre);
            }}
          />
          
          {/* Package Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              artist.package === 'pro' 
                ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
            }`}>
              {artist.package === 'pro' ? 'PRO' : 'BASIC'}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Hover CTA */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
              Vis mer
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-xl text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
            {artist.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-300 font-medium">{artist.genre}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400 text-sm">{artist.style}</span>
          </div>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {artist.description}
          </p>

          {/* Website */}
          {artist.website && (
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="text-purple-300 text-sm">{artist.website}</span>
            </div>
          )}

          {/* Features Preview */}
          <div className="space-y-1">
            {artist.features.slice(0, 2).map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center gap-2">
                <svg className="w-3 h-3 text-accent-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300 text-xs">{feature}</span>
              </div>
            ))}
            {artist.features.length > 2 && (
              <div className="text-purple-400 text-xs">
                +{artist.features.length - 2} flere features
              </div>
            )}
          </div>
        </div>

        {/* Selection Indicator */}
        <div className="absolute inset-0 border-2 border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
      </div>
    </motion.div>
  );
}

export default function ArtistExampleCards() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="relative z-10">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Møt våre artister
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Se hvordan vi hjelper artister med å bygge sin digitale tilstedeværelse og nå nye lyttere
        </p>
      </motion.div>

      {/* Artist Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {artistExamples.map((artist, index) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            index={index}
          />
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-bold text-white mb-4">
          Klar til å bli neste success story?
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Få din egen profesjonelle artistside og start bygge ditt digitale artistbrand i dag
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={() => {
              const subject = 'Interessert i artistside - Basic pakke';
              const body = `Hei Lydskog!

Jeg vil gjerne høre mer om artist-tjenestene deres, spesielt Basic-pakken.

Kan dere kontakte meg for å diskutere mulighetene?

Mvh,
[Ditt navn]`;

              window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Kom i gang med Basic
          </motion.button>
          
          <motion.button
            onClick={() => {
              const subject = 'Interessert i artistside - Pro pakke';
              const body = `Hei Lydskog!

Jeg vil gjerne høre mer om Pro-pakken for artister og hvordan den kan hjelpe meg med å bygge mitt artistbrand.

Kan vi sette opp en konsultasjon for å diskutere mine behov?

Mvh,
[Ditt navn]`;

              window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            className="bg-gradient-to-r from-accent-green to-green-600 hover:from-green-500 hover:to-green-600 text-base-dark font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Oppgrader til Pro
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 