'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'

interface Order {
  id: string
  type: 'contact' | 'artwork' | 'music-production' | 'custom-artwork'
  name: string
  email: string
  phone?: string
  subject: string
  message?: string
  formData?: any
  status: 'new' | 'processing' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  source: string
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'processing' | 'completed'>('all')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'admin') {
      redirect('/admin')
      return
    }
    fetchOrders()
  }, [session, status])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        ))
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new': return 'text-blue-400 bg-blue-400/10'
      case 'processing': return 'text-yellow-400 bg-yellow-400/10'
      case 'completed': return 'text-green-400 bg-green-400/10'
      case 'cancelled': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getTypeIcon = (type: Order['type']) => {
    switch (type) {
      case 'contact': return '📧'
      case 'artwork': return '🎨'
      case 'music-production': return '🎵'
      case 'custom-artwork': return '✨'
      default: return '📋'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-base-dark flex items-center justify-center">
        <div className="text-white text-xl">Laster...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-dark text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Bestillinger & Henvendelser</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-accent-green text-base-dark' : 'bg-secondary-dark text-white hover:bg-white/10'
              }`}
            >
              Alle ({orders.length})
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'new' ? 'bg-accent-green text-base-dark' : 'bg-secondary-dark text-white hover:bg-white/10'
              }`}
            >
              Nye ({orders.filter(o => o.status === 'new').length})
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'processing' ? 'bg-accent-green text-base-dark' : 'bg-secondary-dark text-white hover:bg-white/10'
              }`}
            >
              Behandles ({orders.filter(o => o.status === 'processing').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed' ? 'bg-accent-green text-base-dark' : 'bg-secondary-dark text-white hover:bg-white/10'
              }`}
            >
              Fullført ({orders.filter(o => o.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              className="bg-secondary-dark rounded-lg p-6 border border-white/10 hover:border-accent-green/50 transition-colors cursor-pointer"
              whileHover={{ y: -2 }}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(order.type)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{order.subject}</h3>
                    <p className="text-gray-400 text-sm">
                      {order.name} • {order.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('no')}
                  </span>
                </div>
              </div>
              
              {order.message && (
                <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                  {order.message}
                </p>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    updateOrderStatus(order.id, 'processing')
                  }}
                  disabled={order.status === 'processing'}
                  className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded text-sm hover:bg-yellow-600/30 disabled:opacity-50 transition-colors"
                >
                  Behandle
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    updateOrderStatus(order.id, 'completed')
                  }}
                  disabled={order.status === 'completed'}
                  className="px-3 py-1 bg-green-600/20 text-green-400 rounded text-sm hover:bg-green-600/30 disabled:opacity-50 transition-colors"
                >
                  Fullfør
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">Ingen bestillinger funnet</h3>
            <p className="text-gray-400">
              {filter === 'all' ? 'Det er ingen bestillinger ennå.' : `Ingen bestillinger med status "${filter}".`}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-base-dark rounded-lg border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {getTypeIcon(selectedOrder.type)} {selectedOrder.subject}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Kunde:</h4>
                  <p>{selectedOrder.name}</p>
                  <p className="text-gray-400">{selectedOrder.email}</p>
                  {selectedOrder.phone && <p className="text-gray-400">{selectedOrder.phone}</p>}
                </div>

                {selectedOrder.message && (
                  <div>
                    <h4 className="font-semibold mb-1">Melding:</h4>
                    <p className="text-gray-300">{selectedOrder.message}</p>
                  </div>
                )}

                {selectedOrder.formData && (
                  <div>
                    <h4 className="font-semibold mb-1">Detaljer:</h4>
                    <div className="bg-secondary-dark p-4 rounded text-sm">
                      <pre className="whitespace-pre-wrap text-gray-300">
                        {JSON.stringify(selectedOrder.formData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-400">
                  <p>Opprettet: {new Date(selectedOrder.createdAt).toLocaleString('no')}</p>
                  <p>Oppdatert: {new Date(selectedOrder.updatedAt).toLocaleString('no')}</p>
                  <p>Kilde: {selectedOrder.source}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    className="flex-1 py-2 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors"
                  >
                    Merk som behandles
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                    className="flex-1 py-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors"
                  >
                    Merk som fullført
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}