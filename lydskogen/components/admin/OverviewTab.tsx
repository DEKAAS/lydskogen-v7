'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { AnalyticsStats } from '@/lib/supabase'

export default function OverviewTab() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [growthPercentage, setGrowthPercentage] = useState(0)

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
        setGrowthPercentage(data.metadata.growthPercentage || 0)
      } else {
        console.error('Failed to fetch analytics:', data.error)
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
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white">Laster data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Velkommen til Admin Dashboard
        </h2>
        <p className="text-gray-400">
          Oversikt over Lydskog&apos;s ytelse og statistikk
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Totale besøk</p>
              <p className="text-3xl font-bold text-white">{stats?.totalViews.toLocaleString() || '0'}</p>
              <p className={`text-sm mt-1 ${growthPercentage >= 0 ? 'text-accent-green' : 'text-red-400'}`}>
                {growthPercentage >= 0 ? '+' : ''}{growthPercentage}% fra forrige uke
              </p>
            </div>
            <div className="text-accent-green text-3xl">📊</div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Unike besøkende</p>
              <p className="text-3xl font-bold text-white">{stats?.uniqueVisitors.toLocaleString() || '0'}</p>
              <p className="text-sm text-accent-green/80 mt-1">Unike økter</p>
            </div>
            <div className="text-blue-400 text-3xl">👥</div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Økt varighet</p>
              <p className="text-3xl font-bold text-white">{stats?.avgSessionDuration || 'N/A'}</p>
              <p className="text-sm text-accent-green/80 mt-1">Gjennomsnitt</p>
            </div>
            <div className="text-purple-400 text-3xl">⏱️</div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Bounce Rate</p>
              <p className="text-3xl font-bold text-white">{stats?.bounceRate || 0}%</p>
              <p className="text-sm text-accent-green/80 mt-1">Engasjement</p>
            </div>
            <div className="text-yellow-400 text-3xl">📈</div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Views Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            Besøksgraf (siste 30 dager)
          </h3>
          <div className="h-48 flex items-end gap-1 p-4 bg-white/5 rounded-xl border border-white/5">
            {stats?.dailyViews.map((day, i) => {
              const maxViews = Math.max(...(stats?.dailyViews.map(d => d.views) || [1]))
              const height = maxViews > 0 ? Math.max(8, (day.views / maxViews) * 100) : 0
              return (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col items-center group cursor-pointer"
                  title={`${day.date}: ${day.views} visninger`}
                >
                  <div 
                    style={{ height: `${height}%` }} 
                    className="w-full bg-gradient-to-t from-accent-green to-accent-green/50 rounded-t-sm transition-all duration-200 group-hover:from-accent-green/80 group-hover:to-accent-green/30 min-h-[2px]"
                  />
                </div>
              )
            }) || (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Ingen data tilgjengelig
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-4 px-4">
            <span>30 dager siden</span>
            <span className="text-accent-green font-medium">
              Total: {stats?.dailyViews.reduce((sum, day) => sum + day.views, 0) || 0} visninger
            </span>
            <span>I dag</span>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            Mest populære sider
          </h3>
          <div className="space-y-4">
            {stats?.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <span className="text-accent-green font-mono text-sm">#{index + 1}</span>
                  <span className="text-gray-300">{page.page}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-semibold">{page.views}</span>
                  <span className="text-gray-400 text-sm ml-2">({page.percentage}%)</span>
                </div>
              </div>
            )) || (
              <div className="text-center text-gray-400 py-8">
                Ingen data tilgjengelig ennå
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Hurtighandlinger</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={fetchAnalytics}
            className="p-4 bg-accent-green/20 border border-accent-green/30 text-accent-green rounded-xl hover:bg-accent-green/30 transition-colors font-medium flex items-center gap-3"
          >
            <span>🔄</span>
            Oppdater data
          </button>
          
          <button className="p-4 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-colors font-medium flex items-center gap-3">
            <span>📊</span>
            Generer rapport
          </button>
          
          <button className="p-4 bg-purple-600/20 border border-purple-600/30 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-colors font-medium flex items-center gap-3">
            <span>⚙️</span>
            Innstillinger
          </button>
        </div>
      </div>
    </div>
  )
}