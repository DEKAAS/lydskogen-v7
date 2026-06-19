'use client'

import { useState } from 'react'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AdminNavbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: 'overview', label: 'Oversikt' },
  { id: 'projects', label: 'Prosjekter' },
  { id: 'settings', label: 'Innstillinger' }
]

export default function AdminNavbar({ activeTab, onTabChange }: AdminNavbarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/')}
              className="text-lg font-semibold text-white hover:text-gray-300 transition-colors"
            >
              Lydskog
            </button>
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Admin</span>
          </div>

          {/* Main Navigation - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  activeTab === item.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-400 hover:text-white p-2 rounded-md hover:bg-white/5 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">
                  {session?.user?.name}
                </div>
                <div className="text-xs text-gray-500">
                  Administrator
                </div>
              </div>
              
              {/* Profile Avatar */}
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white text-sm px-3 py-2 rounded-md hover:bg-white/5 transition-colors hidden sm:block"
              >
                Logg ut
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-white/5 mt-2">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id)
                    setIsMenuOpen(false)
                  }}
                  className={`p-3 text-left text-sm rounded-md transition-all ${
                    activeTab === item.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="w-full mt-3 p-3 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            >
              Logg ut
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
