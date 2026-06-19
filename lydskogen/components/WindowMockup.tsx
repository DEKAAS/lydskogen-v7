'use client';

import { motion } from 'framer-motion';

export default function WindowMockup() {
  return (
    <div className="relative w-full max-w-[500px] aspect-[4/5] md:aspect-square group">
      
      {/* Architectural Frame Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative w-full h-full bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden"
      >
        {/* Window Header / Chrome */}
        <div className="h-8 border-b border-white/10 flex items-center justify-between px-4 bg-white/5">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
          <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
            artist_main_view.app
          </div>
        </div>

        {/* Decorative Grid Lines (Architectural Feel) */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
          <div className="absolute left-8 top-0 bottom-0 w-[1px] border-l border-dashed border-white" />
          <div className="absolute right-8 top-0 bottom-0 w-[1px] border-r border-dashed border-white" />
          <div className="absolute top-24 left-0 right-0 h-[1px] border-t border-dashed border-white" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-8 h-full overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
              <div className="text-2xl font-mono font-bold text-white tracking-tighter">ARTIST<br/>NAVN</div>
              <div className="text-[10px] font-mono text-accent-green">PROFILE: LIVE</div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="w-full h-32 bg-gradient-to-r from-white/5 to-transparent border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-accent-green/5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white/50">NYESTE_UTGIVELSE</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 border border-white/10 p-3 flex flex-col justify-between hover:border-accent-green/50 transition-colors cursor-pointer">
                  <span className="text-[10px] text-gray-500">BIO</span>
                  <span className="text-sm font-mono text-white">Kort profil</span>
                </div>
                <div className="h-24 border border-white/10 p-3 flex flex-col justify-between hover:border-accent-green/50 transition-colors cursor-pointer">
                  <span className="text-[10px] text-gray-500">KONTAKT</span>
                  <span className="text-sm font-mono text-white">Booking</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/30" />
        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white/30" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white/30" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/30" />

      </motion.div>

      {/* Background Decorative Elements */}
      <div className="absolute -right-4 -bottom-4 w-full h-full border border-dashed border-white/10 -z-10" />
      <div className="absolute -left-4 -top-4 w-24 h-24 border-l border-t border-accent-green/20 -z-10" />
    </div>
  );
}

