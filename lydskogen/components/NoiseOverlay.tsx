'use client';

import { useEffect, useState } from 'react';

export default function NoiseOverlay() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in to avoid flash
    setOpacity(0.08);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Warm tint layer */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{ backgroundColor: '#848C72' }}
      />
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: opacity,
          mixBlendMode: 'soft-light',
          transition: 'opacity 1s ease-out'
        }}
      />
    </div>
  );
}
