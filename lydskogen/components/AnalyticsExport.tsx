'use client'

import { useState } from 'react'

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
    <div className="border border-green-500 bg-black p-6">
      <h3 className="text-xl font-mono font-bold text-green-500 mb-6 flex items-center gap-3">
        <span className="w-2 h-2 bg-green-500"></span>
        EKSPORTER ANALYTICS
      </h3>

      <div className="space-y-6">
        {/* Period Selection */}
        <div>
          <label className="block text-green-600 font-mono text-sm mb-3">
            TIDSPERIODE
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: '7', label: '7 DAGER' },
              { value: '30', label: '30 DAGER' },
              { value: '90', label: '90 DAGER' },
              { value: '365', label: '1 ÅR' }
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`p-3 border font-mono text-sm ${
                  selectedPeriod === period.value
                    ? 'bg-green-500 text-black border-green-500'
                    : 'bg-black text-green-500 border-green-500 hover:bg-green-500 hover:text-black'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-green-600 font-mono text-sm mb-3">
            FORMAT
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'csv', label: 'CSV', description: 'Excel & dataanalyse' },
              { value: 'json', label: 'JSON', description: 'Strukturert data' }
            ].map((format) => (
              <button
                key={format.value}
                onClick={() => setSelectedFormat(format.value)}
                className={`p-4 border text-left font-mono ${
                  selectedFormat === format.value
                    ? 'bg-green-500 text-black border-green-500'
                    : 'bg-black text-green-500 border-green-500 hover:bg-green-500 hover:text-black'
                }`}
              >
                <div className="font-bold text-sm mb-1">
                  {format.label}
                </div>
                <div className="text-xs text-green-600">
                  {format.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Preview */}
        <div className="border border-green-500 bg-black p-4">
          <h4 className="text-green-500 font-mono font-bold mb-3">EKSPORT INNEHOLDER:</h4>
          <div className="space-y-2 text-sm text-green-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500"></span>
              Sammendrag og nøkkelstatistikk
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500"></span>
              Sidevisninger og populære sider
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500"></span>
              Enhets- og geografisk statistikk
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500"></span>
              Event-tracking og interaksjoner
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500"></span>
              Rådata (siste 1000 oppføringer)
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full border border-green-500 bg-black text-green-500 font-mono font-bold py-4 px-6 hover:bg-green-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <div className="flex items-center justify-center gap-2">
              <span>[EXPORTING...]</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>[EXPORT]</span> {selectedPeriod} DAGER
            </div>
          )}
        </button>

        {/* Additional Info */}
        <div className="text-xs text-green-600 font-mono text-center">
          Alle tider er i norsk tidssone. Data er anonymisert og følger GDPR-retningslinjer.
        </div>
      </div>
    </div>
  )
}