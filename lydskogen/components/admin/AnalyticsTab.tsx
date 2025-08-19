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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Analytics & Statistikk</h2>
          <p className="text-gray-400">Detaljert analyse av brukeratferd og trafikk</p>
        </div>
        
        <button 
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-6 py-3 bg-accent-green/20 border border-accent-green/30 text-accent-green rounded-xl hover:bg-accent-green/30 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? 'Oppdaterer...' : '🔄 Oppdater data'}
        </button>
      </div>

      {/* Real-time Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <RealTimeAnalytics />
      </motion.div>

      {/* Device & Geographic Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            Enhetsstatistikk
          </h3>
          <div className="space-y-3">
            {stats?.deviceStats.map((device, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300 capitalize">{device.device}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{device.count}</span>
                  <span className="text-accent-green text-sm">({device.percentage}%)</span>
                </div>
              </div>
            )) || <div className="text-gray-400 text-center py-4">Ingen data</div>}
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            Geografisk fordeling
          </h3>
          <div className="space-y-3">
            {stats?.geographicStats.slice(0, 5).map((geo, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300">{geo.country}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{geo.count}</span>
                  <span className="text-accent-green text-sm">({geo.percentage}%)</span>
                </div>
              </div>
            )) || <div className="text-gray-400 text-center py-4">Ingen data</div>}
          </div>
        </div>
      </div>

      {/* Heatmap Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <HeatmapAnalytics />
      </motion.div>

      {/* Analytics Export */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <AnalyticsExport />
      </motion.div>

      {/* Event Tracking */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
          Top Events
        </h3>
        <div className="space-y-3">
          {stats?.topEvents.map((event, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-gray-300">{event.event}</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{event.count}</span>
                <span className="text-accent-green text-sm">({event.percentage}%)</span>
              </div>
            </div>
          )) || <div className="text-gray-400 text-center py-4">Ingen event data</div>}
        </div>
      </div>
    </div>
  )
}