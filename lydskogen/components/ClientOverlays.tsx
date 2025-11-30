'use client';

import dynamic from 'next/dynamic';

// Lazy load visual overlays to prevent chunk load errors and improve TTI
const ParticleOverlay = dynamic(() => import("@/components/ParticleOverlay"), { ssr: false });
const NoiseOverlay = dynamic(() => import("@/components/NoiseOverlay"), { ssr: false });

export default function ClientOverlays() {
  return (
    <>
      <NoiseOverlay />
      <ParticleOverlay />
    </>
  );
}

