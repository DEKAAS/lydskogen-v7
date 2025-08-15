'use client';

import { motion } from 'framer-motion';
import { PricingPlan } from '@/types/services';

interface PricingPlansProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  onPlanSelect?: (planId: string) => void;
}

export default function PricingPlans({ 
  plans, 
  title = "Våre Priser", 
  description = "Velg planen som passer best for ditt prosjekt",
  onPlanSelect 
}: PricingPlansProps) {
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

  const formatPrice = (price: number, period: string) => {
    if (period === 'monthly') return `${price} kr/mnd`;
    if (period === 'yearly') return `${price} kr/år`;
    return `${price} kr`;
  };

  const generateContactEmail = (plan: PricingPlan) => {
    const subject = `Forespørsel om ${plan.name}`;
    const body = `Hei Lydskog!

Jeg er interessert i ${plan.name}-planen:

Pris: ${formatPrice(plan.price, plan.period)}
${plan.description || ''}

Tjenester inkludert:
${plan.features.map(feature => `- ${feature}`).join('\n')}

Kan dere kontakte meg for mer informasjon?

Mvh,
[Ditt navn]`;

    window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-accent-green text-base-dark px-4 py-1 rounded-full text-sm font-semibold">
                    Mest populær
                  </span>
                </div>
              )}

              <div className={`relative p-8 rounded-2xl border transition-all duration-300 h-full ${
                plan.isPopular 
                  ? 'border-accent-green bg-gradient-to-br from-accent-green/10 to-accent-green/5 shadow-lg shadow-accent-green/20' 
                  : 'border-white/20 bg-gradient-to-br from-white/5 to-white/10 hover:border-accent-green/50'
              }`}>
                
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  {plan.description && (
                    <p className="text-gray-400 text-sm mb-4">
                      {plan.description}
                    </p>
                  )}

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 ml-1">
                      {plan.period === 'monthly' ? ' kr/mnd' : 
                       plan.period === 'yearly' ? ' kr/år' : ' kr'}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-green/20 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => {
                    if (onPlanSelect) {
                      onPlanSelect(plan.id);
                    } else {
                      generateContactEmail(plan);
                    }
                  }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.isPopular
                      ? 'bg-accent-green text-base-dark hover:bg-green-500 hover:scale-105'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-accent-green hover:text-base-dark hover:border-accent-green hover:scale-105'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {onPlanSelect ? 'Velg plan' : 'Kontakt oss'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm">
            Alle priser er eksklusiv mva. Kontakt oss for tilpassede pakker eller spørsmål.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 