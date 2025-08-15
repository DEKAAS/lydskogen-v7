export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  category: 'production' | 'mixing' | 'design' | 'projects';
  gradient: {
    from: string;
    to: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface ServiceSection {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  gradient: {
    from: string;
    to: string;
  };
  cards: ServiceCard[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  isPopular?: boolean;
  description?: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  pricing: PricingPlan[];
  examples?: {
    title: string;
    description: string;
    imageUrl?: string;
    audioUrl?: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  colors: {
    primary: string;
    secondary: string;
    gradient: {
      from: string;
      to: string;
    };
  };
}

export interface Genre {
  id: string;
  name: string;
  description: string;
  inspiration: string;
  examples: {
    title: string;
    audioUrl: string;
    description: string;
  }[];
  colors: {
    gradient: {
      from: string;
      to: string;
    };
  };
}

export interface ArtworkItem {
  id: string;
  title: string;
  category: 'gallery' | 'custom';
  price: number;
  imageUrl: string;
  description?: string;
  tags?: string[];
  status?: 'available' | 'sold' | 'private';
  isNew?: boolean;
}

export interface FullPackageOption {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  isSelected: boolean;
  category: 'production' | 'mixing' | 'design' | 'artistpage';
} 