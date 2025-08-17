'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AnalyticsExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [selectedFormat, setSelectedFormat] = useState('csv')

  const handleExport = async () => {
    try {
      setIsExporting(true)
      
      const response = await fetch(`/api/analytics/export?format=${selectedFormat}&period=${selectedPeriod}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || 
        `lydskog-analytics-${selectedPeriod}d.${selectedFormat}`
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
    } catch (error) {
      console.error('Export error:', error)
      alert('Feil ved eksport. Prøv igjen.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
        <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
        Eksporter Analytics
      </h3>

      <div className="space-y-6">
        {/* Period Selection */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-3">
            Tidsperiode
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: '7', label: '7 dager' },
              { value: '30', label: '30 dager' },
              { value: '90', label: '90 dager' },
              { value: '365', label: '1 år' }
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period.value
                    ? 'bg-accent-green text-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-3">
            Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'csv', label: 'CSV (Excel)', description: 'Perfekt for Excel og dataanalyse' },
              { value: 'json', label: 'JSON', description: 'Strukturert data for utvikling' }
            ].map((format) => (
              <motion.button
                key={format.value}
                onClick={() => setSelectedFormat(format.value)}
                className={`p-4 rounded-xl text-left transition-all duration-200 ${
                  selectedFormat === format.value
                    ? 'bg-accent-green/20 border border-accent-green/30'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`font-medium ${
                  selectedFormat === format.value ? 'text-accent-green' : 'text-white'
                }`}>
                  {format.label}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {format.description}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Export Preview */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <h4 className="text-white font-medium mb-3">Eksport inneholder:</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div>
              Sammendrag og nøkkelstatistikk
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div>
              Sidevisninger og populære sider
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div>
              Enhets- og geografisk statistikk
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div>
              Event-tracking og interaksjoner
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div>
              Rådata (siste 1000 oppføringer)
            </div>
          </div>
        </div>

        {/* Export Button */}
        <motion.button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-gradient-to-r from-accent-green to-green-600 hover:from-green-500 hover:to-accent-green text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isExporting ? 1 : 1.02 }}
          whileTap={{ scale: isExporting ? 1 : 0.98 }}
        >
          {isExporting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Eksporterer...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Eksporter Analytics ({selectedPeriod} dager)
            </div>
          )}
        </motion.button>

        {/* Additional Info */}
        <div className="text-xs text-gray-400 text-center">
          Alle tider er i norsk tidssone. Data er anonymisert og følger GDPR-retningslinjer.
        </div>
      </div>
    </div>
  )
}