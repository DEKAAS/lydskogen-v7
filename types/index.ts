import React from 'react';

// Service data interface for Lydskog services
export interface ServiceData {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string; // For longer descriptions on service pages
  price?: string;
  priceRange?: string; // Alternative to fixed price
  image: string;
  cta: {
    text: string;
    link: string;
  };
  bgClass?: string; // Background styling for service sections
  category: 'mixing' | 'artwork' | 'production' | 'artist'; // Service category
  features?: string[]; // List of included features
  duration?: string; // Estimated duration for the service
}

// Navigation interface for consistent menu structure
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// Contact form interface
export interface ContactForm {
  name: string;
  email: string;
  service: string;
  message: string;
}

// Project/Portfolio interface for showcasing work
export interface Project {
  id: string;
  title: string;
  artist: string;
  description: string;
  image: string;
  audioUrl?: string; // For music previews
  category: ServiceData['category'];
  year: number;
  featured?: boolean;
}

// Hero section interface for flexible content
export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
} 