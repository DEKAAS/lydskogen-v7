'use client';

import { useEffect, useState } from 'react';

export default function NoiseOverlay() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in to avoid flash
    setOpacity(1);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" style={{ opacity, transition: 'opacity 1s ease-out' }}>
      {/* 
        Uniform Warm Overlay
        - Reduced opacity for subtler effect
      */}
      <div 
        className="absolute inset-0 mix-blend-soft-light"
        style={{ 
          backgroundColor: 'rgba(101, 115, 79, 0.04)' // Reduced opacity from 0.08 to 0.04
        }}
      />
      
      {/* Fine Grain Noise */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`, // Reduced opacity from 0.03 to 0.02
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
