import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Admin artwork API: Starting fetch...')
    const { data: artworkItems, error } = await supabaseAdmin
      .from('artwork_items')
      .select('*')
      .order('uploaded_at', { ascending: false })

    console.log('Admin artwork API: Query result:', { data: artworkItems, error })

    if (error) {
      console.error('Error fetching artwork items:', error)
      return NextResponse.json({ artwork: [] })
    }

    // Transform database format to frontend format
    const transformedArtwork = artworkItems.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      imageUrl: item.image_url,
      description: item.description,
      tags: item.tags,
      uploadedAt: item.uploaded_at,
      isNew: item.is_new,
      status: item.status
    }))

    return NextResponse.json({ artwork: transformedArtwork })

  } catch (error) {
    console.error('Error fetching artwork items:', error)
    return NextResponse.json({ artwork: [] })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // First get the artwork item to find the image URL
    const { data: artwork, error: fetchError } = await supabaseAdmin
      .from('artwork_items')
      .select('image_url')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching artwork:', fetchError)
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })
    }

    // Extract filename from URL to delete from storage
    const imageUrl = artwork.image_url
    const filename = imageUrl.split('/').pop()

    // Delete from storage
    if (filename) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('artwork-images')
        .remove([filename])

      if (storageError) {
        console.error('Error deleting from storage:', storageError)
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('artwork_items')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting artwork:', deleteError)
      return NextResponse.json({ error: 'Failed to delete artwork' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Artwork deleted successfully' })

  } catch (error) {
    console.error('Error deleting artwork:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const artworkItems = await request.json()

    if (!Array.isArray(artworkItems)) {
      return NextResponse.json({ error: 'Expected an array of artwork items' }, { status: 400 })
    }

    // Transform frontend format to database format
    const dbArtwork = artworkItems.map(item => ({
      title: item.title,
      category: item.category,
      price: item.price,
      image_url: item.image_url || item.imageUrl,
      description: item.description,
      tags: item.tags,
      is_new: item.is_new || false,
      status: item.status || 'available'
    }))

    const { data, error } = await supabaseAdmin
      .from('artwork_items')
      .insert(dbArtwork)
      .select()

    if (error) {
      console.error('Error inserting artwork items:', error)
      return NextResponse.json({ error: 'Failed to insert artwork items' }, { status: 500 })
    }

    // Transform response
    const transformedArtwork = data.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      imageUrl: item.image_url,
      description: item.description,
      tags: item.tags,
      uploadedAt: item.uploaded_at,
      isNew: item.is_new,
      status: item.status
    }))

    return NextResponse.json({ artwork: transformedArtwork })

  } catch (error) {
    console.error('Error inserting artwork items:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const { status, isNew } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updates: any = {}
    if (status !== undefined) updates.status = status
    if (isNew !== undefined) updates.is_new = isNew

    const { data, error } = await supabaseAdmin
      .from('artwork_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating artwork:', error)
      return NextResponse.json({ error: 'Failed to update artwork' }, { status: 500 })
    }

    // Transform response
    const transformedArtwork = {
      id: data.id,
      title: data.title,
      category: data.category,
      price: data.price,
      imageUrl: data.image_url,
      description: data.description,
      tags: data.tags,
      uploadedAt: data.uploaded_at,
      isNew: data.is_new,
      status: data.status
    }

    return NextResponse.json({ artwork: transformedArtwork })

  } catch (error) {
    console.error('Error updating artwork:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}