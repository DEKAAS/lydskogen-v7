import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: backgrounds, error } = await supabaseAdmin
      .from('genre_backgrounds')
      .select('genre_id, background_image_url')

    if (error) {
      console.error('Error fetching genre backgrounds:', error)
      return NextResponse.json({ backgrounds: {} })
    }

    // Transform to Record<genre_id, background_url>
    const backgroundsMap: Record<string, string> = {}
    backgrounds.forEach(bg => {
      backgroundsMap[bg.genre_id] = bg.background_image_url
    })

    return NextResponse.json({ backgrounds: backgroundsMap })

  } catch (error) {
    console.error('Error fetching genre backgrounds:', error)
    return NextResponse.json({ backgrounds: {} })
  }
}

