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
        <div className="border border-green-500 p-8 text-center">
          <div className="text-green-500 font-mono">LOADING...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b border-green-500 pb-4">
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-green-500 mb-2">
          SYSTEM OVERVIEW
        </h2>
        <p className="text-green-600 font-mono text-sm">
          Lydskog Performance Metrics
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-green-500 bg-black p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-600 text-xs font-mono uppercase">Total Views</p>
            <span className="text-green-500">📊</span>
          </div>
          <p className="text-2xl md:text-3xl font-mono font-bold text-green-500 mb-1">
            {stats?.totalViews.toLocaleString() || '0'}
          </p>
          <p className={`text-xs font-mono ${growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {growthPercentage >= 0 ? '+' : ''}{growthPercentage}% vs last week
          </p>
        </div>

        <div className="border border-green-500 bg-black p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-600 text-xs font-mono uppercase">Unique Visitors</p>
            <span className="text-green-500">👥</span>
          </div>
          <p className="text-2xl md:text-3xl font-mono font-bold text-green-500 mb-1">
            {stats?.uniqueVisitors.toLocaleString() || '0'}
          </p>
          <p className="text-xs font-mono text-green-600">Unique Sessions</p>
        </div>

        <div className="border border-green-500 bg-black p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-600 text-xs font-mono uppercase">Session Duration</p>
            <span className="text-green-500">⏱️</span>
          </div>
          <p className="text-2xl md:text-3xl font-mono font-bold text-green-500 mb-1">
            {stats?.avgSessionDuration || 'N/A'}
          </p>
          <p className="text-xs font-mono text-green-600">Average</p>
        </div>

        <div className="border border-green-500 bg-black p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-600 text-xs font-mono uppercase">Bounce Rate</p>
            <span className="text-green-500">📈</span>
          </div>
          <p className="text-2xl md:text-3xl font-mono font-bold text-green-500 mb-1">
            {stats?.bounceRate || 0}%
          </p>
          <p className="text-xs font-mono text-green-600">Engagement</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <div className="border border-green-500 bg-black p-4">
          <h3 className="text-lg font-mono font-bold text-green-500 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500"></span>
            VISITS (LAST 30 DAYS)
          </h3>
          <div className="h-48 flex items-end gap-1 p-4 border border-green-500 bg-black">
            {stats?.dailyViews.map((day, i) => {
              const maxViews = Math.max(...(stats?.dailyViews.map(d => d.views) || [1]))
              const height = maxViews > 0 ? Math.max(8, (day.views / maxViews) * 100) : 0
              return (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col items-center"
                  title={`${day.date}: ${day.views} views`}
                >
                  <div 
                    style={{ height: `${height}%` }} 
                    className="w-full bg-green-500 min-h-[2px]"
                  />
                </div>
              )
            }) || (
              <div className="flex-1 flex items-center justify-center text-green-600 font-mono text-sm">
                NO DATA
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-green-600 font-mono mt-4 px-4">
            <span>30 days ago</span>
            <span className="text-green-500">
              Total: {stats?.dailyViews.reduce((sum, day) => sum + day.views, 0) || 0}
            </span>
            <span>Today</span>
          </div>
        </div>

        {/* Top Pages */}
        <div className="border border-green-500 bg-black p-4">
          <h3 className="text-lg font-mono font-bold text-green-500 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500"></span>
            TOP PAGES
          </h3>
          <div className="space-y-2">
            {stats?.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center p-2 border border-green-500 bg-black">
                <div className="flex items-center gap-3">
                  <span className="text-green-500 font-mono text-sm">#{index + 1}</span>
                  <span className="text-green-400 font-mono text-sm">{page.page}</span>
                </div>
                <div className="text-right">
                  <span className="text-green-500 font-mono font-bold">{page.views}</span>
                  <span className="text-green-600 font-mono text-xs ml-2">({page.percentage}%)</span>
                </div>
              </div>
            )) || (
              <div className="text-center text-green-600 font-mono py-8">
                NO DATA AVAILABLE
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border border-green-500 bg-black p-4">
        <h3 className="text-lg font-mono font-bold text-green-500 mb-4">QUICK ACTIONS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={fetchAnalytics}
            className="p-3 border border-green-500 bg-black text-green-500 font-mono text-sm hover:bg-green-500 hover:text-black"
          >
            [REFRESH DATA]
          </button>
          
          <button className="p-3 border border-green-500 bg-black text-green-500 font-mono text-sm hover:bg-green-500 hover:text-black">
            [GENERATE REPORT]
          </button>
          
          <button className="p-3 border border-green-500 bg-black text-green-500 font-mono text-sm hover:bg-green-500 hover:text-black">
            [SETTINGS]
          </button>
        </div>
      </div>
    </div>
  )
}
