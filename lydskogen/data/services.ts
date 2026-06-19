import { ServiceSection, ServiceDetail, Genre, PricingPlan } from '@/types/services';

// Main service sections with color-coded design
export const serviceSections: ServiceSection[] = [
  {
    id: 'production',
    title: 'Musikkproduksjon',
    description: 'Spesialiserte musikktjenester innen fire unike genrer med fokus på kvalitet og kreativitet',
    backgroundColor: '#26244F',
    gradient: {
      from: '#26244F',
      to: '#2D2E5E'
    },
    cards: [
      {
        id: 'ambient',
        title: 'Ambient',
        description: 'Atmosfærisk og meditativ musikk',
        icon: '🌌',
        link: '/produksjon/ambient',
        category: 'production',
        gradient: { from: '#26244F', to: '#2D2E5E' },
        colors: { primary: '#26244F', secondary: '#2D2E5E', accent: '#4A4B7C' }
      },
      {
        id: 'hiphop',
        title: 'Hip-hop',
        description: 'Moderne beats og klassiske grooves',
        icon: '🎤',
        link: '/produksjon/hiphop',
        category: 'production',
        gradient: { from: '#26244F', to: '#2D2E5E' },
        colors: { primary: '#26244F', secondary: '#2D2E5E', accent: '#4A4B7C' }
      },
      {
        id: 'lofi',
        title: 'Lo-fi',
        description: 'Avslappende og nostalgiske lydbilder',
        icon: '📻',
        link: '/produksjon/lofi',
        category: 'production',
        gradient: { from: '#26244F', to: '#2D2E5E' },
        colors: { primary: '#26244F', secondary: '#2D2E5E', accent: '#4A4B7C' }
      },
      {
        id: 'soundscape',
        title: 'Soundscape',
        description: 'Immersive lydopplevelser og naturlyder',
        icon: '🏞️',
        link: '/produksjon/soundscape',
        category: 'production',
        gradient: { from: '#26244F', to: '#2D2E5E' },
        colors: { primary: '#26244F', secondary: '#2D2E5E', accent: '#4A4B7C' }
      }
    ]
  },
  {
    id: 'mixing',
    title: 'Miksing & Mastering',
    description: 'Profesjonell behandling som løfter musikken din til neste nivå',
    backgroundColor: '#1F4036',
    gradient: {
      from: '#1F4036',
      to: '#2B594E'
    },
    cards: [
      {
        id: 'mixing',
        title: 'Miksing',
        description: 'Profesjonell miksing av dine spor',
        icon: '🎛️',
        link: '/tjenester/miksing',
        category: 'mixing',
        gradient: { from: '#1F4036', to: '#2B594E' },
        colors: { primary: '#1F4036', secondary: '#2B594E', accent: '#3B7F6B' }
      },
      {
        id: 'mastering',
        title: 'Mastering',
        description: 'Kommer snart - final polish av musikken',
        icon: '🎯',
        link: '/tjenester/mastering',
        category: 'mixing',
        gradient: { from: '#1F4036', to: '#2B594E' },
        colors: { primary: '#1F4036', secondary: '#2B594E', accent: '#3B7F6B' }
      }
    ]
  },
  {
    id: 'design',
    title: 'Visuell Design',
    description: 'Kreativ design som gir musikken din en visuell identitet',
    backgroundColor: '#3C1F1F',
    gradient: {
      from: '#3C1F1F',
      to: '#522828'
    },
    cards: [
      {
        id: 'artwork',
        title: 'Artwork Galleri',
        description: 'Ferdigdesignet artwork fra galleriet',
        icon: '🎨',
        link: '/tjenester/artwork',
        category: 'design',
        gradient: { from: '#3C1F1F', to: '#522828' },
        colors: { primary: '#3C1F1F', secondary: '#522828', accent: '#6B3535' }
      },
      {
        id: 'custom-design',
        title: 'Egenprodusert Design',
        description: 'Skreddersydd visuell identitet',
        icon: '✨',
        link: '/tjenester/custom-design',
        category: 'design',
        gradient: { from: '#3C1F1F', to: '#522828' },
        colors: { primary: '#3C1F1F', secondary: '#522828', accent: '#6B3535' }
      }
    ]
  },
  {
    id: 'projects',
    title: 'Helhetlige Prosjekter',
    description: 'Komplett oppfølging fra kreativ ide til ferdig lansering',
    backgroundColor: '#3C2B4F',
    gradient: {
      from: '#3C2B4F',
      to: '#5C3D78'
    },
    cards: [
      {
        id: 'artistpage',
        title: 'Artist-side',
        description: 'Enkel og profesjonell artistprofil',
        icon: '✦',
        link: '/tjenester/artistside',
        category: 'projects',
        gradient: { from: '#3C2B4F', to: '#5C3D78' },
        colors: { primary: '#3C2B4F', secondary: '#5C3D78', accent: '#7A5295' }
      },
      {
        id: 'fullpackage',
        title: 'Fullpakke',
        description: 'Kombiner flere tjenester for best resultat',
        icon: '🚀',
        link: '/tjenester/fullpakke',
        category: 'projects',
        gradient: { from: '#3C2B4F', to: '#5C3D78' },
        colors: { primary: '#3C2B4F', secondary: '#5C3D78', accent: '#7A5295' }
      }
    ]
  }
];

// Detailed service information
export const serviceDetails: Record<string, ServiceDetail> = {
  mixing: {
    id: 'mixing',
    title: 'Profesjonell Miksing',
    description: 'Få musikken din til å låte profesjonell med våre miksingtjenester',
    longDescription: 'Miksing er kunsten å balansere og polere de individuelle sporene i en opptagelse. Vi bruker avanserte teknikker som EQ, kompresjon, reverb og spatial processing for å skape en sammenhengefull og kraftfull lydopplevelse.',
    features: [
      'Profesjonell EQ og frekvensbalansering',
      'Dynamisk behandling med kompresjon og limiting',
      'Spatial processing og panorering',
      'Kreativ bruk av effekter og reverb',
      'Stereo imaging og bredde-optimalisering',
      'Inntil 3 runder med revisjoner inkludert'
    ],
    pricing: [
      {
        id: 'single',
        name: 'Enkelt Spor',
        price: 400,
        period: 'one-time',
        features: ['1 mikset spor', '3 revisjoner', '48-72t levering'],
        description: 'Perfekt for singler eller enkeltspor'
      },
      {
        id: 'package',
        name: 'Pakke (4 spor)',
        price: 1200,
        period: 'one-time',
        features: ['4 miksede spor', '3 revisjoner per spor', 'Konsistent lydprofil'],
        description: 'Spar 400 kr på EP eller album',
        isPopular: true
      }
    ],
    faq: [
      {
        question: 'Hvor lang tid tar miksing?',
        answer: 'Enkeltspor leveres vanligvis innen 48-72 timer. Pakker kan ta 5-7 dager avhengig av kompleksitet.'
      },
      {
        question: 'Hvilke filformater leveres?',
        answer: 'Du får høykvalitets WAV-filer (24-bit/48kHz) samt MP3 for streaming og deling.'
      },
      {
        question: 'Kan jeg få revisjoner?',
        answer: 'Ja, inntil 3 revisjoner er inkludert i prisen for å sikre at du er fornøyd med resultatet.'
      }
    ],
    colors: {
      primary: '#1F4036',
      secondary: '#2B594E',
      gradient: { from: '#1F4036', to: '#2B594E' }
    }
  },
  artistside: {
    id: 'artistside',
    title: 'Artist-side',
    description: 'Profesjonell artistprofil med bio, musikklenker, visuelt uttrykk og kontakt',
    longDescription: 'En skreddersydd Artist-side fungerer som ditt digitale hjem. Vi lager en enkel og responsiv nettside som presenterer artistprofilen din tydelig på alle enheter, med integrert hosting og domene.',
    features: [
      'Responsivt design optimalisert for alle enheter',
      'Integrerte sosiale medier og strømmelenker',
      'Kontaktskjema og bookingfunksjonalitet',
      'SEO-optimalisering for bedre synlighet',
      'SSL-sertifikat og sikker hosting',
      'Enkel administrasjon og oppdatering'
    ],
    pricing: [
      {
        id: 'setup',
        name: 'Oppstart',
        price: 700,
        period: 'one-time',
        features: ['Design og utvikling', 'Domene inkludert første år', 'SSL og hosting oppsett'],
        description: 'Engangskostnad for design og lansering'
      },
      {
        id: 'basic',
        name: 'Basis',
        price: 59,
        period: 'monthly',
        features: ['Hosting og vedlikehold', 'Innholdsoppdateringer', 'Teknisk support'],
        description: 'Månedlig abonnement for drift og vedlikehold'
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 99,
        period: 'monthly',
        features: ['Alt fra Basis', 'Designjusteringer', 'Prioritert support', 'Ekstra domene'],
        description: 'Utvidet pakke med designendringer',
        isPopular: true
      }
    ],
    faq: [
      {
        question: 'Kan jeg få fullt eierskap til siden?',
        answer: 'Ja, du kan velge å få full kontroll og eksportere siden hvis du ønsker det.'
      },
      {
        question: 'Hvor lang tid tar det å lage siden?',
        answer: 'Vanligvis 5-10 arbeidsdager fra design til lansering, avhengig av kompleksitet.'
      },
      {
        question: 'Kan jeg oppdatere innhold selv?',
        answer: 'Med Basis-planen håndterer vi oppdateringer. Med Pro kan du få tilgang til administrasjonspanel.'
      }
    ],
    colors: {
      primary: '#3C2B4F',
      secondary: '#5C3D78',
      gradient: { from: '#3C2B4F', to: '#5C3D78' }
    }
  }
};

// Genre data for music production
export const genres: Record<string, Genre> = {
  ambient: {
    id: 'ambient',
    name: 'Ambient',
    description: 'Atmosfærisk og meditativ musikk som skaper rom for refleksjon',
    inspiration: 'Inspirert av naturens egne lydbilder og moderne elektronisk produksjon',
    examples: [
      {
        title: 'Drifting Thoughts',
        audioUrl: '/audio/ambient-example-1.mp3',
        description: 'Meditativ ambient med naturlyder'
      },
      {
        title: 'Digital Forest',
        audioUrl: '/audio/ambient-example-2.mp3',
        description: 'Elektronisk atmosfære med organiske elementer'
      }
    ],
    colors: {
      gradient: { from: '#1c1f1f', to: '#202426' }
    }
  },
  hiphop: {
    id: 'hiphop',
    name: 'Hip-hop',
    description: 'Moderne beats som kombinerer klassiske grooves med ny teknologi',
    inspiration: 'Fra golden age til moderne trap - vi lager beats som beveger både hodet og hjertet',
    examples: [
      {
        title: 'Urban Nights',
        audioUrl: '/audio/hiphop-example-1.mp3',
        description: 'Moderne trap-inspirert beat'
      },
      {
        title: 'Boom Bap Classic',
        audioUrl: '/audio/hiphop-example-2.mp3',
        description: 'Klassisk hip-hop groove'
      }
    ],
    colors: {
      gradient: { from: '#202426', to: '#2b2b2b' }
    }
  },
  lofi: {
    id: 'lofi',
    name: 'Lo-fi',
    description: 'Avslappende og nostalgiske lydbilder perfekt for fokus og avslapning',
    inspiration: 'Vinyl-varme og nostalgiske stemninger som tar deg tilbake til enklere tider',
    examples: [
      {
        title: 'Rainy Afternoon',
        audioUrl: '/audio/lofi-example-1.mp3',
        description: 'Avslappende lo-fi med regn'
      },
      {
        title: 'Study Session',
        audioUrl: '/audio/lofi-example-2.mp3',
        description: 'Fokuserende lo-fi beat'
      }
    ],
    colors: {
      gradient: { from: '#202426', to: '#1a1d1b' }
    }
  },
  soundscape: {
    id: 'soundscape',
    name: 'Soundscape',
    description: 'Immersive lydopplevelser som transporterer lytteren til andre verdener',
    inspiration: 'Naturens egne symfonier møter moderne lyddesign for å skape uforglemmelige opplevelser',
    examples: [
      {
        title: 'Ocean Dreams',
        audioUrl: '/audio/soundscape-example-1.mp3',
        description: 'Beroligende havlyder med elektroniske elementer'
      },
      {
        title: 'Forest Cathedral',
        audioUrl: '/audio/soundscape-example-2.mp3',
        description: 'Mystisk skogsatmosfære'
      }
    ],
    colors: {
      gradient: { from: '#1e2221', to: '#101312' }
    }
  }
}; 