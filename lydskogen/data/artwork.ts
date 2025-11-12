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

// Artwork items kommer fra admin-panelet via API
// Hardkodede items er fjernet for å unngå forvirring
export const artworkItems: ArtworkItem[] = [];

// Kategorier for filtering (oppdateres dynamisk fra API)
export const artworkCategories = [
  { id: 'all', name: 'Alle', count: 0 },
  { id: 'gallery', name: 'Galleri', count: 0 },
  { id: 'custom', name: 'Skreddersydd', count: 0 }
];

// Tags for filtering (oppdateres dynamisk fra API)
export const artworkTags: string[] = [];

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