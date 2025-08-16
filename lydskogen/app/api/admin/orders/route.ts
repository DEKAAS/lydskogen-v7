import { NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ordersFile = path.join(process.cwd(), 'data/orders.json')

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

async function ensureOrdersFile() {
  try {
    await mkdir(path.dirname(ordersFile), { recursive: true })
    await readFile(ordersFile, 'utf-8')
  } catch (error) {
    // File doesn't exist, create it
    await writeFile(ordersFile, JSON.stringify({ orders: [] }, null, 2))
  }
}

export async function GET() {
  try {
    await ensureOrdersFile()
    const data = await readFile(ordersFile, 'utf-8')
    const ordersData = JSON.parse(data)
    
    // Sort by creation date (newest first)
    const sortedOrders = ordersData.orders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return NextResponse.json({ orders: sortedOrders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ orders: [], error: 'Failed to fetch orders' })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, name, email, phone, subject, message, formData, source, status: initialStatus } = body
    
    await ensureOrdersFile()
    const data = await readFile(ordersFile, 'utf-8')
    const ordersData = JSON.parse(data)
    
    const allowedStatuses: Order['status'][] = ['new', 'processing', 'completed', 'cancelled']
    const resolvedStatus: Order['status'] = allowedStatuses.includes(initialStatus)
      ? initialStatus as Order['status']
      : 'new'

    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name,
      email,
      phone,
      subject,
      message,
      formData,
      status: resolvedStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source
    }
    
    ordersData.orders.push(newOrder)
    
    await writeFile(ordersFile, JSON.stringify(ordersData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order saved successfully',
      order: newOrder 
    })
  } catch (error) {
    console.error('Error saving order:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save order' 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { orderId, status } = body
    
    await ensureOrdersFile()
    const data = await readFile(ordersFile, 'utf-8')
    const ordersData = JSON.parse(data)
    
    const orderIndex = ordersData.orders.findIndex((order: Order) => order.id === orderId)
    
    if (orderIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 })
    }
    
    ordersData.orders[orderIndex].status = status
    ordersData.orders[orderIndex].updatedAt = new Date().toISOString()
    
    await writeFile(ordersFile, JSON.stringify(ordersData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order status updated successfully',
      order: ordersData.orders[orderIndex]
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update order status' 
    }, { status: 500 })
  }
}