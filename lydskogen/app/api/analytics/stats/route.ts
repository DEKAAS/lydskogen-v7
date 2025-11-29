import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

    // 1. Live Visitors (last 5 mins)
    // using session_id to count active users
    const { count: activeVisitors } = await supabaseAdmin
      .from('site_visits')
      .select('session_id', { count: 'exact', head: true })
      .gte('created_at', fiveMinutesAgo.toISOString())
    // Note: This is a rough estimate of "active" (hits in last 5m). 
    // Distinct sessions would be better but simple count is okay for MVP or use distinct.
    
    // Distinct sessions in last 5 mins for better accuracy
    const { data: recentSessions } = await supabaseAdmin
      .from('site_visits')
      .select('session_id')
      .gte('created_at', fiveMinutesAgo.toISOString());
    
    const uniqueActive = new Set(recentSessions?.map(s => s.session_id)).size;

    // 2. Total Views (30 days)
    const { count: totalViews } = await supabaseAdmin
      .from('site_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // 3. Daily Views (Last 30 days)
    const { data: dailyData } = await supabaseAdmin
      .from('site_visits')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    const dailyViewsMap = (dailyData || []).reduce((acc: Record<string, number>, view: any) => {
      const date = new Date(view.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    const dailyViews = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      dailyViews.push({
        date,
        views: dailyViewsMap[date] || 0
      })
    }

    // 4. Recent Visits Log (IP, Location, Time)
    const { data: recentVisits } = await supabaseAdmin
      .from('site_visits')
      .select('ip_address, city, country, created_at, page_path, device_type')
      .order('created_at', { ascending: false })
      .limit(50)

    // 5. Device Stats
    const { data: deviceData } = await supabaseAdmin
      .from('site_visits')
      .select('device_type')
      .gte('created_at', thirtyDaysAgo.toISOString())

    const deviceCounts = (deviceData || []).reduce((acc: Record<string, number>, view: any) => {
      const device = view.device_type || 'Unknown'
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {})

    const deviceStats = Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      count: count as number,
      percentage: Math.round(((count as number) / (totalViews || 1)) * 100)
    }))

    // 6. Geo Stats
    const { data: geoData } = await supabaseAdmin
      .from('site_visits')
      .select('country')
      .gte('created_at', thirtyDaysAgo.toISOString())

    const geoCounts = (geoData || []).reduce((acc: Record<string, number>, view: any) => {
      const country = view.country || 'Unknown'
      acc[country] = (acc[country] || 0) + 1
      return acc
    }, {})

    const geographicStats = Object.entries(geoCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([country, count]) => ({
        country,
        count: count as number,
        percentage: Math.round(((count as number) / (totalViews || 1)) * 100)
      }))

    return NextResponse.json({
      stats: {
        activeVisitors: uniqueActive,
        totalViews,
        dailyViews,
        recentVisits, // New field
        deviceStats,
        geographicStats,
        // Legacy fields placeholders to avoid breaking frontend immediately if it expects them
        uniqueVisitors: 0,
        avgSessionDuration: '0:00',
        bounceRate: 0,
        topPages: [],
        topEvents: [],
        referrerStats: [],
        hourlyViews: []
      }
    })

  } catch (error) {
    console.error('Error fetching analytics stats:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
