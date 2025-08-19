const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read environment variables from .env.local file manually
const envPath = path.join(__dirname, '../.env.local')
let supabaseUrl = ''
let supabaseServiceKey = ''

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')
  
  lines.forEach(line => {
    const [key, value] = line.split('=')
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      supabaseUrl = value
    }
    if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
      supabaseServiceKey = value
    }
  })
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please check .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const musicTracks = [
  {
    title: 'Midnight Waves',
    artist: 'Lydskog',
    genre: 'ambient',
    price: 299,
    audio_url: '/audio/ambient-sample.mp3', // placeholder - will need real audio files
    description: 'En rolig ambient-komposisjon som tar deg med på en reise gjennom stille nattlige landskap. Perfect for meditasjon og avslapning.',
    duration: '4:32',
    bpm: 70,
    key: 'Dm',
    tags: ['ambient', 'meditation', 'calm', 'atmospheric'],
    is_new: true,
    status: 'available'
  },
  {
    title: 'Urban Dreams',
    artist: 'Lydskog',
    genre: 'hip-hop',
    price: 399,
    audio_url: '/audio/hiphop-sample.mp3',
    description: 'Moderne hip-hop beat med kraftige drums og atmosfæriske synth-lag. Klar for vokal eller instrumentalt bruk.',
    duration: '3:45',
    bpm: 85,
    key: 'Gm',
    tags: ['hip-hop', 'urban', 'beats', 'modern'],
    is_new: true,
    status: 'available'
  },
  {
    title: 'Coffee Shop Vibes',
    artist: 'Lydskog',
    genre: 'lo-fi',
    price: 249,
    audio_url: '/audio/lofi-sample.mp3',
    description: 'Chill lo-fi track med varme vinyl-lyder og myke melodier. Perfect som bakgrunnsmusikk for arbeid eller avslapping.',
    duration: '3:12',
    bpm: 65,
    key: 'C',
    tags: ['lo-fi', 'chill', 'study', 'vinyl'],
    is_new: false,
    status: 'available'
  },
  {
    title: 'Forest Echoes',
    artist: 'Lydskog',
    genre: 'soundscape',
    price: 349,
    audio_url: '/audio/soundscape-sample.mp3',
    description: 'Naturlig lydlandskap med skoglyder, fuglekvitter og myke ambient-teksturer. Ideal for lyddesign og film.',
    duration: '5:18',
    bpm: null,
    key: null,
    tags: ['soundscape', 'nature', 'forest', 'ambient'],
    is_new: false,
    status: 'available'
  },
  {
    title: 'Neon Nights',
    artist: 'Lydskog',
    genre: 'ambient',
    price: 329,
    audio_url: '/audio/ambient-sample2.mp3',
    description: 'Synthwave-inspirert ambient med retrowave-elementer og atmospheriske pad-lyder.',
    duration: '4:05',
    bpm: 75,
    key: 'Am',
    tags: ['ambient', 'synthwave', 'retro', 'atmospheric'],
    is_new: false,
    status: 'available'
  },
  {
    title: 'Street Flow',
    artist: 'Lydskog',
    genre: 'hip-hop',
    price: 449,
    audio_url: '/audio/hiphop-sample2.mp3',
    description: 'Groovy hip-hop instrumentals med funky basslinjer og crisp drums. Ready for rap vocals.',
    duration: '3:28',
    bpm: 90,
    key: 'Em',
    tags: ['hip-hop', 'funky', 'groovy', 'rap'],
    is_new: true,
    status: 'available'
  }
]

const artworkItems = [
  {
    title: 'Abstract Dreams Album Cover',
    category: 'gallery',
    price: 599,
    image_url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=800&fit=crop',
    description: 'Moderne abstrakt albumcover med flytende former og vibrant fargepalet. Perfect for elektronisk musikk.',
    tags: ['abstract', 'album-cover', 'electronic', 'colorful'],
    is_new: true,
    status: 'available'
  },
  {
    title: 'Minimalist Logo Design',
    category: 'gallery',
    price: 799,
    image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=800&fit=crop',
    description: 'Clean og moderne logo-design med minimalistisk tilnærming. Skalerbart for alle plattformer.',
    tags: ['logo', 'minimalist', 'modern', 'branding'],
    is_new: true,
    status: 'available'
  },
  {
    title: 'Vintage Poster Art',
    category: 'gallery',
    price: 449,
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop',
    description: 'Retro-inspirert poster med vintage typografi og teksturer. Perfect for konsert-promotering.',
    tags: ['poster', 'vintage', 'retro', 'concert'],
    is_new: false,
    status: 'available'
  },
  {
    title: 'Digital Art Portrait',
    category: 'gallery',
    price: 699,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
    description: 'Digitalt kunstverk med moderne portrett-stil og kreativ fargebruk.',
    tags: ['digital-art', 'portrait', 'modern', 'creative'],
    is_new: false,
    status: 'available'
  },
  {
    title: 'Nature Album Cover',
    category: 'gallery',
    price: 549,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
    description: 'Naturinspirert albumcover med landskap og organiske elementer. Perfect for ambient/acoustic musikk.',
    tags: ['album-cover', 'nature', 'landscape', 'ambient'],
    is_new: false,
    status: 'available'
  },
  {
    title: 'Urban Street Art Design',
    category: 'gallery',
    price: 629,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
    description: 'Grafitti-inspirert design med urban street art estetikk og bold farger.',
    tags: ['street-art', 'urban', 'graffiti', 'bold'],
    is_new: true,
    status: 'available'
  }
]

async function populateDatabase() {
  console.log('Starting database population...')

  try {
    // Clear existing data first
    console.log('Clearing existing data...')
    await supabase.from('music_tracks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('artwork_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert music tracks
    console.log('Inserting music tracks...')
    const { data: musicData, error: musicError } = await supabase
      .from('music_tracks')
      .insert(musicTracks)

    if (musicError) {
      console.error('Error inserting music tracks:', musicError)
      return
    }
    console.log(`Successfully inserted ${musicTracks.length} music tracks`)

    // Insert artwork items
    console.log('Inserting artwork items...')
    const { data: artworkData, error: artworkError } = await supabase
      .from('artwork_items')
      .insert(artworkItems)

    if (artworkError) {
      console.error('Error inserting artwork items:', artworkError)
      return
    }
    console.log(`Successfully inserted ${artworkItems.length} artwork items`)

    console.log('Database population completed successfully!')

  } catch (error) {
    console.error('Error populating database:', error)
  }
}

populateDatabase()