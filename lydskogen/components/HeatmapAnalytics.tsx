'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface HeatmapData {
  hourlyActivity: Array<{
    hour: number
    day: string
    activity: number
  }>
  clickHeatmap: Array<{
    page: string
    element: string
    clicks: number
    percentage: number
  }>
  scrollDepth: Array<{
    page: string
    averageDepth: number
    exitPoints: Array<{ depth: number, count: number }>
  }>
}

export default function HeatmapAnalytics() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null)
  const [selectedView, setSelectedView] = useState<'hourly' | 'clicks' | 'scroll'>('hourly')

  useEffect(() => {
    // For now, generate mock heatmap data
    // In production, this would fetch from /api/analytics/heatmap
    const mockData: HeatmapData = {
      hourlyActivity: generateHourlyData(),
      clickHeatmap: [
        { page: '/', element: 'button.cta-button', clicks: 45, percentage: 78 },
        { page: '/', element: 'nav a[href="#contact"]', clicks: 32, percentage: 55 },
        { page: '/produksjon/ambient', element: '.audio-player', clicks: 28, percentage: 48 },
        { page: '/produksjon/hip-hop', element: '.download-button', clicks: 21, percentage: 36 },
        { page: '/', element: '.hero-title', clicks: 15, percentage: 26 }
      ],
      scrollDepth: [
        { 
          page: '/', 
          averageDepth: 72, 
          exitPoints: [
            { depth: 25, count: 12 },
            { depth: 50, count: 8 },
            { depth: 75, count: 15 },
            { depth: 100, count: 5 }
          ]
        },
        { 
          page: '/produksjon/ambient', 
          averageDepth: 85, 
          exitPoints: [
            { depth: 30, count: 6 },
            { depth: 60, count: 4 },
            { depth: 90, count: 12 },
            { depth: 100, count: 8 }
          ]
        }
      ]
    }
    setHeatmapData(mockData)
  }, [])

  function generateHourlyData() {
    const days = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']
    const data = []
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // Generate realistic activity patterns
        let activity = Math.random() * 20
        
        // Higher activity during day hours
        if (hour >= 9 && hour <= 17) {
          activity += Math.random() * 30
        }
        
        // Weekend patterns
        if (day === 5 || day === 6) {
          if (hour >= 10 && hour <= 14) {
            activity += Math.random() * 25
          }
        }
        
        data.push({
          hour,
          day: days[day],
          activity: Math.round(activity)
        })
      }
    }
    
    return data
  }

  function getHeatmapColor(value: number, max: number) {
    const intensity = value / max
    if (intensity === 0) return 'bg-gray-800/20'
    if (intensity < 0.2) return 'bg-accent-green/20'
    if (intensity < 0.4) return 'bg-accent-green/40'
    if (intensity < 0.6) return 'bg-accent-green/60'
    if (intensity < 0.8) return 'bg-accent-green/80'
    return 'bg-accent-green'
  }

  if (!heatmapData) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="h-32 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  const maxActivity = Math.max(...heatmapData.hourlyActivity.map(d => d.activity))

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
      {/* Header with View Selector */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Heatmap Analytics</h3>
        <div className="flex bg-white/5 rounded-lg p-1">
          {[
            { key: 'hourly', label: 'Timeaktivitet' },
            { key: 'clicks', label: 'Klikk' },
            { key: 'scroll', label: 'Scroll' }
          ].map((view) => (
            <button
              key={view.key}
              onClick={() => setSelectedView(view.key as any)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedView === view.key
                  ? 'bg-accent-green text-black font-medium'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hourly Activity Heatmap */}
      {selectedView === 'hourly' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-25 gap-1">
            {/* Hour labels */}
            <div></div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="text-xs text-gray-400 text-center">
                {i % 6 === 0 ? i : ''}
              </div>
            ))}
            
            {/* Heatmap grid */}
            {['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'].map((day, dayIndex) => (
              <React.Fragment key={day}>
                <div className="text-sm text-gray-400 text-right pr-2">{day}</div>
                {Array.from({ length: 24 }, (_, hour) => {
                  const dataPoint = heatmapData.hourlyActivity.find(
                    d => d.day === day && d.hour === hour
                  )
                  const activity = dataPoint?.activity || 0
                  return (
                    <motion.div
                      key={`${day}-${hour}`}
                      className={`w-4 h-4 rounded-sm ${getHeatmapColor(activity, maxActivity)} cursor-pointer`}
                      whileHover={{ scale: 1.2 }}
                      title={`${day} ${hour}:00 - ${activity} aktiviteter`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (dayIndex * 24 + hour) * 0.01 }}
                    />
                  )
                })}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Mindre aktivitet</span>
            <div className="flex gap-1">
              {['bg-gray-800/20', 'bg-accent-green/20', 'bg-accent-green/40', 'bg-accent-green/60', 'bg-accent-green/80', 'bg-accent-green'].map((color, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
              ))}
            </div>
            <span>Mer aktivitet</span>
          </div>
        </motion.div>
      )}

      {/* Click Heatmap */}
      {selectedView === 'clicks' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {heatmapData.clickHeatmap.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 p-4 rounded-xl border border-white/5"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{item.element}</span>
                <span className="text-accent-green font-bold">{item.clicks} klikk</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{item.page}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-accent-green h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  />
                </div>
                <span>{item.percentage}%</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Scroll Depth */}
      {selectedView === 'scroll' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {heatmapData.scrollDepth.map((page, index) => (
            <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-medium">{page.page}</h4>
                <span className="text-accent-green font-bold">
                  {page.averageDepth}% gjennomsnittlig scroll
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-400 mb-2">Exit points:</div>
                {page.exitPoints.map((exit, exitIndex) => (
                  <div key={exitIndex} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-12">{exit.depth}%</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-red-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(exit.count / Math.max(...page.exitPoints.map(e => e.count))) * 100}%` }}
                        transition={{ delay: index * 0.2 + exitIndex * 0.1 }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{exit.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}