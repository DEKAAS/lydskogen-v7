import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface PortfolioProjectRow {
  id: string
  title: string
  artist: string | null
  description: string | null
  artwork_url: string
  spotify_url: string | null
  website_url: string | null
  music_url: string | null
  youtube_url: string | null
  tags: string[] | null
  credits: string[] | null
  created_at: string
  updated_at: string
}

const mapProject = (row: PortfolioProjectRow) => ({
  id: row.id,
  title: row.title,
  artist: row.artist ?? undefined,
  description: row.description ?? '',
  artworkUrl: row.artwork_url,
  spotifyUrl: row.spotify_url ?? undefined,
  websiteUrl: row.website_url ?? undefined,
  musicUrl: row.music_url ?? undefined,
  youtubeUrl: row.youtube_url ?? undefined,
  tags: row.tags ?? [],
  credits: row.credits ?? [],
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

const handleError = (message: string, error?: unknown, status = 500) => {
  console.error(`[projects] ${message}`, error)
  return NextResponse.json({ error: message }, { status })
}

const validatePayload = (body: any) => {
  if (!body?.title || !body?.artworkUrl) {
    return 'Title and artwork URL are required'
  }
  return null
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return handleError('Failed to load projects', error)
  }

  return NextResponse.json({
    projects: (data ?? []).map(mapProject)
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validationError = validatePayload(body)
    if (validationError) {
      return handleError(validationError, undefined, 400)
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .insert({
        title: body.title,
        artist: body.artist || null,
        description: body.description || null,
        artwork_url: body.artworkUrl,
        spotify_url: body.spotifyUrl || null,
        website_url: body.websiteUrl || null,
        music_url: body.musicUrl || null,
        youtube_url: body.youtubeUrl || null,
        tags: Array.isArray(body.tags) ? body.tags : [],
        credits: Array.isArray(body.credits) ? body.credits : []
      })
      .select()
      .single()

    if (error || !data) {
      return handleError('Kunne ikke lagre prosjektet', error)
    }

    return NextResponse.json({ ok: true, project: mapProject(data) })
  } catch (error) {
    return handleError('Ugyldig forespørsel', error, 400)
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    if (!body?.id) {
      return handleError('ID er påkrevd for oppdatering', undefined, 400)
    }

    const updates = {
      title: body.title,
      artist: body.artist ?? null,
      description: body.description ?? null,
      artwork_url: body.artworkUrl,
      spotify_url: body.spotifyUrl ?? null,
      website_url: body.websiteUrl ?? null,
      music_url: body.musicUrl ?? null,
      youtube_url: body.youtubeUrl ?? null,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      credits: Array.isArray(body.credits) ? body.credits : undefined
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single()

    if (error || !data) {
      return handleError('Kunne ikke oppdatere prosjektet', error)
    }

    return NextResponse.json({ ok: true, project: mapProject(data) })
  } catch (error) {
    return handleError('Ugyldig forespørsel', error, 400)
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    if (!body?.id) {
      return handleError('ID er påkrevd for sletting', undefined, 400)
    }

    const { error } = await supabaseAdmin
      .from('portfolio_projects')
      .delete()
      .eq('id', body.id)

    if (error) {
      return handleError('Kunne ikke slette prosjektet', error)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return handleError('Ugyldig forespørsel', error, 400)
  }
}
