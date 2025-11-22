'use client'

import { useState, useEffect } from 'react'
import RealTimeAnalytics from '@/components/RealTimeAnalytics'
import AnalyticsExport from '@/components/AnalyticsExport'
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
      <div className="flex items-center justify-center h-96">
        <div className="border border-green-500 p-8 text-center">
          <div className="text-green-500 font-mono">LOADING ANALYTICS...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-green-500 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-green-500 mb-2">
            ANALYTICS & STATISTIKK
          </h2>
          <p className="text-green-600 font-mono text-sm">
            Detaljert analyse av brukeratferd og trafikk
          </p>
        </div>
        
        <button 
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-4 py-2 border border-green-500 bg-black text-green-500 font-mono text-sm hover:bg-green-500 hover:text-black disabled:opacity-50"
        >
          {loading ? '[UPDATING...]' : '[REFRESH]'}
        </button>
      </div>

      {/* Real-time Analytics */}
      <div>
        <RealTimeAnalytics />
      </div>

      {/* Device & Geographic Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-green-500 bg-black p-4">
          <h3 className="text-lg font-mono font-bold text-green-500 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500"></span>
            ENHETSSTATISTIKK
          </h3>
          <div className="space-y-2">
            {stats?.deviceStats.map((device, i) => (
              <div key={i} className="flex items-center justify-between p-2 border border-green-500 bg-black">
                <span className="text-green-400 font-mono text-sm capitalize">{device.device}</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-mono font-bold">{device.count}</span>
                  <span className="text-green-600 font-mono text-xs">({device.percentage}%)</span>
                </div>
              </div>
            )) || (
              <div className="text-green-600 font-mono text-center py-3 text-sm">
                NO DATA AVAILABLE
              </div>
            )}
          </div>
        </div>
        
        <div className="border border-green-500 bg-black p-4">
          <h3 className="text-lg font-mono font-bold text-green-500 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500"></span>
            GEOGRAFISK FORDELING
          </h3>
          <div className="space-y-2">
            {stats?.geographicStats.slice(0, 5).map((geo, i) => (
              <div key={i} className="flex items-center justify-between p-2 border border-green-500 bg-black">
                <span className="text-green-400 font-mono text-sm">{geo.country}</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-mono font-bold">{geo.count}</span>
                  <span className="text-green-600 font-mono text-xs">({geo.percentage}%)</span>
                </div>
              </div>
            )) || (
              <div className="text-green-600 font-mono text-center py-3 text-sm">
                NO DATA AVAILABLE
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Export & Event Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Analytics Export */}
        <div>
          <AnalyticsExport />
        </div>

        {/* Event Tracking */}
        <div className="border border-green-500 bg-black p-4">
          <h3 className="text-lg font-mono font-bold text-green-500 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500"></span>
            TOP EVENTS
          </h3>
          <div className="space-y-2">
            {stats?.topEvents.map((event, i) => (
              <div key={i} className="flex items-center justify-between p-2 border border-green-500 bg-black">
                <span className="text-green-400 font-mono text-sm truncate">{event.event}</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-mono font-bold">{event.count}</span>
                  <span className="text-green-600 font-mono text-xs">({event.percentage}%)</span>
                </div>
              </div>
            )) || (
              <div className="text-green-600 font-mono text-center py-3 text-sm">
                NO EVENT DATA
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
}