'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import RealTimeAnalytics from '@/components/RealTimeAnalytics'
import HeatmapAnalytics from '@/components/HeatmapAnalytics'
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Analytics & Statistikk</h2>
          <p className="text-gray-400 text-sm">Detaljert analyse av brukeratferd og trafikk</p>
        </div>
        
        <button 
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-4 py-2 bg-accent-green/20 border border-accent-green/30 text-accent-green rounded-lg hover:bg-accent-green/30 transition-colors text-sm font-medium disabled:opacity-50 relative overflow-hidden group"
        >
          <span className="relative z-10">{loading ? 'Oppdaterer...' : '🔄 Oppdater'}</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>
      </div>

      {/* Real-time Analytics - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <RealTimeAnalytics />
      </motion.div>

      {/* Device & Geographic Stats - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            Enhetsstatistikk
          </h3>
          <div className="space-y-2">
            {stats?.deviceStats.map((device, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-gray-300 text-sm capitalize">{device.device}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{device.count}</span>
                  <span className="text-accent-green text-xs">({device.percentage}%)</span>
                </div>
              </div>
            )) || <div className="text-gray-400 text-center py-3 text-sm">Ingen data</div>}
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            Geografisk fordeling
          </h3>
          <div className="space-y-2">
            {stats?.geographicStats.slice(0, 5).map((geo, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-gray-300 text-sm">{geo.country}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{geo.count}</span>
                  <span className="text-accent-green text-xs">({geo.percentage}%)</span>
                </div>
              </div>
            )) || <div className="text-gray-400 text-center py-3 text-sm">Ingen data</div>}
          </div>
        </div>
      </div>

      {/* Heatmap Analytics - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <HeatmapAnalytics />
      </motion.div>

      {/* Analytics Export & Event Tracking - Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Analytics Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AnalyticsExport />
        </motion.div>

        {/* Event Tracking */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            Top Events
          </h3>
          <div className="space-y-2">
            {stats?.topEvents.map((event, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-gray-300 text-sm">{event.event}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{event.count}</span>
                  <span className="text-accent-green text-xs">({event.percentage}%)</span>
                </div>
              </div>
            )) || <div className="text-gray-400 text-center py-3 text-sm">Ingen event data</div>}
          </div>
        </div>
      </div>
    </div>
  )
}