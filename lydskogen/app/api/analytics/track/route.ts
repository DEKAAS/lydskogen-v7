import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Handle both schemas (legacy useAnalytics vs new tracker)
    const { path, pageUrl, referrer, sessionId, deviceType } = body;
    
    const pagePath = path || pageUrl; // Support both
    
    const headersList = await headers();
    
    // Get IP from headers (works on Vercel)
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    // Optional: Geo lookup (vercel headers often have this)
    const country = headersList.get('x-vercel-ip-country') || 'Unknown';
    const city = headersList.get('x-vercel-ip-city') || 'Unknown';
    
    // Determine device type if not provided
    let detectedDevice = deviceType;
    if (!detectedDevice && userAgent) {
        detectedDevice = /Mobi|Android/i.test(userAgent) ? 'mobile' : 'desktop';
    }

    const { error } = await supabaseAdmin
      .from('site_visits')
      .insert({
        page_path: pagePath,
        referrer,
        session_id: sessionId,
        ip_address: ip,
        user_agent: userAgent,
        country,
        city,
        device_type: detectedDevice
      });

    if (error) {
      console.error('Error tracking visit:', error);
      return NextResponse.json({ error: 'Track failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error tracking:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
