'use client'

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalVisits: 1247,
    uniqueVisitors: 832,
    avgSessionDuration: '3:42',
    topPages: [
      { page: '/produksjon/ambient', views: 342 },
      { page: '/', views: 289 },
      { page: '/produksjon/hip-hop', views: 201 },
      { page: '/produksjon/lo-fi', views: 156 }
    ]
  })
  const [visitsSeries] = useState<number[]>([28, 35, 30, 40, 48, 50, 62, 55, 66, 71, 68, 74, 80, 86, 92, 97, 105, 112, 120, 118, 125, 130, 138, 142, 150, 158, 162, 170, 178, 185])

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated" || session?.user?.role !== 'admin') {
      router.push('/admin/login')
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-base-dark flex items-center justify-center">
        <div className="text-white">Laster...</div>
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
    <div className="min-h-screen bg-base-dark p-6">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-secondary-dark p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Totale besøk</h3>
            <p className="text-2xl font-bold text-white">{stats.totalVisits.toLocaleString()}</p>
            <p className="text-sm text-accent-green mt-1">+12% fra forrige uke</p>
          </div>
          
          <div className="bg-secondary-dark p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Unike besøkende</h3>
            <p className="text-2xl font-bold text-white">{stats.uniqueVisitors.toLocaleString()}</p>
            <p className="text-sm text-accent-green mt-1">+8% fra forrige uke</p>
          </div>
          
          <div className="bg-secondary-dark p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Gjennomsnittlig økt</h3>
            <p className="text-2xl font-bold text-white">{stats.avgSessionDuration}</p>
            <p className="text-sm text-accent-green mt-1">+15% fra forrige uke</p>
          </div>
          
          <div className="bg-secondary-dark p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Konverteringsrate</h3>
            <p className="text-2xl font-bold text-white">3.2%</p>
            <p className="text-sm text-accent-green mt-1">+5% fra forrige uke</p>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-secondary-dark p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Mest besøkte sider</h3>
          <div className="space-y-3">
            {stats.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">{page.page}</span>
                <span className="text-white font-medium">{page.views} visninger</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visits Graph */}
        <div className="bg-secondary-dark p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Besøksgraf (siste 30 dager)</h3>
          <div className="h-32 flex items-end gap-1">
            {visitsSeries.map((v, i) => {
              const max = Math.max(...visitsSeries)
              const h = Math.max(4, Math.round((v / max) * 100))
              return (
                <div key={i} style={{ height: `${h}%`, background: 'linear-gradient(180deg, rgba(219,186,54,0.8), rgba(219,186,54,0.25))' }} className="w-2 rounded-sm" />
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>0</span>
            <span>30d</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-secondary-dark p-6 rounded-lg">
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

          <div className="bg-secondary-dark p-6 rounded-lg">
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

          <div className="bg-secondary-dark p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Systemstatus</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Server status</span>
                <span className="text-accent-green">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Database</span>
                <span className="text-accent-green">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Last backup</span>
                <span className="text-gray-300">2 timer siden</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}