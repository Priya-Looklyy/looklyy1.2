// Test database connection and users table
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    console.log('Testing Supabase connection...')
    
    // Test 1: Check if users table exists
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5)

    console.log('Users table query result:', { users: users?.length || 0, error: usersError })

    // Test 2: Check table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(0)

    console.log('Table structure test:', { tableInfo, error: tableError })

    res.status(200).json({
      success: true,
      message: 'Database connection test completed',
      results: {
        usersTableExists: !usersError,
        usersCount: users?.length || 0,
        usersError: usersError?.message || null,
        tableStructureError: tableError?.message || null
      }
    })

  } catch (error) {
    console.error('Database test error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Database connection test failed'
    })
  }
}
