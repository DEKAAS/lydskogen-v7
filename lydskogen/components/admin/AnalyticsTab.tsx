'use client'

import { useState, useEffect } from 'react'
import RealTimeAnalytics from '@/components/RealTimeAnalytics'
import AnalyticsExport from '@/components/AnalyticsExport'
import RecentVisitsTable from '@/components/admin/RecentVisitsTable'
import type { AnalyticsStats } from '@/lib/supabase'

export default function AnalyticsTab() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laster statistikk...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">Statistikk</h2>
          <p className="text-gray-500 text-sm">Detaljert analyse av trafikk og brukeratferd</p>
        </div>
        
        <button 
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Oppdaterer...' : 'Oppdater'}
        </button>
      </div>

      {/* Real-time Analytics */}
      <RealTimeAnalytics />

      {/* Recent Visits Log */}
      <div className="bg-[#111] rounded-lg border border-white/10 p-6">
        <h3 className="text-lg font-medium text-white mb-4">Siste besøk</h3>
        <RecentVisitsTable visits={stats?.recentVisits || []} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Stats */}
        <div className="bg-[#111] rounded-lg border border-white/10 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Enheter</h3>
          <div className="space-y-3">
            {stats?.deviceStats && stats.deviceStats.length > 0 ? (
              stats.deviceStats.map((device, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-md border border-white/5">
                  <span className="text-gray-300 text-sm capitalize">{device.device}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{device.count}</span>
                    <span className="text-gray-500 text-xs">{device.percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600 text-center py-6 text-sm">Ingen data</div>
            )}
          </div>
        </div>
        
        {/* Geographic Stats */}
        <div className="bg-[#111] rounded-lg border border-white/10 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Geografi</h3>
          <div className="space-y-3">
            {stats?.geographicStats && stats.geographicStats.length > 0 ? (
              stats.geographicStats.slice(0, 5).map((geo, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-md border border-white/5">
                  <span className="text-gray-300 text-sm">{geo.country}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{geo.count}</span>
                    <span className="text-gray-500 text-xs">{geo.percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600 text-center py-6 text-sm">Ingen data</div>
            )}
          </div>
        </div>
      </div>

      {/* Export & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsExport />

        <div className="bg-[#111] rounded-lg border border-white/10 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Topp hendelser</h3>
          <div className="space-y-3">
            {stats?.topEvents && stats.topEvents.length > 0 ? (
              stats.topEvents.map((event, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-md border border-white/5">
                  <span className="text-gray-300 text-sm truncate">{event.event}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{event.count}</span>
                    <span className="text-gray-500 text-xs">{event.percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600 text-center py-6 text-sm">Ingen hendelser</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
