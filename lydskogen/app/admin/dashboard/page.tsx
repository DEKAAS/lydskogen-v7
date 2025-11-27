'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminNavbar from '@/components/AdminNavbar'
import OverviewTab from '@/components/admin/OverviewTab'
import ProjectsTab from '@/components/admin/ProjectsTab'
import ContentTab from '@/components/admin/ContentTab'
import OrdersTab from '@/components/admin/OrdersTab'
import AnalyticsTab from '@/components/admin/AnalyticsTab'
import MusikkproduksjonTab from '@/components/admin/MusikkproduksjonTab'
import SettingsTab from '@/components/admin/SettingsTab'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated" || session?.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="border border-green-500 p-8 text-center">
          <div className="text-green-500 font-mono">LOADING...</div>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />
      case 'projects':
        return <ProjectsTab />
      case 'content':
        return <ContentTab />
      case 'orders':
        return <OrdersTab />
      case 'analytics':
        return <AnalyticsTab />
      case 'musikkproduksjon':
        return <MusikkproduksjonTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-500">
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>
    </div>
  )
}