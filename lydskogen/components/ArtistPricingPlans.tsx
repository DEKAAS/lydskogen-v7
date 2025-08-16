'use client';

import { motion } from 'framer-motion';
import { artistPricingPlans } from '@/data/artists';

interface PricingCardProps {
  plan: typeof artistPricingPlans[0];
  index: number;
}

function PricingCard({ plan, index }: PricingCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.2
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
        plan.popular
          ? 'border-accent-green/50 bg-gradient-to-br from-accent-green/10 to-purple-900/20 shadow-xl shadow-accent-green/20'
          : 'border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-purple-700/10 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/20'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-0">
          <div className="bg-gradient-to-r from-accent-green to-green-600 text-base-dark px-4 py-1 rounded-b-lg text-sm font-semibold">
            MEST POPULÆR
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Plan Header */}
        <div className="text-center mb-8">
          <h3 className={`text-2xl font-bold mb-2 ${
            plan.popular ? 'text-accent-green' : 'text-white'
          }`}>
            {plan.name}
          </h3>
          
          <p className="text-gray-400 text-sm mb-6">
            {plan.description}
          </p>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-center gap-1">
              <span className={`text-4xl font-bold ${
                plan.popular ? 'text-accent-green' : 'text-white'
              }`}>
                {plan.price}
              </span>
              <span className="text-gray-400">kr/{plan.period}</span>
            </div>
            
            <div className="text-sm text-gray-500">
              + {plan.setupFee} kr engangsgebyr
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <h4 className="font-semibold text-white mb-3">Inkludert:</h4>
          <div className="space-y-3">
            {plan.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Limitations */}
          {plan.limitations && plan.limitations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="font-semibold text-gray-400 mb-3">Begrensninger:</h4>
              <div className="space-y-2">
                {plan.limitations.map((limitation, limitIndex) => (
                  <div key={limitIndex} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500 text-sm">{limitation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={() => {
            const subject = `Interessert i ${plan.name} artistplan`;
            const body = `Hei Lydskog!

Jeg vil gjerne komme i gang med ${plan.name}-planen for artister.

Plan detaljer:
- ${plan.name}: ${plan.price} kr/mnd + ${plan.setupFee} kr setup
- ${plan.description}

Kan dere kontakte meg for å starte prosessen?

Mvh,
[Ditt navn]`;

            window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }}
          className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
            plan.popular
              ? 'bg-gradient-to-r from-accent-green to-green-600 hover:from-green-500 hover:to-green-600 text-base-dark'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Velg {plan.name}
        </motion.button>
      </div>

      {/* Background Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        plan.popular
          ? 'bg-gradient-to-br from-accent-green/5 to-transparent'
          : 'bg-gradient-to-br from-purple-500/5 to-transparent'
      }`} />
    </motion.div>
  );
}

export default function ArtistPricingPlans() {
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
          Velg din artistplan
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Fra profesjonell setup til avansert merkevarebygging - vi har løsningen som passer dine behov
        </p>
      </motion.div>

      {/* Pricing Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {artistPricingPlans.map((plan, index) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            index={index}
          />
        ))}
      </motion.div>

      {/* Additional Info */}
      <motion.div
        className="text-center mt-16 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 max-w-2xl mx-auto">
          <h4 className="text-lg font-semibold text-white mb-3">
            🎯 Ingen binding, full fleksibilitet
          </h4>
          <p className="text-gray-300 text-sm">
            Du kan når som helst endre plan, ta pause eller avslutte. 
            Musikken din forblir tilgjengelig på alle plattformer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <svg className="w-4 h-4 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Setup på 3-5 dager
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <svg className="w-4 h-4 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            24/7 musikk-tilgjengelighet
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <svg className="w-4 h-4 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Dedikert support-team
          </div>
        </div>
      </motion.div>
    </div>
  );
} 