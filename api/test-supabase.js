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

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('Testing Supabase connection...')
    
    // Test 2: Try to read from users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    console.log('Supabase query result:', { data, error })

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Supabase connection failed',
        details: error.message,
        code: error.code
      })
    }

    // Test 3: Try to insert a test record
    const testUser = {
      name: 'Test User',
      email: 'test@test.com',
      password: 'hashedpassword',
      avatar: 'https://example.com/avatar.jpg',
      preferences: { theme: 'purple', notifications: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select()

    console.log('Insert test result:', { insertData, insertError })

    res.status(200).json({
      success: true,
      message: 'Supabase connection working',
      readTest: { data, error },
      insertTest: { insertData, insertError }
    })

  } catch (error) {
    console.error('Test error:', error)
    res.status(500).json({
      success: false,
      error: 'Test failed',
      details: error.message
    })
  }
}
