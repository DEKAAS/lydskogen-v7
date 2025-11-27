import HeaderHero from '@/components/HeaderHero';
import ProjectsSection from '@/components/sections/PortfolioSection';
import VerticalSections from '@/components/VerticalSections';
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

      {/* 
        Divider REMOVED for natural fade.
        Hero fades to black -> Projects starts at black.
      */}

      {/* Projects Section (formerly Portfolio) */}
      <ProjectsSection />

      <SectionDivider />

      {/* Vertical Sections Layout */}
      <VerticalSections />

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
