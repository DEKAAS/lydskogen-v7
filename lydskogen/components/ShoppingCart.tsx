'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { state, removeItem, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (state.items.length === 0) return

    setIsCheckingOut(true)
    try {
      // Create a combined checkout session with all items
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: state.items.map(item => ({
            productName: item.title,
            productId: item.id,
            productType: item.type,
            genre: item.type === 'music' ? 'mixed' : 'artwork',
            amount: Math.max(0, Math.round(item.price * 100)), // Convert to cents
            quantity: item.quantity
          })),
          totalAmount: Math.round(state.total * 100)
        })
      })

      const data = await response.json()
      if (response.ok && data?.url) {
        window.location.href = data.url
        return
      } else {
        throw new Error('Checkout failed')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      // Fallback to email
      const itemList = state.items.map(item => 
        `- ${item.title} ${item.artist ? `av ${item.artist}` : ''} (${item.price} kr)`
      ).join('\n')
      
      const subject = 'Lydskog Bestilling'
      const body = `Hei Lydskog!\n\nJeg vil gjerne kjøpe følgende varer:\n\n${itemList}\n\nTotalt: ${state.total} kr\n\nKan dere kontakte meg for å gjennomføre kjøpet?\n\nMvh,\n[Ditt navn]`
      
      window.location.href = `mailto:lydskog@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                className="relative w-full max-w-2xl bg-base-dark rounded-2xl border border-white/20 shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      🛒 Handlekurv
                      {state.itemCount > 0 && (
                        <span className="bg-accent-green text-base-dark text-sm px-2 py-1 rounded-full font-medium">
                          {state.itemCount}
                        </span>
                      )}
                    </h2>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-white transition-colors p-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="p-6">
                  {state.items.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🛒</div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Handlekurven er tom
                      </h3>
                      <p className="text-gray-400">
                        Legg til musikk eller artwork for å komme i gang!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {state.items.map((item) => (
                        <motion.div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          {/* Item Image/Icon */}
                          <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                            {item.type === 'music' ? (
                              <span className="text-2xl">🎵</span>
                            ) : (
                              <span className="text-2xl">🎨</span>
                            )}
                          </div>

                          {/* Item Details */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{item.title}</h4>
                            {item.artist && (
                              <p className="text-sm text-gray-300">av {item.artist}</p>
                            )}
                            <p className="text-sm text-gray-400 capitalize">{item.type}</p>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-semibold text-white">
                              {item.price} kr
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-gray-400">
                                {item.quantity} stk
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2"
                            title="Fjern fra handlekurv"
                          >
                            🗑️
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {state.items.length > 0 && (
                  <div className="p-6 border-t border-white/10">
                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-semibold text-white">Total:</span>
                      <span className="text-2xl font-bold text-accent-green">
                        {state.total} kr
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={clearCart}
                        className="flex-1 py-3 px-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                      >
                        Tøm kurv
                      </button>
                      <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="flex-1 py-3 px-4 bg-accent-green text-base-dark font-semibold rounded-lg hover:bg-accent-green/80 disabled:opacity-50 transition-colors"
                      >
                        {isCheckingOut ? 'Behandler...' : `Gå til kasse (${state.total} kr)`}
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-400">
                        Sikker betaling via Stripe eller direkte kontakt
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}