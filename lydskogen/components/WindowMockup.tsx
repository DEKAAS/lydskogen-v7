'use client';

import { motion } from 'framer-motion';

interface WindowMockupProps {
  type: 'linktree' | 'artist';
}

export default function WindowMockup({ type }: WindowMockupProps) {
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
            {type === 'linktree' ? 'lydskog_bio_v1.exe' : 'artist_main_view.app'}
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
          
          {type === 'linktree' ? (
            <div className="h-full flex flex-col items-center pt-8 gap-6">
              {/* Profile Node */}
              <div className="relative">
                <div className="w-20 h-20 border border-accent-green/30 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-accent-green/10 rounded-full animate-pulse" />
                </div>
                {/* Connection Lines */}
                <div className="absolute top-full left-1/2 w-[1px] h-8 bg-gradient-to-b from-accent-green/50 to-transparent -translate-x-1/2" />
              </div>

              {/* Text Info */}
              <div className="text-center space-y-1">
                <div className="text-sm font-mono text-white tracking-widest">DIN_ARTIST</div>
                <div className="text-[10px] font-mono text-gray-500">SISTE UTGIVELSE UTE NÅ</div>
              </div>

              {/* Links / Nodes */}
              <div className="w-full max-w-[240px] space-y-3 mt-2">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="group flex items-center justify-between p-3 border-l-2 border-white/10 bg-white/5 hover:border-accent-green hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] font-mono text-gray-300 group-hover:text-white">
                      {i === 1 ? 'SPOTIFY' : i === 2 ? 'APPLE MUSIC' : 'INSTAGRAM'}
                    </span>
                    <span className="text-[10px] text-accent-green opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Navigation placeholder */}
              <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
                <div className="text-2xl font-mono font-bold text-white tracking-tighter">ARTIST<br/>NAVN</div>
                <div className="text-[10px] font-mono text-accent-green">LIVE_STATUS: ON</div>
              </div>

              {/* Hero Content */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="w-full h-32 bg-gradient-to-r from-white/5 to-transparent border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-accent-green/5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white/50">NYESTE_PROSJEKT</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 border border-white/10 p-3 flex flex-col justify-between hover:border-accent-green/50 transition-colors cursor-pointer">
                    <span className="text-[10px] text-gray-500">DATO</span>
                    <span className="text-sm font-mono text-white">22.OKT</span>
                  </div>
                  <div className="h-24 border border-white/10 p-3 flex flex-col justify-between hover:border-accent-green/50 transition-colors cursor-pointer">
                    <span className="text-[10px] text-gray-500">STED</span>
                    <span className="text-sm font-mono text-white">OSLO</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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

