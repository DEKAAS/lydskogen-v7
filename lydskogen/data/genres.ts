import { genrePlaceholders, createSilentAudio } from '../utils/placeholders';

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
  // Optional admin-editable thumbnail (overrides placeholder)
  adminThumbnailImage?: string;
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

export const genreData: Genre[] = [
  {
    id: 'ambient',
    slug: 'ambient',
    title: 'Ambient',
    shortDescription: 'Atmosfærisk og rolig musikk som skaper stemning og dybde',
    description: [
      'Ambient musikk er karakterisert av atmosfæriske lydlandskap som skaper en følelse av ro og kontemplasjon. Dette er musikk som fyller rommet uten å dominere det.',
      'Jeg bruker synthesizere, field recordings og romklang for å skape immersive opplevelser som fungerer perfekt som bakgrunnsmusikk for film, dokumentarer, meditasjon eller bare for å skape en rolig atmosfære.',
      'Hver ambient-komposisjon er nøye laget for å guide lytteren gjennom følelsesmessige landskap, fra minimalistiske droneklanger til rike, teksturelle lydbilder.'
    ],
    heroImage: genrePlaceholders.ambient.hero,
    thumbnailImage: genrePlaceholders.ambient.thumb,
    bgClass: 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900',
    cardBgClass: 'bg-gradient-to-br from-blue-800/20 to-purple-800/20',
    accentColor: 'rgb(147, 197, 253)', // blue-300
    audioExamples: [
      {
        title: 'Nordlys - Ethereal Soundscape',
        src: createSilentAudio(272), // 4:32 in seconds
        duration: '4:32'
      },
      {
        title: 'Deep Forest - Nature Ambient',
        src: createSilentAudio(375), // 6:15 in seconds
        duration: '6:15'
      },
      {
        title: 'Cosmic Drift - Space Ambient',
        src: createSilentAudio(344), // 5:44 in seconds
        duration: '5:44'
      }
    ],
    characteristics: [
      'Atmosfæriske pads og teksturer',
      'Field recordings fra naturen',
      'Minimalistisk tilnærming',
      'Langsom utvikling og progression',
      'Fokus på stemning over melodi',
      'Perfekt for meditasjon og avslapning'
    ],
    pricing: {
      basic: 600,
      premium: 600,
      exclusive: 600
    }
  },
  {
    id: 'hiphop',
    slug: 'hiphop',
    title: 'Hip-Hop',
    shortDescription: 'Kraftfulle beats og grooves med moderne produksjonsteknikker',
    description: [
      'Hip-hop produksjon handler om å skape beats som får folk til å bevege seg. Jeg kombinerer klassiske elementer som sterke trommer og basslinjer med moderne produksjonsteknikker.',
      'Fra boombap til trap og alt imellom - jeg lager beats som gir artistene det perfekte fundamentet for deres tekster og flow. Hver beat er produsert med fokus på både kraft og musikalitet.',
      'Jeg bruker både sampleteknikker og original komposisjon for å skape unike lydbilder som skiller seg ut i dagens musikk-landskap.'
    ],
    heroImage: genrePlaceholders.hiphop.hero,
    thumbnailImage: genrePlaceholders.hiphop.thumb,
    bgClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-pink-900',
    cardBgClass: 'bg-gradient-to-br from-orange-800/20 to-red-800/20',
    accentColor: 'rgb(251, 146, 60)', // orange-400
    audioExamples: [
      {
        title: 'Urban Flow - Modern Trap Beat',
        src: createSilentAudio(225), // 3:45 in seconds
        duration: '3:45'
      },
      {
        title: 'Old School Vibes - Boombap Style',
        src: createSilentAudio(252), // 4:12 in seconds
        duration: '4:12'
      },
      {
        title: 'Dark Energy - Aggressive Beat',
        src: createSilentAudio(208), // 3:28 in seconds
        duration: '3:28'
      }
    ],
    characteristics: [
      'Kraftfulle trommer og 808s',
      'Kreativ bruk av samples',
      'Moderne trap-elementer',
      'Klassisk boombap-følelse',
      'Sterke basslinjer',
      'Perfekt for rap og vokal'
    ],
    pricing: {
      basic: 800,
      premium: 800,
      exclusive: 800
    }
  },
  {
    id: 'lofi',
    slug: 'lofi',
    title: 'Lo-Fi',
    shortDescription: 'Nostalgisk og avslappende musikk med vintage karakteristikker',
    description: [
      'Lo-fi hip-hop og chill beats har blitt synonymt med fokus, studier og avslapning. Jeg skaper tracks med den karakteristiske varme og nostalgiske følelsen som sjangeren er kjent for.',
      'Gjennom bruk av vintage sampleteknikker, vinyl-crackle og mykere produksjon skaper jeg musikk som føles både kjent og helt ny. Hver track er designet for å være den perfekte bakgrunnen for produktivitet eller avslapning.',
      'Lo-fi musikken min kombinerer organiske instrumenter med digitale teksturer for å skape en unik lyd som resonerer med moderne lyttere som søker ro i en travel verden.'
    ],
    heroImage: genrePlaceholders.lofi.hero,
    thumbnailImage: genrePlaceholders.lofi.thumb,
    bgClass: 'bg-gradient-to-br from-amber-900 via-orange-900 to-red-900',
    cardBgClass: 'bg-gradient-to-br from-amber-800/20 to-orange-800/20',
    accentColor: 'rgb(251, 191, 36)', // amber-400
    audioExamples: [
      {
        title: 'Coffee Shop Dreams - Chill Vibes',
        src: createSilentAudio(232), // 3:52 in seconds
        duration: '3:52'
      },
      {
        title: 'Rainy Day Study - Peaceful Beat',
        src: createSilentAudio(258), // 4:18 in seconds
        duration: '4:18'
      },
      {
        title: 'Sunset Memories - Nostalgic Lo-Fi',
        src: createSilentAudio(306), // 5:06 in seconds
        duration: '5:06'
      }
    ],
    characteristics: [
      'Vinyl-crackle og tape-saturasjon',
      'Myke, muffede trommer',
      'Jazzy akkorder og melodier',
      'Nostalgisk atmosfære',
      'Perfekt for studier og arbeid',
      'Repetitive, hypnotiske grooves'
    ],
    pricing: {
      basic: 500,
      premium: 500,
      exclusive: 500
    }
  },
  {
    id: 'soundscape',
    slug: 'soundscape',
    title: 'Soundscape',
    shortDescription: 'Cinematiske lydlandskap og atmosfærisk musikk for film og media',
    description: [
      'Soundscape-komposisjoner er immersive lydopplevelser designet for å fortelle historier og skape følelser. Dette er musikk som maler bilder og bygger verdener.',
      'Jeg spesialiserer meg på å skape cinematiske lydlandskap for film, dokumentarer, podcasts og andre medieprosjekter. Hver komposisjon er skreddersydd for å støtte og forsterke det visuelle innholdet.',
      'Gjennom en kombinasjon av organiske og elektroniske elementer, field recordings og moderne produksjonsteknikker, skaper jeg lydbilder som transporterer lytteren til nye verdener og følelsestilstander.'
    ],
    heroImage: genrePlaceholders.soundscape.hero,
    thumbnailImage: genrePlaceholders.soundscape.thumb,
    bgClass: 'bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900',
    cardBgClass: 'bg-gradient-to-br from-slate-800/20 to-gray-800/20',
    accentColor: 'rgb(148, 163, 184)', // slate-400
    audioExamples: [
      {
        title: 'Arctic Winds - Cinematic Atmosphere',
        src: createSilentAudio(393), // 6:33 in seconds
        duration: '6:33'
      },
      {
        title: 'Urban Decay - Dark Ambient',
        src: createSilentAudio(347), // 5:47 in seconds
        duration: '5:47'
      },
      {
        title: 'Ocean Deep - Underwater Soundscape',
        src: createSilentAudio(441), // 7:21 in seconds
        duration: '7:21'
      }
    ],
    characteristics: [
      'Cinematiske arrangementer',
      'Field recordings og naturtoner',
      'Dramatiske dynamikker',
      'Evolving lydteksturer',
      'Perfekt for film og media',
      'Emosjonelt engasjerende'
    ],
    pricing: {
      basic: 400,
      premium: 400,
      exclusive: 400
    }
  }
];

// Helper functions
export const getGenreBySlug = (slug: string): Genre | undefined => {
  return genreData.find(genre => genre.slug === slug);
};

export const getAllGenreSlugs = (): string[] => {
  return genreData.map(genre => genre.slug);
};

export const getGenresByIds = (ids: string[]): Genre[] => {
  return genreData.filter(genre => ids.includes(genre.id));
}; 