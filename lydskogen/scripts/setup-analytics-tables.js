const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read environment variables from .env.local file manually
const envPath = path.join(__dirname, '../.env.local')
let supabaseUrl = ''
let supabaseServiceKey = ''

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')
  
  lines.forEach(line => {
    const [key, value] = line.split('=')
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      supabaseUrl = value?.replace(/"/g, '')
    }
    if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
      supabaseServiceKey = value?.replace(/"/g, '')
    }
  })
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please check .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupAnalyticsTables() {
  console.log('🔧 Setting up analytics tables...')

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../supabase/migrations/create_analytics_tables.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Split SQL into individual statements and execute them
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (!statement) continue

      console.log(`Executing statement ${i + 1}/${statements.length}...`)
      
      const { error } = await supabase.rpc('exec_sql', { 
        sql_string: statement 
      })
      
      if (error) {
        console.warn(`Warning on statement ${i + 1}:`, error.message)
        // Continue with other statements even if one fails
      }
    }

    console.log('✅ Analytics tables setup completed!')

    // Test the tables by checking if they exist
    console.log('🧪 Testing table access...')
    
    const { data: pageViews, error: pageViewsError } = await supabase
      .from('page_views')
      .select('count(*)')
      .limit(1)

    const { data: events, error: eventsError } = await supabase
      .from('analytics_events')  
      .select('count(*)')
      .limit(1)

    const { data: sessions, error: sessionsError } = await supabase
      .from('active_sessions')
      .select('count(*)')
      .limit(1)

    if (!pageViewsError) {
      console.log('✅ page_views table is accessible')
    } else {
      console.error('❌ page_views table error:', pageViewsError.message)
    }

    if (!eventsError) {
      console.log('✅ analytics_events table is accessible')
    } else {
      console.error('❌ analytics_events table error:', eventsError.message)
    }

    if (!sessionsError) {
      console.log('✅ active_sessions table is accessible')
    } else {
      console.error('❌ active_sessions table error:', sessionsError.message)
    }

  } catch (error) {
    console.error('❌ Error setting up analytics tables:', error)
  }
}

// Alternative approach - try direct SQL execution
async function setupAnalyticsTablesAlt() {
  console.log('🔧 Alternative setup - executing SQL directly...')
  
  try {
    // Create page_views table
    const { error: pageViewsError } = await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS page_views (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          page_url text NOT NULL,
          referrer text,
          user_agent text,
          ip_address text,
          session_id text,
          country text,
          city text,
          device_type text CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
          browser text,
          created_at timestamp with time zone DEFAULT now()
        )
      `
    })

    if (pageViewsError) {
      console.log('Trying direct table creation...')
      // If RPC doesn't work, try direct table access
      const { error } = await supabase
        .from('page_views')
        .select('*')
        .limit(0)
        
      if (error) {
        console.error('Tables may not exist. This is expected on first setup.')
        console.log('Please run the SQL migration manually in Supabase dashboard:')
        console.log('Go to: https://app.supabase.com -> SQL Editor -> Run the SQL from:')
        console.log(path.join(__dirname, '../supabase/migrations/create_analytics_tables.sql'))
      }
    }

    console.log('✅ Setup completed (check logs for any issues)')

  } catch (error) {
    console.error('Setup error:', error.message)
    console.log('\n📝 Manual setup required:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Open SQL Editor')
    console.log('3. Copy and run the contents of: supabase/migrations/create_analytics_tables.sql')
  }
}

setupAnalyticsTablesAlt()