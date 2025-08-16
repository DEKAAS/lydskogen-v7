// Audio and Genre related types (from existing genre data)
export interface AudioExample {
  title: string;
  src: string;
  duration?: string;
}

export interface Genre {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string[];
  heroImage: string;
  thumbnailImage: string;
  bgClass: string;
  cardBgClass: string;
  accentColor: string;
  audioExamples: AudioExample[];
  characteristics: string[];
  pricing: {
    basic: number;
    premium: number;
    exclusive: number;
  };
}

// Artwork Gallery types
export interface ArtworkItem {
  id: string;
  imageSrc: string;
  title: string;
  price: string;
  description?: string;
  tags: string[];
  category: 'album-cover' | 'poster' | 'digital-art' | 'commission' | 'other';
  dimensions?: string;
  createdAt: string;
  availability: 'available' | 'sold' | 'commission-only';
}

export interface ArtworkCategory {
  id: string;
  name: string;
  description: string;
  count: number;
}

// Common UI component types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

// Contact and form types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  genre?: string;
  package?: string;
  artworkId?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

// Navigation and layout types
export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
} 