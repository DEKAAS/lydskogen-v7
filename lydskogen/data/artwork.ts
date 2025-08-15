import { ArtworkItem } from '@/types/services';

// Function to get uploaded artwork from API
export async function getUploadedArtwork(): Promise<ArtworkItem[]> {
  try {
    const response = await fetch('/api/artwork')
    const data = await response.json()
    return data.artwork || []
  } catch (error) {
    console.error('Error fetching uploaded artwork:', error)
    return []
  }
}

export const artworkItems: ArtworkItem[] = [
  {
    id: 'natura-10',
    title: 'Natura Essence',
    category: 'gallery',
    price: 200,
    imageUrl: '/images/artwork/10_Natura_2.png',
    description: 'Organiske former og naturinspirerte teksturer som fanger essensen av vill natur',
    tags: ['natura', 'organic', 'nature', 'abstract']
  },
  {
    id: 'natura-26',
    title: 'Natura Flow',
    category: 'gallery',
    price: 200,
    imageUrl: '/images/artwork/26_Natura_4.png',
    description: 'Flytende bevegelser som speiler naturens rytmer og cykler',
    tags: ['natura', 'flow', 'movement', 'rhythmic']
  },
  {
    id: 'natura-29',
    title: 'Natura Harmony',
    category: 'gallery',
    price: 200,
    imageUrl: '/images/artwork/29_Natura.png',
    description: 'Harmoniske komposisjoner inspirert av naturens balanse',
    tags: ['natura', 'harmony', 'balance', 'composition']
  },
  {
    id: 'natura-31',
    title: 'Natura Spirit',
    category: 'gallery',
    price: 200,
    imageUrl: '/images/artwork/31_Natura.png',
    description: 'Spirituelle uttrykk gjennom naturens kraft og skjønnhet',
    tags: ['natura', 'spiritual', 'powerful', 'beauty']
  },
  {
    id: 'natura-34',
    title: 'Natura Dreams',
    category: 'gallery',
    price: 200,
    imageUrl: '/images/artwork/34_Natura_1.png',
    description: 'Drømmeaktige scener som vekker indre naturbilder',
    tags: ['natura', 'dreams', 'ethereal', 'inner']
  },
  {
    id: 'natura-41',
    title: 'Natura Mystique',
    category: 'gallery',
    price: 200,
    imageUrl: '/images/artwork/41_Natura.png',
    description: 'Mystiske naturlandskap som åpner for kontemplasjon',
    tags: ['natura', 'mystique', 'landscape', 'contemplative']
  },
  {
    id: 'natura-42',
    title: 'Natura Serenity',
    category: 'gallery',
    price: 200,
    imageUrl: '/images/artwork/42_Natura.png',
    description: 'Rolige naturscener som skaper fred og stillhet',
    tags: ['natura', 'serenity', 'peaceful', 'stillness']
  },
  {
    id: 'natura-45',
    title: 'Natura Vitality',
    category: 'gallery',
    price: 200,
    imageUrl: '/images/artwork/45_Natura.png',
    description: 'Livskraftige uttrykk som feirer naturens energi',
    tags: ['natura', 'vitality', 'energy', 'celebration']
  },
  {
    id: 'natura-50',
    title: 'Natura Transcendence',
    category: 'gallery',
    price: 200,
    imageUrl: '/images/artwork/50_Natura.png',
    description: 'Transcendente opplevelser gjennom naturens mysterier',
    tags: ['natura', 'transcendent', 'mysteries', 'experience']
  },
  {
    id: 'natura-59-4k',
    title: 'Natura Vision 4K',
    category: 'gallery',
    price: 300,
    imageUrl: '/images/artwork/59_Natura_4k.png',
    description: 'Høyoppløselig naturvision i krystallklar 4K-kvalitet',
    tags: ['natura', 'vision', '4k', 'high-res', 'premium']
  },
  {
    id: 'custom-design-1',
    title: 'Skreddersydd Design',
    category: 'custom',
    price: 350,
    imageUrl: '', // Empty imageUrl will trigger placeholder
    description: 'Vi lager et unikt design basert på din musikk og visjon',
    tags: ['custom', 'unique', 'personalized']
  },
  {
    id: 'custom-design-2',
    title: 'Premium Custom',
    category: 'custom',
    price: 500,
    imageUrl: '', // Empty imageUrl will trigger placeholder
    description: 'Premium skreddersydd design med flere konsepter og revisjoner',
    tags: ['custom', 'premium', 'concepts', 'revisions']
  }
];

// Kategorier for filtering
export const artworkCategories = [
  { id: 'all', name: 'Alle', count: artworkItems.length },
  { id: 'gallery', name: 'Galleri', count: artworkItems.filter(item => item.category === 'gallery').length },
  { id: 'custom', name: 'Skreddersydd', count: artworkItems.filter(item => item.category === 'custom').length }
];

// Tags for filtering
export const artworkTags = [
  'natura', 'organic', 'nature', 'abstract', 'flow', 'harmony', 'spiritual', 
  'dreams', 'mystique', 'serenity', 'vitality', 'transcendent', '4k', 'custom'
];

// Helper functions
export const getArtworkById = (id: string): ArtworkItem | undefined => {
  return artworkItems.find(item => item.id === id);
};

export const getArtworkByCategory = (category: string): ArtworkItem[] => {
  if (category === 'all') return artworkItems;
  return artworkItems.filter(item => item.category === category);
};

export const searchArtwork = (query: string): ArtworkItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return artworkItems.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) ||
    item.description?.toLowerCase().includes(lowercaseQuery)
  );
}; 