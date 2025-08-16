'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GalleryGrid from './GalleryGrid';
import { artworkCategories } from '@/data/artwork';

export default function ArtworkSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="relative py-20" style={{backgroundColor: 'var(--primary-bg)'}}>
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--section-bg) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
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
            Portfolio
          </h2>
          
          <p className="text-xl max-w-3xl mx-auto mb-8" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>
            Våre Natura-kolleksjon - organiske kunstuttrykk som fanger naturens essens og kraft
          </p>

          {/* Pricing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <motion.div
              className="p-6 rounded-xl"
              style={{
                background: 'var(--glass-card)',
                backdropFilter: 'blur(15px)',
                border: '1px solid var(--border-dark)'
              }}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--text-on-dark)'}}>Galleri Design</h3>
              <div className="text-2xl font-bold mb-2" style={{color: 'var(--section-bg)'}}>200-300 kr</div>
              <p className="text-sm" style={{color: 'var(--text-on-dark)', opacity: 0.8}}>Ferdiglagde Natura-designs klare for bruk</p>
            </motion.div>
            
            <motion.div
              className="p-6 rounded-xl"
              style={{
                background: 'var(--glass-card)',
                backdropFilter: 'blur(15px)',
                border: '1px solid var(--border-dark)'
              }}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--text-on-dark)'}}>Skreddersydd</h3>
              <div className="text-2xl font-bold mb-2" style={{color: 'var(--section-bg)'}}>Fra 350 kr</div>
              <p className="text-sm" style={{color: 'var(--text-on-dark)', opacity: 0.8}}>Unike designs basert på ditt prosjekt</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          className="flex justify-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-flex p-1 rounded-xl" style={{
            background: 'var(--glass-card)',
            backdropFilter: 'blur(15px)',
            border: '1px solid var(--border-dark)'
          }}>
            {artworkCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.id ? 'selected-category' : 'unselected-category'
                }`}
                style={selectedCategory === category.id ? {
                  background: 'var(--glass-section)',
                  color: 'var(--text-on-dark)',
                  boxShadow: '0 4px 16px 0 rgba(207, 197, 176, 0.2)'
                } : {
                  color: 'var(--text-on-dark)',
                  opacity: 0.7
                }}
                variants={itemVariants}
                whileHover={{ scale: 1.05, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
                {category.count > 0 && (
                  <span className="ml-2 px-2 py-1 rounded-full text-xs" style={{
                    background: 'var(--glass-section)',
                    color: 'var(--text-on-dark)'
                  }}>
                    {category.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <GalleryGrid selectedCategory={selectedCategory} />

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--text-on-dark)'}}>
            Trenger du noe unikt?
          </h3>
          <p className="mb-8 max-w-2xl mx-auto" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>
            Vi lager skreddersydde designs som perfekt matcher din musikk og visjon. 
            Kontakt oss for å diskutere ditt prosjekt.
          </p>
          
            <motion.button
            onClick={() => {
              const subject = 'Forespørsel om skreddersydd artwork design';
              const body = `Hei Lydskog!

Jeg vil gjerne diskutere et skreddersydd artwork design for mitt prosjekt.

Prosjekttype: [Beskriv ditt musikkprosjekt]
Stil/genre: [F.eks. ambient, hip-hop, etc.]
Ønsket stemning: [Beskriv følelsen du vil formidle]
Spesielle ønsker: [Farger, elementer, osv.]

Ser frem til å høre fra dere!

Mvh,
[Ditt navn]`;

              window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            className="font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform"
            style={{
              background: 'var(--glass-section)',
              backdropFilter: 'blur(15px)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-on-dark)'
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            Bestill skreddersydd design
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 