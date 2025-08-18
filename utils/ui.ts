import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine and merge Tailwind CSS classes
 * Useful for conditional classes and overrides
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate responsive spacing utilities
 */
export const spacing = {
  // Padding utilities
  p: {
    none: 'p-0',
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-12',
    '3xl': 'p-16',
  },
  px: {
    none: 'px-0',
    xs: 'px-1',
    sm: 'px-2',
    md: 'px-4',
    lg: 'px-6',
    xl: 'px-8',
    '2xl': 'px-12',
    '3xl': 'px-16',
  },
  py: {
    none: 'py-0',
    xs: 'py-1',
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6',
    xl: 'py-8',
    '2xl': 'py-12',
    '3xl': 'py-16',
  },
  
  // Margin utilities
  m: {
    none: 'm-0',
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
    '2xl': 'm-12',
    '3xl': 'm-16',
  },
  mx: {
    none: 'mx-0',
    xs: 'mx-1',
    sm: 'mx-2',
    md: 'mx-4',
    lg: 'mx-6',
    xl: 'mx-8',
    '2xl': 'mx-12',
    '3xl': 'mx-16',
    auto: 'mx-auto',
  },
  my: {
    none: 'my-0',
    xs: 'my-1',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
    xl: 'my-8',
    '2xl': 'my-12',
    '3xl': 'my-16',
  },

  // Gap utilities for flexbox/grid
  gap: {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
    '3xl': 'gap-16',
  },
};

/**
 * Music genre gradient utilities
 */
export const gradients = {
  ambient: 'bg-gradient-ambient',
  hiphop: 'bg-gradient-hiphop',
  lofi: 'bg-gradient-lofi',
  soundscape: 'bg-gradient-soundscape',
} as const;

/**
 * Get gradient class by genre name
 */
export function getGradientByGenre(genre: keyof typeof gradients): string {
  return gradients[genre] || gradients.ambient;
}

/**
 * Responsive grid utilities
 */
export const grid = {
  cols: {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  },
  gap: {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  },
};

/**
 * Typography utilities
 */
export const typography = {
  heading: {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
    h3: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
    h4: 'text-xl md:text-2xl lg:text-3xl font-semibold',
    h5: 'text-lg md:text-xl lg:text-2xl font-medium',
    h6: 'text-base md:text-lg lg:text-xl font-medium',
  },
  body: {
    large: 'text-lg md:text-xl',
    base: 'text-base md:text-lg',
    small: 'text-sm md:text-base',
    xs: 'text-xs md:text-sm',
  },
  weight: {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
};

/**
 * Shadow utilities for depth
 */
export const shadows = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  glow: 'shadow-lg shadow-accent-green/20',
  glowStrong: 'shadow-xl shadow-accent-green/30',
};

/**
 * Border radius utilities
 */
export const radius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

/**
 * Flex utilities for common layouts
 */
export const flex = {
  center: 'flex items-center justify-center',
  centerBetween: 'flex items-center justify-between',
  centerStart: 'flex items-center justify-start',
  centerEnd: 'flex items-center justify-end',
  col: 'flex flex-col',
  colCenter: 'flex flex-col items-center justify-center',
  colCenterBetween: 'flex flex-col items-center justify-between',
  wrap: 'flex flex-wrap',
  nowrap: 'flex flex-nowrap',
};

/**
 * Common transition utilities
 */
export const transitions = {
  all: 'transition-all duration-200 ease-in-out',
  colors: 'transition-colors duration-200 ease-in-out',
  transform: 'transition-transform duration-200 ease-in-out',
  opacity: 'transition-opacity duration-200 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
  fast: 'transition-all duration-100 ease-in-out',
};

/**
 * Generate responsive classes
 */
export function responsive(
  base: string,
  md?: string,
  lg?: string,
  xl?: string
): string {
  let classes = base;
  if (md) classes += ` md:${md}`;
  if (lg) classes += ` lg:${lg}`;
  if (xl) classes += ` xl:${xl}`;
  return classes;
}

/**
 * Create conditional classes
 */
export function conditional(
  condition: boolean,
  trueClasses: string,
  falseClasses: string = ''
): string {
  return condition ? trueClasses : falseClasses;
} 