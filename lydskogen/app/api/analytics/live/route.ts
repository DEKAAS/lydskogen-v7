import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Get active visitors (sessions active in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    
    const { count: activeVisitors } = await supabaseAdmin
      .from('active_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('last_activity', fiveMinutesAgo)

    // Get current active sessions with details
    const { data: activeSessions } = await supabaseAdmin
      .from('active_sessions')
      .select('*')
      .gte('last_activity', fiveMinutesAgo)
      .order('last_activity', { ascending: false })

    // Get page views in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count: recentViews } = await supabaseAdmin
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneHourAgo)

    // Get events in the last hour
    const { count: recentEvents } = await supabaseAdmin
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneHourAgo)

    // Get top pages being viewed right now (simplified since we don't store page_url in sessions)
    const currentPages: Record<string, number> = {
      '/': activeSessions?.length || 0
    }

    const topCurrentPages = Object.entries(currentPages)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([page, count]) => ({
        page,
        viewers: count as number
      }))

    // Get real-time events from last 5 minutes
    const { data: recentEventsList } = await supabaseAdmin
      .from('analytics_events')
      .select('*')
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      activeVisitors: activeVisitors || 0,
      recentViews: recentViews || 0,
      recentEvents: recentEvents || 0,
      topCurrentPages,
      activeSessions: activeSessions || [],
      recentEventsList: recentEventsList || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching live analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch live analytics' }, { status: 500 })
  }
}