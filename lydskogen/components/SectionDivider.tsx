'use client';

import { motion } from 'framer-motion';

interface SectionDividerProps {
  variant?: 'soundwave' | 'pulse' | 'data-stream';
}

export default function SectionDivider({ variant = 'soundwave' }: SectionDividerProps) {
  return (
    <div className="w-full py-12 flex items-center justify-center overflow-hidden text-accent-warm/40 relative">
      
      {/* Left Crosshair - Technical marker */}
      <div className="absolute left-4 md:left-12 w-3 h-3 hidden md:block">
        <div className="absolute inset-0 border-l border-t border-current opacity-60" />
      </div>

      {/* Left Line */}
      <div className="h-px bg-current w-1/3 hidden md:block opacity-40" />
      
      {/* Middle Animation Area */}
      <div className="mx-8 flex items-center justify-center h-8 min-w-[120px]">
        
        {variant === 'soundwave' && (
          <div className="flex items-center gap-1.5 h-6">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 2, opacity: 0.3 }}
                whileInView={{ height: [4, 16, 4], opacity: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.1, 
                  repeat: Infinity, 
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
                className="w-0.5 bg-accent-green rounded-full"
              />
            ))}
          </div>
        )}

        {variant === 'pulse' && (
          <div className="relative w-32 h-full flex items-center justify-center">
             <motion.div 
               initial={{ width: "0%", opacity: 0 }}
               whileInView={{ width: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
               transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
               className="h-0.5 bg-accent-green w-full absolute"
             />
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               whileInView={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="w-2 h-2 bg-white rounded-full z-10"
             />
          </div>
        )}

        {variant === 'data-stream' && (
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.1, scale: 0.8 }}
                whileInView={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.1, 0.8] }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.2, 
                  repeat: Infinity, 
                  ease: "linear"
                }}
                className="w-1.5 h-1.5 bg-accent-green rounded-sm"
              />
            ))}
          </div>
        )}

      </div>

      {/* Right Line */}
      <div className="h-px bg-current w-1/3 hidden md:block opacity-40" />

      {/* Right Crosshair */}
      <div className="absolute right-4 md:right-12 w-3 h-3 hidden md:block">
        <div className="absolute inset-0 border-r border-b border-current opacity-60" />
      </div>
      
      {/* Mobile Simple Fade Line */}
      <div className="absolute inset-x-8 h-px bg-gradient-to-r from-transparent via-accent-warm/30 to-transparent md:hidden" />
    </div>
  );
}
