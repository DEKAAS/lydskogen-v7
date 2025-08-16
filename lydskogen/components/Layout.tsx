import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ 
  children, 
  className = ''
}: LayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-base-dark ${className}`}>
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
} 