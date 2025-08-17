'use client'

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { AnalyticsStats } from '@/lib/supabase'
import RealTimeAnalytics from '@/components/RealTimeAnalytics'
import HeatmapAnalytics from '@/components/HeatmapAnalytics'
import AnalyticsExport from '@/components/AnalyticsExport'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [growthPercentage, setGrowthPercentage] = useState(0)

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated" || session?.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }
    
    // Fetch real analytics data
    fetchAnalytics()
  }, [status, session, router])

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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white">Laster analytics...</div>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Velkommen, {session.user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logg ut
            </button>
          </div>
        </div>

        {/* Stats Cards with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Totale besøk</h3>
            <p className="text-3xl font-bold text-white">{stats?.totalViews.toLocaleString() || '0'}</p>
            <p className={`text-sm mt-1 ${growthPercentage >= 0 ? 'text-accent-green' : 'text-red-400'}`}>
              {growthPercentage >= 0 ? '+' : ''}{growthPercentage}% fra forrige uke
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Unike besøkende</h3>
            <p className="text-3xl font-bold text-white">{stats?.uniqueVisitors.toLocaleString() || '0'}</p>
            <p className="text-sm text-accent-green/80 mt-1">Unike økter</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Gjennomsnittlig økt</h3>
            <p className="text-3xl font-bold text-white">{stats?.avgSessionDuration || 'N/A'}</p>
            <p className="text-sm text-accent-green/80 mt-1">Per besøk</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Bounce Rate</h3>
            <p className="text-3xl font-bold text-white">{stats?.bounceRate || 0}%</p>
            <p className="text-sm text-accent-green/80 mt-1">Engasjement</p>
          </div>
        </div>

        {/* Top Pages with Enhanced Design */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            Mest besøkte sider
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

        {/* Advanced Analytics Graph */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl mb-8">
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

        {/* Real-time Analytics */}
        <div className="mb-8">
          <RealTimeAnalytics />
        </div>

        {/* Heatmap Analytics */}
        <div className="mb-8">
          <HeatmapAnalytics />
        </div>

        {/* Device & Geographic Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
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
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
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

        {/* Analytics Export */}
        <div className="mb-8">
          <AnalyticsExport />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Innholdsadministrasjon</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/admin/artwork')}
                className="w-full font-semibold py-2 px-4 rounded transition-colors"
                style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}
              >
                Last opp artwork
              </button>
              <button 
                onClick={() => router.push('/admin/music')}
                className="w-full font-semibold py-2 px-4 rounded transition-colors"
                style={{ background: 'var(--accent-gold)', color: '#1b1b1b' }}
              >
                Last opp musikk
              </button>
              <button 
                onClick={() => router.push('/admin/manage')}
                className="w-full" style={{background: 'var(--accent-gold)', color: '#1b1b1b', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600}}
              >
                Rediger alt innhold
              </button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Bestillinger & Kundeservice</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/admin/orders')}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
              >
                Se alle bestillinger
              </button>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Salgsrapporter
              </button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
              Systemstatus
            </h3>
            <div className="space-y-4">
              <button 
                onClick={fetchAnalytics}
                className="w-full bg-accent-green/20 border border-accent-green/30 text-accent-green py-2 px-4 rounded-xl hover:bg-accent-green/30 transition-colors font-medium"
              >
                🔄 Oppdater Analytics
              </button>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300">Analytics API</span>
                <span className="text-accent-green flex items-center gap-1">
                  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300">Database</span>
                <span className="text-accent-green flex items-center gap-1">
                  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300">Tracking</span>
                <span className="text-accent-green flex items-center gap-1">
                  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}