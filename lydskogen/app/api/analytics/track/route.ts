import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase()
  
  if (/mobile|android|iphone/.test(ua)) return 'mobile'
  if (/tablet|ipad/.test(ua)) return 'tablet'
  return 'desktop'
}

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('chrome')) return 'Chrome'
  if (ua.includes('firefox')) return 'Firefox'
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari'
  if (ua.includes('edge')) return 'Edge'
  if (ua.includes('opera')) return 'Opera'
  return 'Unknown'
}

function getClientIP(request: NextRequest): string {
  // Try different headers for IP address
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-client-ip') ||
    'unknown'
  )
}

export async function POST(request: NextRequest) {
  try {
    const { pageUrl, referrer, sessionId } = await request.json()
    
    if (!pageUrl) {
      return NextResponse.json({ error: 'Page URL is required' }, { status: 400 })
    }

    const userAgent = request.headers.get('user-agent') || ''
    const ipAddress = getClientIP(request)
    const deviceType = getDeviceType(userAgent)
    const browser = getBrowser(userAgent)

    // Generate session ID if not provided
    const finalSessionId = sessionId || uuidv4()

    // Try to get geographical info (simplified - in production you'd use a geo IP service)
    let country = 'Unknown'
    let city = 'Unknown'
    
    // For development, we'll set some mock geo data based on IP
    if (ipAddress.startsWith('192.168.') || ipAddress === 'localhost' || ipAddress === '127.0.0.1') {
      country = 'Norway'
      city = 'Oslo'
    }

    // Insert page view into database
    const { data, error } = await supabaseAdmin
      .from('page_views')
      .insert({
        page_url: pageUrl,
        referrer: referrer || null,
        user_agent: userAgent,
        ip_address: ipAddress,
        session_id: finalSessionId,
        country,
        city,
        device_type: deviceType,
        browser
      })
      .select()

    if (error) {
      console.error('Error tracking page view:', error)
      return NextResponse.json({ error: 'Failed to track page view' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      sessionId: finalSessionId,
      tracked: {
        pageUrl,
        deviceType,
        browser,
        country,
        city
      }
    })

  } catch (error) {
    console.error('Error in analytics tracking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}