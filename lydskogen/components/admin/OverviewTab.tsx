'use client'

import { useState, useEffect } from 'react'
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
        setGrowthPercentage(data.metadata?.growthPercentage || 0)
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
        <div className="text-gray-500">Laster...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-1">Oversikt</h2>
        <p className="text-gray-500 text-sm">Lydskog ytelsesmålinger</p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111] rounded-lg border border-white/10 p-5">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Totale visninger</p>
          <p className="text-3xl font-semibold text-white mb-1">
            {stats?.totalViews?.toLocaleString() || '0'}
          </p>
          <p className={`text-xs ${growthPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {growthPercentage >= 0 ? '+' : ''}{growthPercentage}% vs forrige uke
          </p>
        </div>

        <div className="bg-[#111] rounded-lg border border-white/10 p-5">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Unike besøkende</p>
          <p className="text-3xl font-semibold text-white mb-1">
            {stats?.uniqueVisitors?.toLocaleString() || '0'}
          </p>
          <p className="text-xs text-gray-500">Unike sesjoner</p>
        </div>

        <div className="bg-[#111] rounded-lg border border-white/10 p-5">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Gjennomsnittlig varighet</p>
          <p className="text-3xl font-semibold text-white mb-1">
            {stats?.avgSessionDuration || 'N/A'}
          </p>
          <p className="text-xs text-gray-500">Per sesjon</p>
        </div>

        <div className="bg-[#111] rounded-lg border border-white/10 p-5">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Fluktfrekvens</p>
          <p className="text-3xl font-semibold text-white mb-1">
            {stats?.bounceRate || 0}%
          </p>
          <p className="text-xs text-gray-500">Engasjement</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <div className="bg-[#111] rounded-lg border border-white/10 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Besøk (siste 30 dager)</h3>
          <div className="h-48 flex items-end gap-1 p-4 bg-[#0a0a0a] rounded-md border border-white/5">
            {stats?.dailyViews && stats.dailyViews.length > 0 ? (
              stats.dailyViews.map((day, i) => {
                const maxViews = Math.max(...(stats?.dailyViews.map(d => d.views) || [1]))
                const height = maxViews > 0 ? Math.max(8, (day.views / maxViews) * 100) : 0
                return (
                  <div 
                    key={i} 
                    className="flex-1 flex flex-col items-center group"
                    title={`${day.date}: ${day.views} visninger`}
                  >
                    <div 
                      style={{ height: `${height}%` }} 
                      className="w-full bg-blue-500 hover:bg-blue-400 transition-colors min-h-[2px] rounded-t"
                    />
                  </div>
                )
              })
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
                Ingen data
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-3">
            <span>30 dager siden</span>
            <span className="text-white">
              Totalt: {stats?.dailyViews?.reduce((sum, day) => sum + day.views, 0) || 0}
            </span>
            <span>I dag</span>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-[#111] rounded-lg border border-white/10 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Topp sider</h3>
          <div className="space-y-3">
            {stats?.topPages && stats.topPages.length > 0 ? (
              stats.topPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-md border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">#{index + 1}</span>
                    <span className="text-gray-300 text-sm truncate">{page.page}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{page.views}</span>
                    <span className="text-gray-500 text-xs">({page.percentage}%)</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 py-8 text-sm">
                Ingen data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#111] rounded-lg border border-white/10 p-6">
        <h3 className="text-lg font-medium text-white mb-4">Hurtighandlinger</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button 
            onClick={fetchAnalytics}
            className="p-3 bg-[#0a0a0a] border border-white/10 rounded-md text-gray-300 text-sm hover:border-white/20 hover:text-white transition-all"
          >
            Oppdater data
          </button>
          
          <button className="p-3 bg-[#0a0a0a] border border-white/10 rounded-md text-gray-300 text-sm hover:border-white/20 hover:text-white transition-all">
            Generer rapport
          </button>
          
          <button className="p-3 bg-[#0a0a0a] border border-white/10 rounded-md text-gray-300 text-sm hover:border-white/20 hover:text-white transition-all">
            Innstillinger
          </button>
        </div>
      </div>
    </div>
  )
}
