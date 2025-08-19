'use client'

import { motion } from 'framer-motion'

export default function OrdersTab() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Bestillinger & Salg</h2>
        <p className="text-gray-400">Administrer bestillinger og generer salgsrapporter</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span>🛍️</span>
            Nyeste bestillinger
          </h3>
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-4">📦</div>
            <p>Ingen bestillinger ennå</p>
            <p className="text-sm mt-2">Bestillinger vil vises her når de kommer inn</p>
          </div>
        </motion.div>

        {/* Sales Stats */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span>💰</span>
            Salgsstatistikk
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
              <span className="text-gray-300">Total omsetning</span>
              <span className="text-white font-semibold">0 kr</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
              <span className="text-gray-300">Antall salg</span>
              <span className="text-white font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
              <span className="text-gray-300">Gjennomsnittlig ordresum</span>
              <span className="text-white font-semibold">0 kr</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Handlinger</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-colors font-medium flex items-center gap-3">
            <span>📊</span>
            Generer salgsrapport
          </button>
          
          <button className="p-4 bg-green-600/20 border border-green-600/30 text-green-400 rounded-xl hover:bg-green-600/30 transition-colors font-medium flex items-center gap-3">
            <span>💳</span>
            Stripe Dashboard
          </button>
          
          <button className="p-4 bg-purple-600/20 border border-purple-600/30 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-colors font-medium flex items-center gap-3">
            <span>📧</span>
            E-post bestillinger
          </button>
        </div>
      </div>
    </div>
  )
}