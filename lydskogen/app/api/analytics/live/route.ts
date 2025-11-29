import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Get active visitors (hits in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    // 1. Active Visitors Count (approximate via hits)
    const { count: activeVisitors } = await supabaseAdmin
      .from('site_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', fiveMinutesAgo)
      
    // 2. Recent Views (Last Hour)
    const { count: recentViews } = await supabaseAdmin
      .from('site_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneHourAgo)

    // 3. Get distinct active pages (Top Current Pages)
    const { data: activeHits } = await supabaseAdmin
      .from('site_visits')
      .select('page_path')
      .gte('created_at', fiveMinutesAgo)

    const currentPages: Record<string, number> = {}
    activeHits?.forEach((hit: any) => {
      const page = hit.page_path || '/'
      currentPages[page] = (currentPages[page] || 0) + 1
    })

    const topCurrentPages = Object.entries(currentPages)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([page, count]) => ({
        page,
        viewers: count as number
      }))

    // 4. Mock data for events/sessions since we simplified the architecture
    // In a real scenario, we'd join with an events table or query it separately
    const recentEvents = 0;
    const recentEventsList: any[] = [];
    const activeSessions: any[] = []; 

    return NextResponse.json({
      activeVisitors: activeVisitors || 0,
      recentViews: recentViews || 0,
      recentEvents: recentEvents,
      topCurrentPages,
      activeSessions: activeSessions,
      recentEventsList: recentEventsList,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching live analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch live analytics' }, { status: 500 })
  }
}
