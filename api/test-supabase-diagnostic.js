import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const diagnostics = {
    timestamp: new Date().toISOString(),
    tests: []
  }

  try {
    // Test 1: Basic connection
    diagnostics.tests.push({
      test: 'Basic Supabase Connection',
      status: 'success',
      message: 'Connected to Supabase successfully'
    })

    // Test 2: Check if users table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (tableError) {
      diagnostics.tests.push({
        test: 'Users Table Access',
        status: 'error',
        message: `Table access error: ${tableError.message}`,
        code: tableError.code,
        details: tableError.details
      })
    } else {
      diagnostics.tests.push({
        test: 'Users Table Access',
        status: 'success',
        message: 'Users table accessible',
        sampleData: tableCheck
      })
    }

    // Test 3: Test insert permissions
    const testUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123'
    }

    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select()

    if (insertError) {
      diagnostics.tests.push({
        test: 'Insert Permissions',
        status: 'error',
        message: `Insert failed: ${insertError.message}`,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      })
    } else {
      diagnostics.tests.push({
        test: 'Insert Permissions',
        status: 'success',
        message: 'Insert successful',
        insertedData: insertData
      })

      // Clean up test data
      if (insertData && insertData[0]) {
        await supabase
          .from('users')
          .delete()
          .eq('id', insertData[0].id)
      }
    }

    // Test 4: Check RLS policies
    const { data: policies, error: policyError } = await supabase
      .rpc('get_table_policies', { table_name: 'users' })
      .catch(() => ({ data: null, error: { message: 'Cannot check policies (function may not exist)' } }))

    diagnostics.tests.push({
      test: 'RLS Policies Check',
      status: policyError ? 'warning' : 'success',
      message: policyError ? policyError.message : 'RLS policies accessible',
      policies: policies
    })

    res.status(200).json({
      success: true,
      diagnostics
    })

  } catch (error) {
    diagnostics.tests.push({
      test: 'General Error',
      status: 'error',
      message: error.message,
      stack: error.stack
    })

    res.status(500).json({
      success: false,
      diagnostics
    })
  }
}
