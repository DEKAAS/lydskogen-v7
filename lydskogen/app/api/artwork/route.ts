import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: artworkItems, error } = await supabase
      .from('artwork_items')
      .select('*')
      .order('uploaded_at', { ascending: false })

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