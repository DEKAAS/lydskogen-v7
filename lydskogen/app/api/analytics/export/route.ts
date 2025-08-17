import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const period = searchParams.get('period') || '30'
    
    if (!['csv', 'json'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format. Use csv or json' }, { status: 400 })
    }

    const daysAgo = parseInt(period)
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

    // Fetch all relevant data
    const [pageViewsResult, eventsResult, activeSessionsResult] = await Promise.all([
      supabaseAdmin
        .from('page_views')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false }),
      
      supabaseAdmin
        .from('analytics_events')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false }),
        
      supabaseAdmin
        .from('active_sessions')
        .select('*')
        .gte('last_seen', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
    ])

    const pageViews = pageViewsResult.data || []
    const events = eventsResult.data || []
    const activeSessions = activeSessionsResult.data || []

    // Calculate summary statistics
    const totalViews = pageViews.length
    const uniqueVisitors = new Set(pageViews.map(v => v.session_id)).size
    const totalEvents = events.length
    const activeVisitors = activeSessions.length

    // Page statistics
    const pageStats = pageViews.reduce((acc: Record<string, number>, view) => {
      acc[view.page_url] = (acc[view.page_url] || 0) + 1
      return acc
    }, {})

    // Device statistics
    const deviceStats = pageViews.reduce((acc: Record<string, number>, view) => {
      const device = view.device_type || 'Unknown'
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {})

    // Geographic statistics
    const geoStats = pageViews.reduce((acc: Record<string, number>, view) => {
      const country = view.country || 'Unknown'
      acc[country] = (acc[country] || 0) + 1
      return acc
    }, {})

    // Event statistics
    const eventStats = events.reduce((acc: Record<string, number>, event) => {
      acc[event.event_name] = (acc[event.event_name] || 0) + 1
      return acc
    }, {})

    const exportData = {
      summary: {
        period_days: daysAgo,
        export_date: new Date().toISOString(),
        total_views: totalViews,
        unique_visitors: uniqueVisitors,
        total_events: totalEvents,
        active_visitors: activeVisitors
      },
      page_statistics: Object.entries(pageStats).map(([page, count]) => ({
        page,
        views: count,
        percentage: Math.round((count as number / totalViews) * 100)
      })).sort((a, b) => b.views - a.views),
      device_statistics: Object.entries(deviceStats).map(([device, count]) => ({
        device,
        count,
        percentage: Math.round((count as number / totalViews) * 100)
      })).sort((a, b) => b.count - a.count),
      geographic_statistics: Object.entries(geoStats).map(([country, count]) => ({
        country,
        count,
        percentage: Math.round((count as number / totalViews) * 100)
      })).sort((a, b) => b.count - a.count),
      event_statistics: Object.entries(eventStats).map(([event, count]) => ({
        event,
        count,
        percentage: Math.round((count as number / totalEvents) * 100)
      })).sort((a, b) => b.count - a.count),
      raw_data: {
        page_views: pageViews.slice(0, 1000), // Limit to 1000 for performance
        events: events.slice(0, 1000),
        active_sessions: activeSessions
      }
    }

    if (format === 'json') {
      const filename = `lydskog-analytics-${period}d-${new Date().toISOString().split('T')[0]}.json`
      
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      })
    }

    // CSV format
    const csvRows = []
    
    // Summary section
    csvRows.push('SAMMENDRAG')
    csvRows.push(`Periode,${daysAgo} dager`)
    csvRows.push(`Eksportdato,${new Date().toLocaleDateString('no-NO')}`)
    csvRows.push(`Totale visninger,${totalViews}`)
    csvRows.push(`Unike besøkende,${uniqueVisitors}`)
    csvRows.push(`Totale events,${totalEvents}`)
    csvRows.push(`Aktive besøkende,${activeVisitors}`)
    csvRows.push('')

    // Page statistics
    csvRows.push('SIDESTATISTIKK')
    csvRows.push('Side,Visninger,Prosent')
    exportData.page_statistics.forEach(stat => {
      csvRows.push(`"${stat.page}",${stat.views},${stat.percentage}%`)
    })
    csvRows.push('')

    // Device statistics
    csvRows.push('ENHETSSTATISTIKK')
    csvRows.push('Enhet,Antall,Prosent')
    exportData.device_statistics.forEach(stat => {
      csvRows.push(`${stat.device},${stat.count},${stat.percentage}%`)
    })
    csvRows.push('')

    // Geographic statistics
    csvRows.push('GEOGRAFISK STATISTIKK')
    csvRows.push('Land,Antall,Prosent')
    exportData.geographic_statistics.forEach(stat => {
      csvRows.push(`${stat.country},${stat.count},${stat.percentage}%`)
    })
    csvRows.push('')

    // Event statistics
    csvRows.push('EVENT STATISTIKK')
    csvRows.push('Event,Antall,Prosent')
    exportData.event_statistics.forEach(stat => {
      csvRows.push(`"${stat.event}",${stat.count},${stat.percentage}%`)
    })
    csvRows.push('')

    // Recent page views
    csvRows.push('NYLIGE SIDEVISNINGER (siste 100)')
    csvRows.push('Dato,Tid,Side,Land,Enhet,Nettleser')
    pageViews.slice(0, 100).forEach(view => {
      const date = new Date(view.created_at)
      csvRows.push(`${date.toLocaleDateString('no-NO')},${date.toLocaleTimeString('no-NO')},"${view.page_url}",${view.country || 'Unknown'},${view.device_type || 'Unknown'},${view.browser || 'Unknown'}`)
    })

    const csvContent = csvRows.join('\n')
    const filename = `lydskog-analytics-${period}d-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('Error exporting analytics:', error)
    return NextResponse.json({ error: 'Failed to export analytics' }, { status: 500 })
  }
}