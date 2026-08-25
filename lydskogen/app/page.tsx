import HeaderHero from '@/components/HeaderHero';
import ProjectsSection from '@/components/sections/PortfolioSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';
import HomeButton from '@/components/HomeButton';
import OrganicDivider from '@/components/OrganicDivider';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#1d241d]">
      {/* Header Hero Section */}
      <HeaderHero />

      <OrganicDivider />

      {/* Services Section */}
      <ServicesSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <div className="bg-[#f4efe4]">
        <Footer />
      </div>

      {/* Global Home Button */}
      <HomeButton />
    </div>
  );
}
