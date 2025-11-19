import { NextRequest, NextResponse } from 'next/server'

// Spotify oEmbed API endpoint
const SPOTIFY_OEMBED_URL = 'https://embed.spotify.com/oembed'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const spotifyUrl = searchParams.get('url')

    if (!spotifyUrl) {
      return NextResponse.json({ error: 'Spotify URL is required' }, { status: 400 })
    }

    // Validate Spotify URL
    const spotifyUrlPattern = /^https?:\/\/(open|play)\.spotify\.com\/(track|album|playlist|artist)\/[a-zA-Z0-9]+/
    if (!spotifyUrlPattern.test(spotifyUrl)) {
      return NextResponse.json({ error: 'Invalid Spotify URL' }, { status: 400 })
    }

    // Fetch metadata from Spotify oEmbed API
    const oembedUrl = `${SPOTIFY_OEMBED_URL}?url=${encodeURIComponent(spotifyUrl)}`
    const response = await fetch(oembedUrl)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch Spotify metadata' }, { status: 500 })
    }

    const data = await response.json()

    // Extract relevant information
    const metadata = {
      title: data.title || '',
      artist: data.author || '',
      thumbnail: data.thumbnail_url || '',
      html: data.html || '', // Embed HTML
      url: spotifyUrl,
      type: extractType(spotifyUrl) // track, album, playlist, artist
    }

    return NextResponse.json({ metadata })

  } catch (error) {
    console.error('Error fetching Spotify metadata:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function extractType(url: string): string {
  if (url.includes('/track/')) return 'track'
  if (url.includes('/album/')) return 'album'
  if (url.includes('/playlist/')) return 'playlist'
  if (url.includes('/artist/')) return 'artist'
  return 'unknown'
}

