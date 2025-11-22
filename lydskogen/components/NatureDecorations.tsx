'use client';

import { useEffect, useState } from 'react';

export default function NatureDecorations() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Blomster og skog-elementer - transparente SVG */}
      
      {/* Blomst 1 - Top left */}
      <div 
        className="absolute top-20 left-10 opacity-12"
        style={{
          transform: 'rotate(-15deg)',
          width: '120px',
          height: '120px',
        }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 20 C45 20, 40 25, 40 30 C40 35, 45 40, 50 40 C55 40, 60 35, 60 30 C60 25, 55 20, 50 20 Z" fill="#4a7c59" opacity="0.6"/>
          <path d="M50 30 L50 60" stroke="#4a7c59" strokeWidth="2" opacity="0.4"/>
          <circle cx="45" cy="25" r="3" fill="#c8e6d0" opacity="0.5"/>
          <circle cx="55" cy="25" r="3" fill="#c8e6d0" opacity="0.5"/>
        </svg>
      </div>

      {/* Blomst 2 - Top right */}
      <div 
        className="absolute top-32 right-16 opacity-10"
        style={{
          transform: 'rotate(20deg)',
          width: '100px',
          height: '100px',
        }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 15 C48 15, 46 18, 46 20 C46 22, 48 25, 50 25 C52 25, 54 22, 54 20 C54 18, 52 15, 50 15 Z" fill="#4a7c59" opacity="0.5"/>
          <path d="M50 20 L50 50" stroke="#4a7c59" strokeWidth="1.5" opacity="0.3"/>
          <circle cx="48" cy="18" r="2" fill="#a3b5a8" opacity="0.4"/>
          <circle cx="52" cy="18" r="2" fill="#a3b5a8" opacity="0.4"/>
        </svg>
      </div>


      {/* Blomst 3 - Middle left */}
      <div 
        className="absolute top-1/2 left-20 opacity-10"
        style={{
          transform: 'translateY(-50%) rotate(10deg)',
          width: '80px',
          height: '80px',
        }}
      >
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 10 C38 10, 36 12, 36 14 C36 16, 38 18, 40 18 C42 18, 44 16, 44 14 C44 12, 42 10, 40 10 Z" fill="#4a7c59" opacity="0.5"/>
          <path d="M40 14 L40 50" stroke="#4a7c59" strokeWidth="1.5" opacity="0.3"/>
          <circle cx="38" cy="12" r="2" fill="#a3b5a8" opacity="0.4"/>
          <circle cx="42" cy="12" r="2" fill="#a3b5a8" opacity="0.4"/>
        </svg>
      </div>

      {/* Blomst 4 - Middle right */}
      <div 
        className="absolute top-1/3 right-24 opacity-8"
        style={{
          transform: 'rotate(-25deg)',
          width: '90px',
          height: '90px',
        }}
      >
        <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M45 12 C43 12, 41 15, 41 17 C41 19, 43 22, 45 22 C47 22, 49 19, 49 17 C49 15, 47 12, 45 12 Z" fill="#4a7c59" opacity="0.5"/>
          <path d="M45 17 L45 55" stroke="#4a7c59" strokeWidth="1.5" opacity="0.3"/>
          <circle cx="43" cy="15" r="2" fill="#c8e6d0" opacity="0.4"/>
          <circle cx="47" cy="15" r="2" fill="#c8e6d0" opacity="0.4"/>
        </svg>
      </div>

      {/* Blad 1 - Top center */}
      <div 
        className="absolute top-16 left-1/2 opacity-8"
        style={{
          transform: 'translateX(-50%) rotate(45deg)',
          width: '60px',
          height: '60px',
        }}
      >
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 5 C25 5, 20 10, 20 15 C20 20, 25 25, 30 30 C35 25, 40 20, 40 15 C40 10, 35 5, 30 5 Z" fill="#4a7c59" opacity="0.4"/>
          <path d="M30 15 L30 50" stroke="#4a7c59" strokeWidth="1" opacity="0.3"/>
        </svg>
      </div>

      {/* Blad 2 - Bottom center */}
      <div 
        className="absolute bottom-24 left-1/2 opacity-6"
        style={{
          transform: 'translateX(-50%) rotate(-30deg)',
          width: '70px',
          height: '70px',
        }}
      >
        <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35 5 C30 5, 25 10, 25 15 C25 20, 30 25, 35 30 C40 25, 45 20, 45 15 C45 10, 40 5, 35 5 Z" fill="#4a7c59" opacity="0.4"/>
          <path d="M35 15 L35 60" stroke="#4a7c59" strokeWidth="1" opacity="0.3"/>
        </svg>
      </div>
    </div>
  );
}

