'use client'

import { useState, useEffect } from 'react'
import RealTimeAnalytics from '@/components/RealTimeAnalytics'
import AnalyticsExport from '@/components/AnalyticsExport'
import RecentVisitsTable from '@/components/admin/RecentVisitsTable'
import type { AnalyticsStats } from '@/lib/supabase'

interface LoginAttempt {
  id: string
  created_at: string
  ip_address: string
  username_attempted: string
  success: boolean
  user_agent: string
}

interface ExtendedStats extends AnalyticsStats {
  loginAttempts?: LoginAttempt[]
}

export default function AnalyticsTab() {
  const [stats, setStats] = useState<ExtendedStats | null>(null)
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

  const failedLogins = stats?.loginAttempts?.filter(a => !a.success) || []
  const hasSecurityAlerts = failedLogins.length > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">Statistikk</h2>
          <p className="text-gray-500 text-sm">Detaljert analyse av trafikk og brukeratferd (bots filtrert ut)</p>
        </div>
        
        <button 
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Oppdaterer...' : 'Oppdater'}
        </button>
      </div>

      {/* Security Alert */}
      {hasSecurityAlerts && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <h3 className="text-red-400 font-medium mb-2 flex items-center gap-2">
            <span>⚠️</span> Sikkerhetsvarsel
          </h3>
          <p className="text-red-300/80 text-sm">
            {failedLogins.length} mislykkede innloggingsforsøk registrert. Se detaljer nedenfor.
          </p>
        </div>
      )}

      {/* Real-time Analytics */}
      <RealTimeAnalytics />

      {/* Login Attempts (Security) */}
      {stats?.loginAttempts && stats.loginAttempts.length > 0 && (
        <div className="bg-[#111] rounded-lg border border-white/10 p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            🔐 Innloggingsforsøk
            {hasSecurityAlerts && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                {failedLogins.length} mislykket
              </span>
            )}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Tidspunkt</th>
                  <th className="py-3 px-4 font-medium">IP</th>
                  <th className="py-3 px-4 font-medium">Brukernavn</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.loginAttempts.map((attempt, i) => (
                  <tr key={i} className={`border-b border-white/5 ${!attempt.success ? 'bg-red-500/5' : ''}`}>
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(attempt.created_at).toLocaleString('no-NO', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-xs">{attempt.ip_address}</td>
                    <td className="py-3 px-4 text-gray-300">{attempt.username_attempted}</td>
                    <td className="py-3 px-4">
                      {attempt.success ? (
                        <span className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">✓ Vellykket</span>
                      ) : (
                        <span className="text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded">✗ Mislykket</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      {/* Export */}
      <AnalyticsExport />
    </div>
  )
}
