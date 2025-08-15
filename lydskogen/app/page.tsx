import HeaderHero from '@/components/HeaderHero';
import VerticalSections from '@/components/VerticalSections';
import AboutAndContact from '@/components/AboutAndContact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header Hero Section - UNCHANGED as requested */}
      <HeaderHero />

      {/* Vertical Sections Layout */}
      <VerticalSections />

      {/* About and Contact Section */}
      <div style={{backgroundColor: 'var(--primary-bg)'}}>
        <AboutAndContact />
        <Footer />
      </div>
    </div>
  );
}
