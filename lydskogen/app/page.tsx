import HeaderHero from '@/components/HeaderHero';
import PortfolioSection from '@/components/sections/PortfolioSection';
import VerticalSections from '@/components/VerticalSections';
import AboutAndContact from '@/components/AboutAndContact';
import Footer from '@/components/Footer';
import HomeButton from '@/components/HomeButton';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header Hero Section - UNCHANGED as requested */}
      <HeaderHero />

      {/* Portfolio Section - Recent Work */}
      <PortfolioSection />

      {/* Vertical Sections Layout */}
      <VerticalSections />

      {/* About and Contact Section */}
      <div style={{backgroundColor: 'var(--primary-bg)'}}>
        <AboutAndContact />
        <Footer />
      </div>

      {/* Global Home Button */}
      <HomeButton />
    </div>
  );
}
