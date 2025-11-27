'use client';

import ArtistNettsideSection from './sections/ArtistNettside';
import MiksingSeksjon from './sections/MiksingSeksjon';
import MusikkproduksjonSeksjon from './sections/MusikkproduksjonSeksjon';
import SectionDivider from './SectionDivider';

export default function VerticalSections() {
  return (
    // Removed background color here to allow gradients from sections to flow naturally
    // without being cut off or overridden by a wrapper background.
    <div>
      
      {/* Artist-nettside Section (Includes gradient transition from blue to green) */}
      <ArtistNettsideSection />
      
      {/* Divider: Pulse Variant */}
      <SectionDivider variant="pulse" />

      {/* Miksing Section */}
      <div style={{backgroundColor: 'var(--section-bg-2)'}}>
        <MiksingSeksjon />
      </div>
      
      {/* Divider: Data Stream Variant */}
      <SectionDivider variant="data-stream" />

      {/* Musikkproduksjon Section */}
      <div style={{backgroundColor: 'var(--section-bg-3)'}}>
        <MusikkproduksjonSeksjon />
      </div>
    </div>
  );
}
