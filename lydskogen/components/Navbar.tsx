'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface NavSection {
  id: string;
  name: string;
  colors: {
    from: string;
    to: string;
    text: string;
  };
}

const navSections: NavSection[] = [
  {
    id: 'hero',
    name: 'Hjem',
    colors: {
      from: '#10b981',
      to: '#059669', 
      text: '#10b981'
    }
  },
  {
    id: 'services',
    name: 'Tjenester',
    colors: {
      from: '#26244F',
      to: '#2D2E5E',
      text: '#818cf8'
    }
  },
  {
    id: 'artwork',
    name: 'Artwork',
    colors: {
      from: '#3C1F1F',
      to: '#522828',
      text: '#f87171'
    }
  },
  {
    id: 'artist',
    name: 'Artistside',
    colors: {
      from: '#3C2B4F',
      to: '#5C3D78',
      text: '#c084fc'
    }
  },
  {
    id: 'fullpackage',
    name: 'Helhetlig',
    colors: {
      from: '#3C2B4F',
      to: '#5C3D78',
      text: '#c084fc'
    }
  }
];

export default function Navbar() {
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tinted, setTinted] = useState<{from:string,to:string}>({ from: navSections[0].colors.from, to: navSections[0].colors.to })

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Determine active section based on scroll position
      const sections = ['hero', 'services', 'artwork', 'artist', 'fullpackage', 'about', 'projects'];
      let currentSection = 'hero';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offset = 100; // Account for navbar height
          
          if (rect.top <= offset && rect.bottom > offset) {
            currentSection = section;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);

      // compute dynamic tint per scroll
      const base = navSections.find(s => s.id === currentSection) || navSections[0]
      const factor = Math.min(1, Math.max(0, scrollY / 1200));
      const lerp = (a: number, b: number) => Math.round(a + (b - a) * factor);
      const hexToRgb = (hex: string) => { const h = hex.replace('#',''); const n = parseInt(h,16); return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 } };
      const rgbToHex = (r:number,g:number,b:number) => `#${[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('')}`;
      const from = hexToRgb(base.colors.from); const to = hexToRgb(base.colors.to);
      const mixFrom = rgbToHex(lerp(from.r, 60), lerp(from.g, 90), lerp(from.b, 70));
      const mixTo = rgbToHex(lerp(to.r, 50), lerp(to.g, 85), lerp(to.b, 65));
      setTinted({ from: mixFrom, to: mixTo })
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setIsMobileMenuOpen(false);
    }
  };

  const getActiveSection = () => (navSections.find(section => section.id === activeSection) || navSections[0]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-base-dark/95 backdrop-blur-md border-b border-gray-800/50 shadow-xl' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Home */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-green to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-base-dark">L</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full" />
              </div>
              <div>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-left">
                  <h1 className="text-xl font-bold text-white hover:underline">Lydskog</h1>
                </button>
                <p className="text-xs text-gray-400 -mt-1">Audio Production</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navSections.map((section) => {
                const isActive = activeSection === section.id;
                
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                      style={{
                      background: isActive 
                        ? `linear-gradient(135deg, ${tinted.from}, ${tinted.to})`
                        : 'transparent'
                    }}
                  >
                    {section.name}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl border-2 border-white/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Contact + Login CTA */}
            <div className="hidden md:block">
              <motion.button
                onClick={() => {
                  const subject = 'Kontakt fra Lydskog nettside';
                  const body = `Hei Lydskog!

Jeg vil gjerne høre mer om tjenestene deres.

Mvh,
[Ditt navn]`;

                  window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
                className="bg-gradient-to-r from-accent-green to-green-600 hover:from-green-500 hover:to-green-600 text-base-dark font-semibold px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Kontakt oss
              </motion.button>
              {session?.user?.role === 'admin' ? (
                <motion.button
                  onClick={() => (window.location.href = '/admin/dashboard')}
                  className="ml-3 bg-gradient-to-r from-accent-green to-green-600 hover:from-green-500 hover:to-green-600 text-base-dark font-semibold px-6 py-2 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Admin Panel
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => (window.location.href = '/admin/login')}
                  className="ml-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 border border-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Admin Login
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-6 h-6">
                <motion.div
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 6 : 0
                  }}
                  className="absolute top-1 w-6 h-0.5 bg-white rounded-full"
                />
                <motion.div
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1
                  }}
                  className="absolute top-3 w-6 h-0.5 bg-white rounded-full"
                />
                <motion.div
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -6 : 0
                  }}
                  className="absolute top-5 w-6 h-0.5 bg-white rounded-full"
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Active Section Gradient Bar */}
        <motion.div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${tinted.from}, ${tinted.to})`
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-base-dark via-secondary-dark to-tertiary-dark border-l border-gray-800 z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-base-dark">L</span>
                    </div>
                    <span className="text-lg font-bold text-white">Lydskog</span>
                  </div>
                  
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 py-6">
                  {navSections.map((section, index) => {
                    const isActive = activeSection === section.id;
                    
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-6 py-4 transition-all duration-300 relative ${
                          isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                        }`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { delay: index * 0.1 }
                        }}
                        whileHover={{ x: 10 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div 
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              isActive ? 'scale-100' : 'scale-50 opacity-50'
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${section.colors.from}, ${section.colors.to})`
                            }}
                          />
                          <span className="text-lg font-medium">{section.name}</span>
                        </div>
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveTab"
                            className="absolute left-0 top-0 w-1 h-full rounded-r"
                            style={{
                              background: `linear-gradient(180deg, ${section.colors.from}, ${section.colors.to})`
                            }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Contact CTA */}
                <div className="p-6 border-t border-gray-800 space-y-3">
                  <motion.button
                    onClick={() => {
                      const subject = 'Kontakt fra Lydskog nettside';
                      const body = `Hei Lydskog!

Jeg vil gjerne høre mer om tjenestene deres.

Mvh,
[Ditt navn]`;

                      window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-accent-green to-green-600 hover:from-green-500 hover:to-green-600 text-base-dark font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Kontakt oss
                  </motion.button>
                  
                  {session?.user?.role === 'admin' ? (
                    <motion.button
                      onClick={() => {
                        window.location.href = '/admin/dashboard';
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-accent-green to-green-600 hover:from-green-500 hover:to-green-600 text-base-dark font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Admin Panel
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => {
                        window.location.href = '/admin/login';
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/10"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Admin Login
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 