'use client';

import { motion } from 'framer-motion';

interface PhoneMockupProps {
  type: 'linktree' | 'artist';
}

export default function PhoneMockup({ type }: PhoneMockupProps) {
  return (
    <div className="relative w-[280px] md:w-[320px] h-[580px] md:h-[640px] perspective-1000">
      <motion.div
        initial={{ rotateY: -15, rotateX: 5 }}
        whileHover={{ rotateY: 0, rotateX: 0, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full h-full bg-black rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden relative transform-style-3d"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      >
        {/* Screen Content */}
        <div className="w-full h-full bg-base-dark relative overflow-hidden">
          
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-transparent flex justify-between items-center px-6 text-[10px] font-mono text-white/50 z-20">
            <span>09:41</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>
          </div>

          {/* Dynamic Content based on type */}
          <div className="h-full overflow-y-auto no-scrollbar pt-12 pb-8 px-4">
            
            {type === 'linktree' ? (
              <div className="flex flex-col items-center gap-6">
                {/* Profile */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-green to-emerald-800 border-2 border-white/10 shadow-lg" />
                <div className="text-center">
                  <h3 className="font-mono text-white text-lg font-bold tracking-tight">DIN_ARTIST</h3>
                  <p className="text-accent-warm text-xs font-mono mt-1">@din_artist</p>
                </div>

                {/* Links */}
                <div className="w-full space-y-3 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center group hover:bg-white/10 transition-colors cursor-pointer">
                      <span className="text-xs text-gray-300 font-mono">LINK_0{i}</span>
                      <span className="text-accent-green">→</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Hero Image */}
                <div className="w-full aspect-square bg-gradient-to-b from-gray-800 to-base-dark rounded-2xl mb-6 relative overflow-hidden border border-white/5">
                  <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center opacity-50 mix-blend-overlay" />
                  <div className="absolute bottom-4 left-4">
                    <h2 className="font-mono text-2xl text-white font-bold leading-none">NY<br/>LÅT</h2>
                  </div>
                </div>

                {/* Tracklist */}
                <div className="space-y-4 px-2">
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <span className="text-xs font-mono text-accent-warm">LATEST_RELEASE</span>
                    <span className="text-xs font-mono text-gray-500">2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center text-black">▶</div>
                      <div className="flex flex-col">
                        <span className="text-sm text-white font-bold">Skogbunn</span>
                        <span className="text-xs text-gray-500">Ambient / Field Rec</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-500">03:42</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-base-dark to-transparent pointer-events-none z-10" />
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-full z-20" />
        </div>

        {/* Reflections */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[2.5rem]" />
      </motion.div>
    </div>
  );
}

