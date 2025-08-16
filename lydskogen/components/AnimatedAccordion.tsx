'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { artistFAQ } from '@/data/artists';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionItemProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ item, index, isOpen, onToggle }: AccordionItemProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="border border-purple-500/20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/10 to-purple-800/5 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300"
    >
      <motion.button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-inset"
        whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300 pr-4">
          {item.question}
        </h3>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <svg 
            className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: {
                height: { duration: 0.4, ease: "easeInOut" },
                opacity: { duration: 0.3, delay: 0.1 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: "easeInOut" },
                opacity: { duration: 0.2 }
              }
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-purple-500/10">
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="pt-4"
              >
                <p className="text-gray-300 leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface AnimatedAccordionProps {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
}

export default function AnimatedAccordion({ 
  title = "Ofte stilte spørsmål", 
  subtitle = "Finn svar på de vanligste spørsmålene om våre artist-tjenester",
  items = artistFAQ 
}: AnimatedAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="relative z-10">
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {title}
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div
        className="space-y-4 max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {items.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            index={index}
            isOpen={openItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/10 border border-purple-500/20 rounded-xl p-8 max-w-2xl mx-auto">
          <h4 className="text-xl font-semibold text-white mb-4">
            Har du flere spørsmål?
          </h4>
          <p className="text-gray-300 mb-6">
            Vi er her for å hjelpe! Kontakt oss direkte for personlig veiledning og skreddersydde løsninger.
          </p>
          
          <motion.button
            onClick={() => {
              const subject = 'Spørsmål om artist-tjenester';
              const body = `Hei Lydskog!

Jeg har noen spørsmål om artist-tjenestene deres som ikke var dekket i FAQ-en.

Mine spørsmål:
[Skriv dine spørsmål her]

Takk for hjelpen!

Mvh,
[Ditt navn]`;

              window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Kontakt oss direkte
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 