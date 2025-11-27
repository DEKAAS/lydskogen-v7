'use client';

import { motion } from 'framer-motion';

export default function SectionDivider() {
  return (
    <div className="w-full h-px relative flex items-center justify-center overflow-hidden text-accent-warm/30">
      {/* Venstre: Solid linje */}
      <div className="h-px bg-current w-1/3 hidden md:block" />
      
      {/* Midten: Teknisk "Lydbølge / Linjal" mønster */}
      <div className="flex items-end gap-1 mx-4 h-4 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 2 }}
            whileInView={{ height: [4, 12, 4] }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ 
              duration: 1.5, 
              delay: i * 0.05, 
              repeat: Infinity, 
              repeatDelay: 3 
            }}
            className="w-px bg-current"
            style={{ height: i % 2 === 0 ? '8px' : '4px' }}
          />
        ))}
      </div>

      {/* Høyre: Stiplet linje */}
      <div className="h-px border-t border-dashed border-current w-1/3 hidden md:block" />
      
      {/* Mobil: Enklere versjon */}
      <div className="absolute inset-0 border-t border-dashed border-current md:hidden" />
    </div>
  );
}

