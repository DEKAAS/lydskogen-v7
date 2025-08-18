import { ServiceData } from '../types';

// Lydskog hovedtjenester med detaljert informasjon
export const services: ServiceData[] = [
  {
    id: 'mixing',
    title: 'Miksing',
    description: 'Profesjonell miksing som løfter musikken din til et nytt nivå med krystallklar lyd og perfekt balanse.',
    detailedDescription: 'Våre erfarne lydteknikere bruker de nyeste teknologiene og teknikker for å skape en miksing som fremhever det beste i musikken din. Vi arbeider med alle sjangre og tilpasser tilnærmingen til hver enkelt låt.',
    priceRange: 'Fra 1500 kr per låt',
    image: '/images/mixing-service.svg',
    cta: {
      text: 'Les mer om miksing',
      link: '/tjenester/miksing'
    },
    bgClass: 'bg-gradient-ambient', // Fixed gradient name
    category: 'mixing',
    features: [
      'Profesjonell miksing i høykvalitets studio',
      'Bruk av premium utstyr og plugins',
      'Opptil 3 revisjoner inkludert',
      'Leveranse i ønsket format (WAV, MP3, etc.)',
      'Stereo og mono versjoner',
      'Mastering-klar fil'
    ],
    duration: '3-5 virkedager'
  },
  {
    id: 'artwork',
    title: 'Grafisk Design',
    description: 'Kreativ og profesjonell grafisk design som gir musikken din den visuelle identiteten den fortjener.',
    detailedDescription: 'Fra album covers til promomateriell - vi skaper visuell identitet som matcher musikken din. Våre designere forstår musikkens følelser og omsetter dem til kraftfull visuell kommunikasjon.',
    priceRange: 'Fra 2000 kr',
    image: '/images/artwork-service.svg',
    cta: {
      text: 'Se designportefølje',
      link: '/tjenester/grafisk-design'
    },
    bgClass: 'bg-gradient-hiphop', // Hip-hop gradient for artwork
    category: 'artwork',
    features: [
      'Album cover design i høy oppløsning',
      'Tilpasset design for streaming-plattformer',
      'Print-klar versjon for fysiske utgivelser',
      'Sosiale medier-varianter inkludert',
      'Opptil 3 konseptrevisjoner',
      'Originalfiler og rettighetsdokumentasjon'
    ],
    duration: '1-2 uker'
  },
  {
    id: 'production',
    title: 'Produksjon',
    description: 'Fullservice musikkproduksjon fra idé til ferdig låt med våre erfarne produsenter og musikere.',
    detailedDescription: 'Vi følger deg gjennom hele produksjonsprosessen, fra de første ideene til den ferdige låten. Med vårt nettverk av talentfulle musikere og vår tekniske ekspertise, skaper vi musikk som når sitt fulle potensial.',
    priceRange: 'Fra 5000 kr per låt',
    image: '/images/production-service.svg',
    cta: {
      text: 'Start produksjon',
      link: '/tjenester/produksjon'
    },
    bgClass: 'bg-gradient-lofi', // Lo-fi gradient for production
    category: 'production',
    features: [
      'Komplett produksjon fra start til slutt',
      'Tilgang til profesjonelle musikere',
      'Komponering og arrangering',
      'Innspilling i vårt studio',
      'Miksing og mastering inkludert',
      'Kreativ support og veiledning'
    ],
    duration: '2-4 uker'
  },
  {
    id: 'artist-page',
    title: 'Artist Nettsider',
    description: 'Profesjonelle nettsider som gir artistene en sterk digital tilstedeværelse og direkte kontakt med fans.',
    detailedDescription: 'En dedikert nettside gir artistene full kontroll over sin digitale tilstedeværelse. Vi bygger responsive, moderne nettsider som integrerer musikk, sosiale medier og fanengasjement på en seamless måte.',
    priceRange: 'Fra 8000 kr',
    image: '/images/artist-page-service.svg',
    cta: {
      text: 'Se eksempler',
      link: '/tjenester/artist-nettsider'
    },
    bgClass: 'bg-gradient-soundscape', // Soundscape gradient for artist pages
    category: 'artist',
    features: [
      'Responsive design for alle enheter',
      'Musikkspiller integrert på siden',
      'Sosiale medier integrasjon',
      'Konsert/event kalender',
      'Kontaktskjema og booking',
      'SEO-optimalisert for søkemotorer',
      'Hosting og support i 1 år inkludert'
    ],
    duration: '2-3 uker'
  }
];

// Gruppering av tjenester for enklere håndtering
export const servicesByCategory = {
  mixing: services.filter(service => service.category === 'mixing'),
  artwork: services.filter(service => service.category === 'artwork'),
  production: services.filter(service => service.category === 'production'),
  artist: services.filter(service => service.category === 'artist')
};

// Featured services for hero/landing sections
export const featuredServices = services.filter(service => 
  ['mixing', 'artwork'].includes(service.category)
);

// Service lookup utility
export const getServiceById = (id: string): ServiceData | undefined => {
  return services.find(service => service.id === id);
};

// Service titles for navigation/forms
export const serviceOptions = services.map(service => ({
  value: service.id,
  label: service.title
})); 