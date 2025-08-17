'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LiveAnalytics {
  activeVisitors: number
  recentViews: number
  recentEvents: number
  topCurrentPages: Array<{
    page: string
    viewers: number
  }>
  activeSessions: Array<{
    session_id: string
    page_url: string
    last_seen: string
    country?: string
    device_type?: string
  }>
  recentEventsList: Array<{
    event_name: string
    event_type: string
    page_url: string
    created_at: string
    element_text?: string
  }>
  timestamp: string
}

export default function RealTimeAnalytics() {
  const [liveData, setLiveData] = useState<LiveAnalytics | null>(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    const fetchLiveData = async () => {
      try {
        const response = await fetch('/api/analytics/live')
        if (response.ok) {
          const data = await response.json()
          setLiveData(data)
          setIsLive(true)
        }
      } catch (error) {
        console.error('Failed to fetch live data:', error)
        setIsLive(false)
      }
    }

    // Initial fetch
    fetchLiveData()

    // Set up polling every 10 seconds
    interval = setInterval(fetchLiveData, 10000)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  if (!liveData) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="h-20 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-3">
          <motion.div
            className="w-3 h-3 bg-red-500 rounded-full"
            animate={{ opacity: isLive ? [1, 0.3, 1] : 0.3 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Live Analytics
        </h3>
        <span className="text-xs text-gray-400">
          Oppdatert: {new Date(liveData.timestamp).toLocaleTimeString('no-NO')}
        </span>
      </div>

      {/* Live Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div 
          className="bg-white/5 p-4 rounded-xl border border-white/5"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-center">
            <motion.div
              key={liveData.activeVisitors}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-accent-green"
            >
              {liveData.activeVisitors}
            </motion.div>
            <div className="text-sm text-gray-400">Aktive besøkende</div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/5 p-4 rounded-xl border border-white/5"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-center">
            <motion.div
              key={liveData.recentViews}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-blue-400"
            >
              {liveData.recentViews}
            </motion.div>
            <div className="text-sm text-gray-400">Siste time</div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/5 p-4 rounded-xl border border-white/5"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-center">
            <motion.div
              key={liveData.recentEvents}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-purple-400"
            >
              {liveData.recentEvents}
            </motion.div>
            <div className="text-sm text-gray-400">Interaksjoner</div>
          </div>
        </motion.div>
      </div>

      {/* Current Page Viewers */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-3">Sider som vises nå</h4>
        <div className="space-y-2">
          <AnimatePresence>
            {liveData.topCurrentPages.map((page, index) => (
              <motion.div
                key={page.page}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5"
              >
                <span className="text-gray-300 truncate">{page.page}</span>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-accent-green font-medium">{page.viewers}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {liveData.topCurrentPages.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              Ingen aktive besøkende akkurat nå
            </div>
          )}
        </div>
      </div>

      {/* Recent Events Stream */}
      <div>
        <h4 className="text-lg font-medium text-white mb-3">Live aktivitet</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <AnimatePresence>
            {liveData.recentEventsList.map((event, index) => (
              <motion.div
                key={`${event.created_at}-${index}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5 text-sm"
              >
                <div className={`w-2 h-2 rounded-full ${
                  event.event_type === 'click' ? 'bg-blue-400' :
                  event.event_type === 'audio_play' ? 'bg-green-400' :
                  event.event_type === 'form_submit' ? 'bg-purple-400' :
                  'bg-gray-400'
                }`} />
                <span className="text-gray-300 flex-1 truncate">
                  <span className="font-medium">{event.event_name}</span>
                  {event.element_text && (
                    <span className="text-gray-400"> - {event.element_text.substring(0, 30)}...</span>
                  )}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(event.created_at).toLocaleTimeString('no-NO', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {liveData.recentEventsList.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              Ingen nylige aktiviteter
            </div>
          )}
        </div>
      </div>
    </div>
  )
}