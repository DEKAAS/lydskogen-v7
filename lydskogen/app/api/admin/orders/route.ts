import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface Order {
  id: string
  type: 'contact' | 'artwork' | 'music-production' | 'custom-artwork'
  name: string
  email: string
  phone?: string
  subject: string
  message?: string
  form_data?: any
  status: 'new' | 'processing' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  source: string
}

export async function GET() {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ orders: [], error: 'Failed to fetch orders' })
    }
    
    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ orders: [], error: 'Failed to fetch orders' })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, name, email, phone, subject, message, formData, source, status: initialStatus } = body
    
    const allowedStatuses: Order['status'][] = ['new', 'processing', 'completed', 'cancelled']
    const resolvedStatus: Order['status'] = allowedStatuses.includes(initialStatus)
      ? initialStatus as Order['status']
      : 'new'

    // Adapt to existing orders table structure
    const { data: newOrder, error } = await supabaseAdmin
      .from('orders')
      .insert({
        total_amount: 0, // Default value
        currency: 'NOK',
        status: resolvedStatus,
        payment_method: 'contact', // Since these are contact forms
        order_items: {
          type,
          name,
          email,
          phone,
          subject,
          message,
          formData,
          source
        }
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error saving order:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to save order' 
      }, { status: 500 })
    }
    
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
    
    const { data: updatedOrder, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        status
      })
      .eq('id', orderId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating order status:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found or failed to update' 
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order status updated successfully',
      order: updatedOrder
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update order status' 
    }, { status: 500 })
  }
}