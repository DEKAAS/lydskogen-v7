'use client';

import ArtistNettsideSection from './sections/ArtistNettside';
import MiksingSeksjon from './sections/MiksingSeksjon';
import MusikkproduksjonSeksjon from './sections/MusikkproduksjonSeksjon';

export default function VerticalSections() {
  return (
    <div>
      {/* Artist-nettside Section */}
      <div style={{backgroundColor: 'var(--section-bg-1)'}}>
        <ArtistNettsideSection />
      </div>
      <div className="section-divider" />
      
      {/* Miksing Section */}
      <div style={{backgroundColor: 'var(--section-bg-2)'}}>
        <MiksingSeksjon />
      </div>
      <div className="section-divider" />
      
      {/* Musikkproduksjon Section */}
      <div style={{backgroundColor: 'var(--section-bg-3)'}}>
        <MusikkproduksjonSeksjon />
      </div>
    </div>
  );
}