import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('Testing analytics tables...')

    // Test if tables exist by trying to query them
    const tests = []

    // Test page_views table
    try {
      const { data, error } = await supabaseAdmin
        .from('page_views')
        .select('count(*)')
        .limit(1)
      
      if (error) {
        tests.push({ table: 'page_views', status: 'error', message: error.message })
      } else {
        tests.push({ table: 'page_views', status: 'ok', message: 'Table accessible' })
      }
    } catch (e: any) {
      tests.push({ table: 'page_views', status: 'error', message: e.message })
    }

    // Test analytics_events table
    try {
      const { data, error } = await supabaseAdmin
        .from('analytics_events')
        .select('count(*)')
        .limit(1)
      
      if (error) {
        tests.push({ table: 'analytics_events', status: 'error', message: error.message })
      } else {
        tests.push({ table: 'analytics_events', status: 'ok', message: 'Table accessible' })
      }
    } catch (e: any) {
      tests.push({ table: 'analytics_events', status: 'error', message: e.message })
    }

    // Test active_sessions table
    try {
      const { data, error } = await supabaseAdmin
        .from('active_sessions')
        .select('count(*)')
        .limit(1)
      
      if (error) {
        tests.push({ table: 'active_sessions', status: 'error', message: error.message })
      } else {
        tests.push({ table: 'active_sessions', status: 'ok', message: 'Table accessible' })
      }
    } catch (e: any) {
      tests.push({ table: 'active_sessions', status: 'error', message: e.message })
    }

    // Check if all tables are working
    const allWorking = tests.every(t => t.status === 'ok')

    return NextResponse.json({
      success: true,
      allTablesWorking: allWorking,
      tests,
      message: allWorking 
        ? 'All analytics tables are working properly!' 
        : 'Some analytics tables need to be created manually in Supabase dashboard',
      instruction: !allWorking 
        ? 'Go to Supabase Dashboard -> SQL Editor -> Run the SQL from supabase/migrations/create_analytics_tables.sql'
        : null
    })

  } catch (error: any) {
    console.error('Analytics setup test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: 'Failed to test analytics tables'
    }, { status: 500 })
  }
}