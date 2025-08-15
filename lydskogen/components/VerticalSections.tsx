'use client';

import ArtistNettsideSection from './sections/ArtistNettside';
import MiksingSeksjon from './sections/MiksingSeksjon';
import MusikkproduksjonSeksjon from './sections/MusikkproduksjonSeksjon';
import CombinedArtworkSection from './CombinedArtworkSection';
import ProjectsSection from './sections/ProjectsSection';

export default function VerticalSections() {
  return (
    <div style={{backgroundColor: 'var(--primary-bg)'}}>
      {/* Artist-nettside Section */}
      <ArtistNettsideSection />
      <div className="section-divider" />
      
      {/* Miksing Section */}
      <MiksingSeksjon />
      <div className="section-divider" />
      
      {/* Musikkproduksjon Section (inkluderer ferdig musikk per sjanger) */}
      <MusikkproduksjonSeksjon />
      <div className="section-divider" />
      
      {/* Artwork Galleri Section */}
      <CombinedArtworkSection />
      <div className="section-divider" />

      {/* Prosjekter */}
      <ProjectsSection />
    </div>
  );
}