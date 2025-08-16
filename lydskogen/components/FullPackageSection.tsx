'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FullPackageOption } from '@/types/services';

const packageOptions: FullPackageOption[] = [
  {
    id: 'production',
    title: 'Musikkproduksjon',
    description: 'Profesjonell produksjon i ambient, hip-hop, lo-fi eller soundscape',
    basePrice: 800,
    isSelected: false,
    category: 'production'
  },
  {
    id: 'mixing',
    title: 'Miksing & Mastering',
    description: 'Profesjonell behandling av dine opptak med EQ, kompresjon og mastering',
    basePrice: 400,
    isSelected: false,
    category: 'mixing'
  },
  {
    id: 'artwork',
    title: 'Visuell Design',
    description: 'Skreddersydd artwork og visuell identitet for ditt prosjekt',
    basePrice: 350,
    isSelected: false,
    category: 'design'
  },
  {
    id: 'artistpage',
    title: 'Artistside',
    description: 'Profesjonell nettside med hosting og domene inkludert',
    basePrice: 700,
    isSelected: false,
    category: 'artistpage'
  }
];

export default function FullPackageSection() {
  const [selectedOptions, setSelectedOptions] = useState<FullPackageOption[]>([]);

  const toggleOption = (optionId: string) => {
    const option = packageOptions.find(opt => opt.id === optionId);
    if (!option) return;

    const isCurrentlySelected = selectedOptions.some(opt => opt.id === optionId);
    
    if (isCurrentlySelected) {
      setSelectedOptions(prev => prev.filter(opt => opt.id !== optionId));
    } else {
      setSelectedOptions(prev => [...prev, { ...option, isSelected: true }]);
    }
  };

  const totalPrice = selectedOptions.reduce((sum, option) => sum + option.basePrice, 0);
  const discountPercentage = selectedOptions.length >= 3 ? 15 : selectedOptions.length >= 2 ? 10 : 0;
  const discountAmount = (totalPrice * discountPercentage) / 100;
  const finalPrice = totalPrice - discountAmount;

  const generateContactEmail = () => {
    const subject = 'Forespørsel om Fullpakke-tjenester';
    const services = selectedOptions.map(opt => `- ${opt.title} (${opt.basePrice} kr)`).join('\n');
    const body = `Hei Lydskog!

Jeg er interessert i følgende tjenester:

${services}

Totalpris: ${totalPrice} kr
${discountPercentage > 0 ? `Rabatt (${discountPercentage}%): -${discountAmount} kr\nSluttsum: ${finalPrice} kr` : ''}

Kan vi snakke om prosjektet mitt?

Mvh,
[Ditt navn]`;

    window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-base-dark">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Fullpakke-tjenester
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Kombiner flere tjenester og få rabatt! Velg de tjenestene du trenger for ditt prosjekt.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Card - Service Selection */}
            <motion.div
              className="bg-gradient-to-br from-secondary-dark to-base-dark rounded-2xl p-8 border border-white/10"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Velg tjenester</h3>
              
              <div className="space-y-4">
                {packageOptions.map((option) => {
                  const isSelected = selectedOptions.some(opt => opt.id === option.id);
                  
                  return (
                    <motion.div
                      key={option.id}
                      variants={cardVariants}
                      className="relative"
                    >
                      <motion.button
                        onClick={() => toggleOption(option.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                          isSelected 
                            ? 'border-accent-green bg-accent-green/10 shadow-lg shadow-accent-green/20' 
                            : 'border-white/20 hover:border-accent-green/50 hover:bg-white/5'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-white mb-1">
                              {option.title}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {option.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-semibold text-accent-green">
                              {option.basePrice} kr
                            </span>
                            
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              isSelected 
                                ? 'border-accent-green bg-accent-green' 
                                : 'border-gray-400'
                            }`}>
                              {isSelected && (
                                <motion.svg
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </motion.svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {selectedOptions.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-accent-green/10 rounded-lg border border-accent-green/30"
                >
                  <p className="text-accent-green text-sm font-medium">
                    🎉 Rabatt aktivert! {discountPercentage}% rabatt på totalsummen
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Right Card - Summary */}
            <motion.div
              className="bg-gradient-to-br from-base-dark to-secondary-dark rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Ditt valg</h3>
              
              <AnimatePresence mode="wait">
                {selectedOptions.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-gray-400">
                      Velg tjenester fra listen til venstre for å se sammendrag og totalpris
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="space-y-4 mb-6">
                      {selectedOptions.map((option, index) => (
                        <motion.div
                          key={option.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                        >
                          <span className="text-white font-medium">{option.title}</span>
                          <span className="text-accent-green">{option.basePrice} kr</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t border-white/20 pt-4 space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal:</span>
                        <span>{totalPrice} kr</span>
                      </div>
                      
                      {discountPercentage > 0 && (
                        <div className="flex justify-between text-accent-green">
                          <span>Rabatt ({discountPercentage}%):</span>
                          <span>-{discountAmount} kr</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-xl font-bold text-white border-t border-white/20 pt-2">
                        <span>Total:</span>
                        <span>{finalPrice} kr</span>
                      </div>
                    </div>

                    <motion.button
                      onClick={generateContactEmail}
                      className="w-full mt-8 bg-accent-green hover:bg-green-500 text-base-dark font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                      whileTap={{ scale: 0.95 }}
                    >
                      Kontakt for tilbud
                    </motion.button>

                    <p className="text-xs text-gray-400 mt-4 text-center">
                      Vi sender deg et skreddersydd tilbud basert på dine valg
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <AnimatePresence>
          {selectedOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="lg:hidden fixed bottom-4 left-4 right-4 z-50"
            >
              <motion.button
                onClick={generateContactEmail}
                className="w-full bg-accent-green text-base-dark font-semibold py-4 px-6 rounded-xl shadow-lg"
                whileTap={{ scale: 0.95 }}
              >
                Kontakt for tilbud • {finalPrice} kr
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
} 