// Utility for creating placeholder images and audio files during development

export const createPlaceholderSVG = (
  width: number, 
  height: number, 
  text: string, 
  bgColor: string = '#1a1a1a',
  textColor: string = '#ffffff'
): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `)}`;
};

// Genre-specific placeholder generators
export const genrePlaceholders = {
  ambient: {
    hero: createPlaceholderSVG(1200, 600, 'Ambient Hero', '#1e3a8a', '#ffffff'),
    thumb: createPlaceholderSVG(400, 300, 'Ambient', '#1e3a8a', '#ffffff')
  },
  hiphop: {
    hero: createPlaceholderSVG(1200, 600, 'Hip-Hop Hero', '#ea580c', '#ffffff'),
    thumb: createPlaceholderSVG(400, 300, 'Hip-Hop', '#ea580c', '#ffffff')
  },
  lofi: {
    hero: createPlaceholderSVG(1200, 600, 'Lo-Fi Hero', '#d97706', '#ffffff'),
    thumb: createPlaceholderSVG(400, 300, 'Lo-Fi', '#d97706', '#ffffff')
  },
  soundscape: {
    hero: createPlaceholderSVG(1200, 600, 'Soundscape Hero', '#475569', '#ffffff'),
    thumb: createPlaceholderSVG(400, 300, 'Soundscape', '#475569', '#ffffff')
  }
};

// Mock audio files (silent audio data URL)
export const createSilentAudio = (durationSeconds: number = 30): string => {
  // This creates a very short silent audio data URL
  // In a real app, you'd have actual audio files
  return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTVOntTxz3EfBSyF0fPZeyMELP/x';
};

// Development note: Replace these with actual images and audio files for production 