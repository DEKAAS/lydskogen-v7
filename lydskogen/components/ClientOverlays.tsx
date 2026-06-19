'use client';

import dynamic from 'next/dynamic';

// Keep the page texture subtle; heavier visual effects make the minimal design feel busy.
const NoiseOverlay = dynamic(() => import("@/components/NoiseOverlay"), { ssr: false });

export default function ClientOverlays() {
  return (
    <>
      <NoiseOverlay />
    </>
  );
}




