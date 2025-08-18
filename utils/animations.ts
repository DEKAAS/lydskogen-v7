import { Variants } from 'framer-motion';

// Standard timing and easing
export const ease = {
  standard: [0.4, 0.0, 0.2, 1] as const,
  decelerated: [0.0, 0.0, 0.2, 1] as const,
  accelerated: [0.4, 0.0, 1, 1] as const,
  sharp: [0.4, 0.0, 0.6, 1] as const,
} as const;

// Animation durations
export const duration = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

// Fade animations
export const fadeVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: ease.standard,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: ease.accelerated,
    }
  }
};

// Slide animations
export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: duration.normal,
      ease: ease.standard,
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: duration.fast,
      ease: ease.accelerated,
    }
  }
};

export const slideDownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: duration.normal,
      ease: ease.standard,
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: duration.fast,
      ease: ease.accelerated,
    }
  }
};

export const slideLeftVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: duration.normal,
      ease: ease.standard,
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: duration.fast,
      ease: ease.accelerated,
    }
  }
};

export const slideRightVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: duration.normal,
      ease: ease.standard,
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: duration.fast,
      ease: ease.accelerated,
    }
  }
};

// Scale animations
export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: ease.standard,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: {
      duration: duration.fast,
      ease: ease.accelerated,
    }
  }
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: duration.fast,
    ease: ease.decelerated,
  }
};

export const hoverGlow = {
  boxShadow: '0 0 20px rgba(43, 245, 116, 0.3)',
  transition: {
    duration: duration.fast,
    ease: ease.decelerated,
  }
};

// Stagger animations for lists
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: duration.normal,
      ease: ease.standard,
    }
  }
};

// Page transition animations
export const pageVariants: Variants = {
  initial: { 
    opacity: 0, 
    x: 20 
  },
  enter: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: duration.slow,
      ease: ease.standard,
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: duration.normal,
      ease: ease.accelerated,
    }
  }
};

// Utility function for creating custom variants
export const createCustomVariant = (
  hiddenProps: Record<string, any>,
  visibleProps: Record<string, any>,
  customDuration: number = duration.normal,
  customEase: readonly number[] = ease.standard
): Variants => ({
  hidden: hiddenProps,
  visible: {
    ...visibleProps,
    transition: {
      duration: customDuration,
      ease: customEase,
    }
  }
});

// Animation helpers
export const animationHelpers = {
  // Delay between animations
  getDelay: (index: number, baseDelay: number = 0.1) => index * baseDelay,
  
  // Create spring animation
  spring: (stiffness: number = 300, damping: number = 25) => ({
    type: 'spring',
    stiffness,
    damping,
  }),
  
  // Create tween animation
  tween: (duration: number = 0.3, customEase: readonly number[] = ease.standard) => ({
    type: 'tween',
    duration,
    ease: customEase,
  }),
}; 