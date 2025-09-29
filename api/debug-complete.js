import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    console.log('🔍 COMPLETE SYSTEM DIAGNOSTIC STARTING...')
    
    const results = {
      timestamp: new Date().toISOString(),
      supabase_connection: false,
      tables: {},
      test_insert: null,
      trending_api_test: null,
      errors: []
    }

    // Test 1: Supabase Connection
    console.log('1️⃣ Testing Supabase connection...')
    try {
      const { data, error } = await supabase.from('fashion_images_new').select('count').limit(1)
      results.supabase_connection = !error
      if (error) {
        results.errors.push(`Supabase connection failed: ${error.message}`)
      }
      console.log('✅ Supabase connection:', !error)
    } catch (err) {
      results.errors.push(`Supabase connection error: ${err.message}`)
    }

    // Test 2: Check all possible table names
    console.log('2️⃣ Checking all possible table names...')
    const possibleTables = ['fashion_images_new', 'fashion_images', 'trending_images', 'images']
    
    for (const tableName of possibleTables) {
      try {
        const { data, error } = await supabase.from(tableName).select('*').limit(1)
        results.tables[tableName] = {
          exists: !error,
          error: error?.message || null,
          count: data?.length || 0
        }
        console.log(`📋 Table ${tableName}:`, !error ? 'EXISTS' : 'NOT FOUND', error?.message || '')
      } catch (err) {
        results.tables[tableName] = {
          exists: false,
          error: err.message,
          count: 0
        }
      }
    }

    // Test 3: Test insert into fashion_images_new
    console.log('3️⃣ Testing insert into fashion_images_new...')
    try {
      const testData = {
        original_url: `https://test-diagnostic-${Date.now()}.jpg`,
        title: 'Diagnostic Test Image',
        description: 'This is a test image for diagnostic purposes',
        category: 'test'
      }
      
      const { data, error } = await supabase
        .from('fashion_images_new')
        .insert([testData])
        .select()
      
      results.test_insert = {
        success: !error,
        data: data,
        error: error?.message || null
      }
      
      if (!error && data) {
        console.log('✅ Insert test successful:', data[0])
        
        // Clean up test data
        await supabase
          .from('fashion_images_new')
          .delete()
          .eq('original_url', testData.original_url)
        console.log('🧹 Test data cleaned up')
      } else {
        console.log('❌ Insert test failed:', error)
      }
    } catch (err) {
      results.test_insert = {
        success: false,
        error: err.message
      }
    }

    // Test 4: Test trending API endpoint
    console.log('4️⃣ Testing trending API...')
    try {
      const { data: trendingData, error: trendingError } = await supabase
        .from('fashion_images_new')
        .select('*')
        .order('id', { ascending: false })
        .limit(10)
      
      results.trending_api_test = {
        success: !trendingError,
        count: trendingData?.length || 0,
        sample_data: trendingData?.slice(0, 2) || [],
        error: trendingError?.message || null
      }
      
      console.log('📊 Trending API test:', !trendingError ? `${trendingData?.length || 0} images found` : 'FAILED')
    } catch (err) {
      results.trending_api_test = {
        success: false,
        error: err.message
      }
    }

    // Test 5: Check if exec_sql RPC exists
    console.log('5️⃣ Testing exec_sql RPC function...')
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: 'SELECT 1 as test'
      })
      results.exec_sql_available = !error
      if (error) {
        results.errors.push(`exec_sql RPC not available: ${error.message}`)
      }
    } catch (err) {
      results.exec_sql_available = false
      results.errors.push(`exec_sql RPC error: ${err.message}`)
    }

    console.log('🎯 DIAGNOSTIC COMPLETE')
    console.log('Results:', JSON.stringify(results, null, 2))

    return res.status(200).json({
      success: true,
      message: 'Complete system diagnostic completed',
      results: results
    })

  } catch (error) {
    console.error('❌ Diagnostic error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
