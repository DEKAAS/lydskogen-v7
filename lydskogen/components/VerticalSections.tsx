'use client';

import ArtistNettsideSection from './sections/ArtistNettside';
import MiksingSeksjon from './sections/MiksingSeksjon';
import MusikkproduksjonSeksjon from './sections/MusikkproduksjonSeksjon';
import SectionDivider from './SectionDivider';

export default function VerticalSections() {
  return (
    <div className="bg-base-dark">
      {/* Artist-nettside Section */}
      <ArtistNettsideSection />
      
      <SectionDivider />

      {/* Miksing Section */}
      <div style={{backgroundColor: 'var(--section-bg-2)'}}>
        <MiksingSeksjon />
      </div>
      
      <SectionDivider />

      {/* Musikkproduksjon Section */}
      <div style={{backgroundColor: 'var(--section-bg-3)'}}>
        <MusikkproduksjonSeksjon />
      </div>
    </div>
  );
}
