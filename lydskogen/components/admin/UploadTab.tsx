'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function UploadTab() {
  const [activeUploadType, setActiveUploadType] = useState<'music' | 'artwork'>('music')
  const router = useRouter()

  const uploadOptions = {
    music: {
      title: 'Last opp musikk',
      icon: '🎵',
      description: 'Upload music tracks med metadata',
      path: '/admin/music'
    },
    artwork: {
      title: 'Last opp artwork',
      icon: '🎨', 
      description: 'Upload artwork og design filer',
      path: '/admin/artwork'
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Fil Opplasting</h2>
        <p className="text-gray-400">Last opp musikk og artwork til katalogen</p>
      </div>

      {/* Upload Type Selection */}
      <div className="flex justify-center">
        <div className="flex gap-3 p-2 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveUploadType('music')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeUploadType === 'music' 
                ? 'text-base-dark bg-accent-green' 
                : 'text-white hover:text-white/80'
            }`}
          >
            🎵 Musikk
          </button>
          <button
            onClick={() => setActiveUploadType('artwork')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeUploadType === 'artwork' 
                ? 'text-base-dark bg-accent-green' 
                : 'text-white hover:text-white/80'
            }`}
          >
            🎨 Artwork
          </button>
        </div>
      </div>

      {/* Upload Cards */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeUploadType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
          >
            <div className="text-6xl mb-6">{uploadOptions[activeUploadType].icon}</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {uploadOptions[activeUploadType].title}
            </h3>
            <p className="text-gray-400 mb-8 text-lg">
              {uploadOptions[activeUploadType].description}
            </p>
            
            <button
              onClick={() => router.push(uploadOptions[activeUploadType].path)}
              className="px-8 py-4 bg-accent-green text-base-dark font-semibold rounded-xl hover:bg-accent-green/80 transition-colors text-lg"
            >
              Gå til opplasting
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📁</span>
            Batch Upload
          </h4>
          <p className="text-gray-400 mb-4">Last opp flere filer samtidig</p>
          <button className="w-full py-2 px-4 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors">
            Kommer snart
          </button>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🔧</span>
            Metadata Editor
          </h4>
          <p className="text-gray-400 mb-4">Rediger metadata for eksisterende filer</p>
          <button className="w-full py-2 px-4 bg-purple-600/20 border border-purple-600/30 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors">
            Kommer snart
          </button>
        </motion.div>
      </div>

      {/* Usage Tips */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>💡</span>
          Tips for opplasting
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">Musikk:</h4>
            <ul className="text-sm space-y-1">
              <li>• Støttede formater: MP3, WAV, FLAC</li>
              <li>• Maks filstørrelse: 50MB</li>
              <li>• Anbefalt kvalitet: 320kbps eller høyere</li>
              <li>• Fyll ut alle metadata-felt</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Artwork:</h4>
            <ul className="text-sm space-y-1">
              <li>• Støttede formater: JPG, PNG, SVG</li>
              <li>• Maks filstørrelse: 10MB</li>
              <li>• Anbefalt oppløsning: 1200x1200px</li>
              <li>• Bruk beskrivende filnavn</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}