'use client'

import { useState } from 'react'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AdminNavbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { 
    id: 'overview', 
    label: 'Oversikt', 
    icon: '📊',
    description: 'Dashboard oversikt'
  },
  { 
    id: 'projects', 
    label: 'Portfolio', 
    icon: '🎨',
    description: 'Administrer portfolio-prosjekter'
  },
  { 
    id: 'content', 
    label: 'Innhold', 
    icon: '📝',
    description: 'Administrer musikk og artwork'
  },
  { 
    id: 'orders', 
    label: 'Bestillinger', 
    icon: '🛍️',
    description: 'Salg og bestillinger'
  },
  { 
    id: 'analytics', 
    label: 'Analyse', 
    icon: '📈',
    description: 'Brukerstatistikk og rapporter'
  },
  { 
    id: 'musikkproduksjon', 
    label: 'Musikkproduksjon', 
    icon: '🎵',
    description: 'Last opp demo-låter per sjanger'
  },
  { 
    id: 'settings', 
    label: 'Innstillinger', 
    icon: '⚙️',
    description: 'Sideinnstillinger og innhold'
  }
]

export default function AdminNavbar({ activeTab, onTabChange }: AdminNavbarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-black border-b border-green-500 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="text-xl font-mono font-bold text-green-500 hover:text-green-400"
            >
              <span>LYDSKOG</span>
              <span className="text-sm text-green-600 ml-2">[ADMIN]</span>
            </button>
          </div>

          {/* Main Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-2 font-mono text-sm border relative ${
                  activeTab === item.id
                    ? 'bg-green-500 text-black border-green-500'
                    : 'bg-black text-green-500 border-green-500 hover:bg-green-900 hover:text-green-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.label.toUpperCase()}</span>
                </span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-mono font-medium text-green-500">
                  {session?.user?.name?.toUpperCase()}
                </div>
                <div className="text-xs text-green-600">
                  [ADMIN]
                </div>
              </div>
              
              {/* Profile Avatar */}
              <div className="w-10 h-10 bg-green-500 border border-green-500 flex items-center justify-center text-black font-mono font-bold">
                {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-green-500 hover:text-green-400 border border-green-500 px-3 py-2 font-mono text-sm"
                title="Logg ut"
              >
                [EXIT]
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-green-500 mt-2 pt-4">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id)
                    setIsMenuOpen(false)
                  }}
                  className={`p-3 border text-left font-mono text-sm ${
                    activeTab === item.id
                      ? 'bg-green-500 text-black border-green-500'
                      : 'bg-black text-green-500 border-green-500 hover:bg-green-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <div>
                      <div className="font-bold">{item.label.toUpperCase()}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}