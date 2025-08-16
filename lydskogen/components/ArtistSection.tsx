'use client';

import { motion } from 'framer-motion';
import ArtistExampleCards from './ArtistExampleCards';
import ArtistPricingPlans from './ArtistPricingPlans';
import AnimatedAccordion from './AnimatedAccordion';

export default function ArtistSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block p-3 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-5xl">🎤</div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent mb-6">
            Artistside
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Få din egen profesjonelle artistside og bygg ditt digitale artistbrand med våre skreddersydde løsninger
          </p>

          {/* Key Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30 rounded-xl p-6"
              variants={sectionVariants}
            >
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold text-white mb-2">Rask oppstart</h3>
              <p className="text-gray-400 text-sm">Setup på kun 3-5 dager med alt du trenger</p>
            </motion.div>
            
            <motion.div
              className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30 rounded-xl p-6"
              variants={sectionVariants}
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Komplett analytics</h3>
              <p className="text-gray-400 text-sm">Detaljert innsikt i lyttere og performance</p>
            </motion.div>
            
            <motion.div
              className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30 rounded-xl p-6"
              variants={sectionVariants}
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">Ingen binding</h3>
              <p className="text-gray-400 text-sm">Full fleksibilitet og kontroll over din musikk</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-32"
        >
          {/* Artist Examples Section */}
          <motion.div variants={sectionVariants}>
            <ArtistExampleCards />
          </motion.div>

          {/* Pricing Plans Section */}
          <motion.div variants={sectionVariants}>
            <ArtistPricingPlans />
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={sectionVariants}>
            <AnimatedAccordion />
          </motion.div>

          {/* Final CTA Section */}
          <motion.div 
            variants={sectionVariants}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-6">
                Klar til å ta steget?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Bli med i vår voksende familie av artister som har bygget suksessfulle digitale karrierer
              </p>

              {/* Success Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-green mb-2">150+</div>
                  <div className="text-gray-400">Streaming plattformer</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                  <div className="text-gray-400">Musikk tilgjengelighet</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-400 mb-2">3-5</div>
                  <div className="text-gray-400">Dager til oppstart</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => {
                    const subject = 'Kom i gang med artistside i dag!';
                    const body = `Hei Lydskog!

Jeg vil gjerne starte med å bygge min artistside og digitale tilstedeværelse.

Kan vi sette opp en samtale for å diskutere mine behov og hvilken plan som passer best?

Mvh,
[Ditt navn]`;

                    window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                  className="bg-gradient-to-r from-accent-green to-green-600 hover:from-green-500 hover:to-green-600 text-base-dark font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start din artistreise
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    const subject = 'Konsultasjon om artistside - gratis samtale';
                    const body = `Hei Lydskog!

Jeg vil gjerne ha en gratis konsultasjon for å forstå hvordan en artistside kan hjelpe mitt musikkprosjekt.

Kan vi sette opp en uforpliktende samtale?

Mvh,
[Ditt navn]`;

                    window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-purple-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book gratis konsultasjon
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 