'use client'

import { useState, useEffect } from 'react'

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
      <div className="border border-green-500 bg-black p-6">
        <div className="space-y-4">
          <div className="h-6 bg-green-900/20 w-1/3"></div>
          <div className="h-20 bg-green-900/20"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-green-500 bg-black p-6">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between mb-6 border-b border-green-500 pb-4">
        <h3 className="text-xl font-mono font-bold text-green-500 flex items-center gap-3">
          <div className={`w-3 h-3 bg-green-500 ${isLive ? 'animate-pulse' : 'opacity-30'}`}></div>
          LIVE ANALYTICS
        </h3>
        <span className="text-xs text-green-600 font-mono">
          {new Date(liveData.timestamp).toLocaleTimeString('no-NO')}
        </span>
      </div>

      {/* Live Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-green-500 bg-black p-4">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-green-500 mb-2">
              {liveData.activeVisitors}
            </div>
            <div className="text-sm text-green-600 font-mono">AKTIVE BESØKENDE</div>
          </div>
        </div>

        <div className="border border-green-500 bg-black p-4">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-green-500 mb-2">
              {liveData.recentViews}
            </div>
            <div className="text-sm text-green-600 font-mono">SISTE TIME</div>
          </div>
        </div>

        <div className="border border-green-500 bg-black p-4">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-green-500 mb-2">
              {liveData.recentEvents}
            </div>
            <div className="text-sm text-green-600 font-mono">INTERAKSJONER</div>
          </div>
        </div>
      </div>

      {/* Current Page Viewers */}
      <div className="mb-6">
        <h4 className="text-lg font-mono font-bold text-green-500 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500"></span>
          SIDER SOM VISES NÅ
        </h4>
        <div className="space-y-2">
          {liveData.topCurrentPages.map((page, index) => (
            <div
              key={page.page}
              className="flex justify-between items-center p-3 border border-green-500 bg-black"
            >
              <span className="text-green-400 font-mono text-sm truncate">{page.page}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500"></div>
                <span className="text-green-500 font-mono font-bold">{page.viewers}</span>
              </div>
            </div>
          ))}
          {liveData.topCurrentPages.length === 0 && (
            <div className="text-center text-green-600 font-mono py-4">
              INGEN AKTIVE BESØKENDE
            </div>
          )}
        </div>
      </div>

      {/* Recent Events Stream */}
      <div>
        <h4 className="text-lg font-mono font-bold text-green-500 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500"></span>
          LIVE AKTIVITET
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {liveData.recentEventsList.map((event, index) => (
            <div
              key={`${event.created_at}-${index}`}
              className="flex items-center gap-3 p-2 border border-green-500 bg-black text-sm"
            >
              <div className={`w-2 h-2 ${
                event.event_type === 'click' ? 'bg-green-400' :
                event.event_type === 'audio_play' ? 'bg-green-500' :
                event.event_type === 'form_submit' ? 'bg-green-600' :
                'bg-green-700'
              }`} />
              <span className="text-green-400 font-mono flex-1 truncate">
                <span className="font-bold">{event.event_name}</span>
                {event.element_text && (
                  <span className="text-green-600"> - {event.element_text.substring(0, 30)}...</span>
                )}
              </span>
              <span className="text-xs text-green-600 font-mono">
                {new Date(event.created_at).toLocaleTimeString('no-NO', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
          ))}
          {liveData.recentEventsList.length === 0 && (
            <div className="text-center text-green-600 font-mono py-4">
              INGEN NYLIGE AKTIVITETER
            </div>
          )}
        </div>
      </div>
    </div>
  )
}