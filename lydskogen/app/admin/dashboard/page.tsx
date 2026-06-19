'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminNavbar from '@/components/AdminNavbar'
import OverviewTab from '@/components/admin/OverviewTab'
import ProjectsTab from '@/components/admin/ProjectsTab'
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-gray-500">Laster...</div>
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
      case 'settings':
        return <SettingsTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>
    </div>
  )
}
