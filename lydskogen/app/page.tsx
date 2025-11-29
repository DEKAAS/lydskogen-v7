import HeaderHero from '@/components/HeaderHero';
import ProjectsSection from '@/components/sections/PortfolioSection';
import AudioDemosSection from '@/components/sections/AudioDemosSection';
import ArtistNettsideSection from '@/components/sections/ArtistNettside';
import MiksingSeksjon from '@/components/sections/MiksingSeksjon';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';
import HomeButton from '@/components/HomeButton';
import SectionDivider from '@/components/SectionDivider';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      {/* Header Hero Section */}
      <HeaderHero />

      {/* Projects Section */}
      <ProjectsSection />
      
      {/* Audio Demos (Moved here per request) */}
      <AudioDemosSection />

      <SectionDivider variant="pulse" />

      {/* Services: Artist / Linktree */}
      <ArtistNettsideSection />

      <SectionDivider variant="data-stream" />

      {/* Services: Miksing */}
      <MiksingSeksjon />

      <SectionDivider />

      {/* About Section */}
      <AboutSection />

      <SectionDivider />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <div style={{backgroundColor: '#050605'}}>
        <Footer />
      </div>

      {/* Global Home Button */}
      <HomeButton />
    </div>
  );
}
