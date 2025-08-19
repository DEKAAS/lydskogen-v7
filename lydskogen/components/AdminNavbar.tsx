'use client'

import { useState } from 'react'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from 'framer-motion'

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
    id: 'upload', 
    label: 'Opplasting', 
    icon: '⬆️',
    description: 'Last opp filer'
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
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="text-xl font-bold text-white hover:text-accent-green transition-colors"
            >
              <span className="bg-gradient-to-r from-accent-green to-accent-green/70 bg-clip-text text-transparent">
                Lydskog
              </span>
              <span className="text-sm text-gray-400 ml-2">Admin</span>
            </button>
          </div>

          {/* Main Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 relative group ${
                  activeTab === item.id
                    ? 'text-base-dark'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{
                  background: activeTab === item.id 
                    ? 'var(--accent-green)' 
                    : 'transparent'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                
                {/* Tooltip */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.description}
                </div>
              </motion.button>
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
                <div className="text-sm font-medium text-white">
                  {session?.user?.name}
                </div>
                <div className="text-xs text-gray-400">
                  Administrator
                </div>
              </div>
              
              {/* Profile Avatar */}
              <div className="w-10 h-10 bg-accent-green rounded-full flex items-center justify-center text-base-dark font-semibold">
                {session?.user?.name?.charAt(0) || 'A'}
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors p-2"
                title="Logg ut"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden pb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id)
                    setIsMenuOpen(false)
                  }}
                  className={`p-3 rounded-xl text-left transition-all duration-300 ${
                    activeTab === item.id
                      ? 'text-base-dark'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  style={{
                    background: activeTab === item.id 
                      ? 'var(--accent-green)' 
                      : 'transparent'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}