import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { AnalyticsStats } from '@/lib/supabase'

export async function GET() {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get total views (last 30 days)
    const { count: totalViews } = await supabaseAdmin
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get unique visitors (last 30 days)
    const { data: uniqueVisitorsData } = await supabaseAdmin
      .from('page_views')
      .select('session_id')
      .gte('created_at', thirtyDaysAgo.toISOString())

    const uniqueVisitors = new Set(uniqueVisitorsData?.map(v => v.session_id) || []).size

    // Get views from last week for comparison
    const { count: lastWeekViews } = await supabaseAdmin
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    // Calculate growth percentage
    const currentWeekViews = lastWeekViews || 0
    const previousWeekViews = (totalViews || 0) - currentWeekViews
    const growthPercentage = previousWeekViews > 0 
      ? Math.round(((currentWeekViews - previousWeekViews) / previousWeekViews) * 100) 
      : 0

    // Get top pages
    const { data: topPagesData } = await supabaseAdmin
      .from('page_views')
      .select('page_url')
      .gte('created_at', thirtyDaysAgo.toISOString())

    const pageCounts = (topPagesData || []).reduce((acc: Record<string, number>, view) => {
      acc[view.page_url] = (acc[view.page_url] || 0) + 1
      return acc
    }, {})

    const topPages = Object.entries(pageCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([page, views]) => ({
        page,
        views: views as number,
        percentage: Math.round(((views as number) / (totalViews || 1)) * 100)
      }))

    // Get daily views for the last 30 days
    const { data: dailyViewsData } = await supabaseAdmin
      .from('page_views')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    const dailyViewsMap = (dailyViewsData || []).reduce((acc: Record<string, number>, view) => {
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

    // Get device statistics
    const { data: deviceData } = await supabaseAdmin
      .from('page_views')
      .select('device_type')
      .gte('created_at', thirtyDaysAgo.toISOString())

    const deviceCounts = (deviceData || []).reduce((acc: Record<string, number>, view) => {
      const device = view.device_type || 'Unknown'
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {})

    const deviceStats = Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      count: count as number,
      percentage: Math.round(((count as number) / (totalViews || 1)) * 100)
    }))

    // Get geographic statistics
    const { data: geoData } = await supabaseAdmin
      .from('page_views')
      .select('country')
      .gte('created_at', thirtyDaysAgo.toISOString())

    const geoCounts = (geoData || []).reduce((acc: Record<string, number>, view) => {
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

    // Calculate average session duration (simplified - would need session tracking for accuracy)
    const avgSessionDuration = '3:42' // Placeholder for now

    // Calculate bounce rate (simplified)
    const bounceRate = 35 // Placeholder for now

    // Get active visitors (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { count: activeVisitors } = await supabaseAdmin
      .from('active_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', fiveMinutesAgo)

    // Get top events (last 30 days)
    const { data: eventsData } = await supabaseAdmin
      .from('analytics_events')
      .select('event_name')
      .gte('created_at', thirtyDaysAgo.toISOString())

    const eventCounts = (eventsData || []).reduce((acc: Record<string, number>, event) => {
      acc[event.event_name] = (acc[event.event_name] || 0) + 1
      return acc
    }, {})

    const topEvents = Object.entries(eventCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([event, count]) => ({
        event,
        count: count as number,
        percentage: Math.round(((count as number) / (eventsData?.length || 1)) * 100)
      }))

    // Get referrer statistics
    const { data: referrerData } = await supabaseAdmin
      .from('page_views')
      .select('referrer')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .not('referrer', 'is', null)

    const referrerCounts = (referrerData || []).reduce((acc: Record<string, number>, view) => {
      const domain = view.referrer ? new URL(view.referrer).hostname : 'Direct'
      acc[domain] = (acc[domain] || 0) + 1
      return acc
    }, {})

    const referrerStats = Object.entries(referrerCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([referrer, count]) => ({
        referrer,
        count: count as number,
        percentage: Math.round(((count as number) / (totalViews || 1)) * 100)
      }))

    // Get hourly views for today
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
    
    const { data: hourlyData } = await supabaseAdmin
      .from('page_views')
      .select('created_at')
      .gte('created_at', startOfDay)

    const hourlyViewsMap = (hourlyData || []).reduce((acc: Record<number, number>, view) => {
      const hour = new Date(view.created_at).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {})

    const hourlyViews = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      views: hourlyViewsMap[hour] || 0
    }))

    const stats: AnalyticsStats = {
      totalViews: totalViews || 0,
      uniqueVisitors,
      avgSessionDuration,
      bounceRate,
      activeVisitors: activeVisitors || 0,
      topPages,
      dailyViews,
      deviceStats,
      geographicStats,
      topEvents,
      referrerStats,
      hourlyViews
    }

    return NextResponse.json({
      stats,
      metadata: {
        period: '30 days',
        lastUpdated: new Date().toISOString(),
        growthPercentage
      }
    })

  } catch (error) {
    console.error('Error fetching analytics stats:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}