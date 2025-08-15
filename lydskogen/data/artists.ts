export interface ArtistExample {
  id: string;
  name: string;
  genre: string;
  style: string;
  description: string;
  imageUrl: string;
  website?: string;
  features: string[];
  package: 'basic' | 'pro';
}

export const artistExamples: ArtistExample[] = [
  {
    id: 'erik-ambient',
    name: 'Erik Soundscapes',
    genre: 'Ambient',
    style: 'Atmosfærisk elektronika',
    description: 'Skaper rolige lydlandskap som tar lytteren med på en meditativ reise gjennom naturens harmoni.',
    imageUrl: '/images/artists/erik-ambient.jpg',
    website: 'eriksoundscapes.no',
    features: ['Streaming på alle plattformer', 'Profesjonell biografi', 'Sosiale medier setup'],
    package: 'basic'
  },
  {
    id: 'maya-lofi',
    name: 'Maya Beats',
    genre: 'Lo-Fi',
    style: 'Chill hop producer',
    description: 'Kombinerer nostalgiske samples med moderne beats, perfekt for studier og avslapning.',
    imageUrl: '/images/artists/maya-lofi.jpg',
    website: 'mayabeats.com',
    features: ['Premium streaming setup', 'Merkevarebygging', 'Månedlig markedsføring', 'Analytics dashboard'],
    package: 'pro'
  },
  {
    id: 'lars-hip-hop',
    name: 'Lars Urban',
    genre: 'Hip-Hop',
    style: 'Underground rap',
    description: 'Autentiske tekster og kraftfulle beats som reflekterer storbyens rhythm og sosiale dynamikk.',
    imageUrl: '/images/artists/lars-hip-hop.jpg',
    website: 'larsurban.no',
    features: ['Streaming på alle plattformer', 'Profesjonell biografi', 'Sosiale medier setup'],
    package: 'basic'
  },
  {
    id: 'nina-electronic',
    name: 'Nina Synthesis',
    genre: 'Electronic',
    style: 'Experimental techno',
    description: 'Utforsker grensene mellom organisk og syntetisk lyd med innovative produksjonsteknikker.',
    imageUrl: '/images/artists/nina-electronic.jpg',
    website: 'ninasynthesis.com',
    features: ['Premium streaming setup', 'Merkevarebygging', 'Månedlig markedsføring', 'Analytics dashboard'],
    package: 'pro'
  },
  {
    id: 'thomas-classical',
    name: 'Thomas Moderne',
    genre: 'Neo-Classical',
    style: 'Moderne komposisjon',
    description: 'Blander klassiske instrumenter med moderne produksjon for cinematiske opplevelser.',
    imageUrl: '/images/artists/thomas-classical.jpg',
    website: 'thomasmoderne.no',
    features: ['Streaming på alle plattformer', 'Profesjonell biografi', 'Sosiale medier setup'],
    package: 'basic'
  },
  {
    id: 'sara-folk',
    name: 'Sara Northern',
    genre: 'Folk Electronic',
    style: 'Nordic soundscapes',
    description: 'Kombinerer tradisjonelle nordiske melodier med moderne elektronisk behandling.',
    imageUrl: '/images/artists/sara-folk.jpg',
    website: 'saranorthern.com',
    features: ['Premium streaming setup', 'Merkevarebygging', 'Månedlig markedsføring', 'Analytics dashboard'],
    package: 'pro'
  }
];

export const artistPricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 59,
    period: 'mnd',
    setupFee: 700,
    popular: false,
    description: 'Perfekt for nye artister som vil komme i gang',
    features: [
      'Artistside på lydskog.no',
      'Streaming på alle store plattformer',
      'Profesjonell biografi og bilder',
      'Sosiale medier setup',
      'Månedsvis oppdatering av innhold',
      'Grunnleggende analytics',
      'E-post support'
    ],
    limitations: [
      'Maksimalt 5 låter per måned',
      'Standard template design'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    period: 'mnd',
    setupFee: 700,
    popular: true,
    description: 'For etablerte artister med profesjonelle ambisjoner',
    features: [
      'Alt fra Basic plan',
      'Skreddersydd artistside design',
      'Prioritert streaming distribution',
      'Avansert merkevarebygging',
      'Månedlig markedsføringsstrategi',
      'Detaljert analytics dashboard',
      'Sosiale medier automatisering',
      'Direktelinje til vårt team',
      'Playlist pitching service'
    ],
    limitations: [
      'Ubegrenset antall låter'
    ]
  }
];

export const artistFAQ = [
  {
    id: 'setup-time',
    question: 'Hvor lang tid tar det å sette opp en artistside?',
    answer: 'Vanligvis tar det 3-5 virkedager etter at vi har mottatt alt nødvendig materiale fra deg. Dette inkluderer bilder, biografi, musikk og eventuelle spesielle ønsker for design.'
  },
  {
    id: 'music-ownership',
    question: 'Beholder jeg rettighetene til musikken min?',
    answer: 'Absolutt! Du beholder alle rettigheter til din musikk. Vi er kun en teknisk partner som hjelper deg med distribusjon og presentasjon. Du eier alt innhold og kan når som helst avslutte samarbeidet.'
  },
  {
    id: 'platform-coverage',
    question: 'Hvilke streaming-plattformer får jeg tilgang til?',
    answer: 'Vi distribuerer til alle store plattformer: Spotify, Apple Music, YouTube Music, Tidal, Deezer, Amazon Music, og mange flere. Totalt over 150+ plattformer globalt.'
  },
  {
    id: 'analytics-access',
    question: 'Kan jeg se statistikk over mine streams og lyttere?',
    answer: 'Ja! Du får tilgang til detaljert analytics som viser streams, geografisk fordeling av lyttere, demografisk data, og inntekter. Pro-brukere får avansert analytics med dypereliggende innsikt.'
  },
  {
    id: 'cancellation',
    question: 'Kan jeg si opp abonnementet når som helst?',
    answer: 'Ja, du kan si opp når som helst uten binding. Ved oppsigelse forblir artistsiden aktiv til slutten av den betalte perioden. Musikken din forblir på streaming-plattformene.'
  },
  {
    id: 'support-included',
    question: 'Hvilken type support får jeg?',
    answer: 'Basic-brukere får e-post support med svar innen 24 timer. Pro-brukere får prioritert support med direktelinje til vårt team og raskere responstid på maksimalt 4 timer.'
  }
]; 