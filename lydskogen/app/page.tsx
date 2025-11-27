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
    <div className="min-h-screen bg-base-dark text-white">
      {/* Header Hero Section */}
      <HeaderHero />

      <SectionDivider />

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
      <div style={{backgroundColor: 'var(--primary-bg)'}}>
        <Footer />
      </div>

      {/* Global Home Button */}
      <HomeButton />
    </div>
  );
}
