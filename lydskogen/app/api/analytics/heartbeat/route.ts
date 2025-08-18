import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-client-ip') ||
    'unknown'
  )
}

function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase()
  
  if (/mobile|android|iphone/.test(ua)) return 'mobile'
  if (/tablet|ipad/.test(ua)) return 'tablet'
  return 'desktop'
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, pageUrl } = await request.json()
    
    if (!sessionId || !pageUrl) {
      return NextResponse.json({ 
        error: 'Session ID and page URL are required' 
      }, { status: 400 })
    }

    const userAgent = request.headers.get('user-agent') || ''
    const ipAddress = getClientIP(request)
    const deviceType = getDeviceType(userAgent)
    
    // Set country based on IP (simplified)
    let country = 'Unknown'
    if (ipAddress.startsWith('192.168.') || ipAddress === 'localhost' || ipAddress === '127.0.0.1') {
      country = 'Norway'
    }

    const now = new Date().toISOString()

    // Upsert active session (update if exists, insert if not)
    const { data, error } = await supabaseAdmin
      .from('active_sessions')
      .upsert({
        session_id: sessionId,
        page_url: pageUrl,
        last_seen: now,
        user_agent: userAgent,
        ip_address: ipAddress,
        country,
        device_type: deviceType
      }, {
        onConflict: 'session_id'
      })
      .select()

    if (error) {
      console.error('Error updating session:', error)
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
    }

    // Clean up old sessions (older than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    await supabaseAdmin
      .from('active_sessions')
      .delete()
      .lt('last_seen', fiveMinutesAgo)

    return NextResponse.json({ 
      success: true,
      timestamp: now
    })

  } catch (error) {
    console.error('Error in heartbeat tracking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}