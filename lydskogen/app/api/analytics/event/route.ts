import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { 
      sessionId, 
      eventType, 
      eventName, 
      pageUrl, 
      elementSelector, 
      elementText, 
      properties 
    } = await request.json()
    
    if (!sessionId || !eventType || !eventName || !pageUrl) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Insert event into database (simplified for existing table structure)
    const { data, error } = await supabaseAdmin
      .from('analytics_events')
      .insert({
        event_name: `${eventType}: ${eventName}`,
        event_data: {
          sessionId,
          eventType,
          pageUrl,
          elementSelector,
          elementText,
          properties
        },
        page_url: pageUrl
      })
      .select()

    if (error) {
      console.error('Error tracking event:', error)
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      event: data[0]
    })

  } catch (error) {
    console.error('Error in event tracking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}