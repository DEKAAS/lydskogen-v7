'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { serviceSections } from '@/data/services';
import { ServiceSection as ServiceSectionType, ServiceCard } from '@/types/services';

interface ServiceCardProps {
  card: ServiceCard;
  index: number;
}

function ServiceCardComponent({ card, index }: ServiceCardProps) {
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

  const isComingSoon = card.id === 'mastering';

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => {}}
      onHoverEnd={() => {}}
      className="group relative"
    >
      <Link 
        href={card.link}
        className={`block h-full ${isComingSoon ? 'pointer-events-none' : ''}`}
      >
        <div 
          className="relative p-6 rounded-xl transition-all duration-300 h-full min-h-[200px] flex flex-col"
            style={{
            background: 'var(--glass-card)',
            backdropFilter: 'blur(15px)',
            border: '1px solid var(--border-dark)'
          }}
        >
          {/* Coming Soon Overlay */}
          {isComingSoon && (
            <div className="absolute inset-0 rounded-xl flex items-center justify-center z-10" style={{
              background: 'rgba(66, 74, 69, 0.8)',
              backdropFilter: 'blur(10px)'
            }}>
              <span className="font-semibold px-4 py-2 rounded-lg" style={{
                background: 'var(--glass-section)',
                color: 'var(--text-on-dark)',
                border: '1px solid var(--border-light)'
              }}>
                Kommer snart
              </span>
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col h-full">
            {/* Icon */}
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>

            {/* Title and Description */}
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-3 transition-colors duration-300" style={{color: 'var(--text-on-dark)'}}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{color: 'var(--text-on-dark)', opacity: 0.8}}>
                {card.description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <div 
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group-hover:scale-105"
                style={{ 
                  background: 'var(--glass-section)',
                  color: 'var(--text-on-dark)',
                  border: '1px solid var(--border-light)'
                }}
              >
                Vis mer
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" style={{
            background: 'linear-gradient(135deg, rgba(207, 197, 176, 0.1), transparent)'
          }} />
        </div>
      </Link>
    </motion.div>
  );
}


export default function ServiceSection() {
  return (
    <div className="relative">
      {/* Main intro section */}
      <section className="py-20" style={{backgroundColor: 'var(--primary-bg)'}}>
        <div className="container mx-auto px-4">
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
              <div className="text-5xl">🛠️</div>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'var(--text-on-dark)'}}>
              Våre Tjenester
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{color: 'var(--text-on-dark)', opacity: 0.9}}>
              Fra kreativ ideering til ferdig produkt - vi dekker alle aspekter av musikkproduksjon og visuell design. 
              Hver tjeneste er nøye utviklet for å gi deg det beste resultatet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Grid - Single unified section */}
      <section className="py-20" style={{backgroundColor: 'var(--primary-bg)'}}>
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {serviceSections.flatMap(section => section.cards).map((card, index) => (
              <ServiceCardComponent 
                key={card.id} 
                card={card} 
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
} 