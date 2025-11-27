'use client';

import { motion } from 'framer-motion';

export default function SectionDivider() {
  return (
    <div className="w-full py-8 flex items-center justify-center overflow-hidden text-accent-warm/60 relative">
      
      {/* Venstre Kryss */}
      <div className="absolute left-4 md:left-12 w-3 h-3 hidden md:block">
        <div className="absolute inset-0 border-l border-t border-current opacity-80" />
      </div>

      {/* Venstre: Solid linje */}
      <div className="h-px bg-current w-1/3 hidden md:block opacity-60" />
      
      {/* Midten: Teknisk "Lydbølge" */}
      <div className="flex items-center gap-1.5 mx-6 h-6">
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

      {/* Høyre: Solid linje (byttet fra stiplet for renere look) */}
      <div className="h-px bg-current w-1/3 hidden md:block opacity-60" />

      {/* Høyre Kryss */}
      <div className="absolute right-4 md:right-12 w-3 h-3 hidden md:block">
        <div className="absolute inset-0 border-r border-b border-current opacity-80" />
      </div>
      
      {/* Mobil: Enkel, tydelig linje med fade */}
      <div className="absolute inset-x-8 h-px bg-gradient-to-r from-transparent via-accent-warm/50 to-transparent md:hidden" />
    </div>
  );
}
