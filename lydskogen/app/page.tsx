import HeaderHero from '@/components/HeaderHero';
import PortfolioSection from '@/components/sections/PortfolioSection';
import VerticalSections from '@/components/VerticalSections';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';
import HomeButton from '@/components/HomeButton';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header Hero Section */}
      <HeaderHero />

      {/* Portfolio Section - Recent Work */}
      <PortfolioSection />

      {/* Vertical Sections Layout */}
      <VerticalSections />

      {/* About Section */}
      <AboutSection />

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
