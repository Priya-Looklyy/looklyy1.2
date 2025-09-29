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
    console.log('🔍 Testing database structure...')
    
    // Test 1: Check if fashion_images_new table exists
    console.log('📋 Testing fashion_images_new table...')
    const { data: testData, error: testError } = await supabase
      .from('fashion_images_new')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.log('❌ fashion_images_new table error:', testError)
      
      // Test 2: Try to create the table manually
      console.log('🔧 Attempting to create fashion_images_new table...')
      const { data: createData, error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS fashion_images_new (
            id SERIAL PRIMARY KEY,
            original_url TEXT NOT NULL,
            title TEXT,
            description TEXT,
            category TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      })
      
      if (createError) {
        console.log('❌ Failed to create table:', createError)
        return res.status(200).json({
          success: false,
          error: 'Table creation failed',
          details: createError,
          suggestion: 'exec_sql RPC function may not exist'
        })
      } else {
        console.log('✅ Table created successfully')
        return res.status(200).json({
          success: true,
          message: 'fashion_images_new table created successfully',
          createResult: createData
        })
      }
    } else {
      console.log('✅ fashion_images_new table exists')
      
      // Test 3: Try a simple insert
      console.log('📝 Testing insert...')
      const { data: insertData, error: insertError } = await supabase
        .from('fashion_images_new')
        .insert([{
          original_url: 'https://test.com/image.jpg',
          title: 'Test Image',
          description: 'Test Description',
          category: 'test'
        }])
        .select()
      
      if (insertError) {
        console.log('❌ Insert failed:', insertError)
        return res.status(200).json({
          success: false,
          error: 'Insert failed',
          details: insertError,
          tableExists: true
        })
      } else {
        console.log('✅ Insert successful:', insertData)
        
        // Clean up test data
        await supabase
          .from('fashion_images_new')
          .delete()
          .eq('original_url', 'https://test.com/image.jpg')
        
        return res.status(200).json({
          success: true,
          message: 'Database structure is correct',
          testInsert: insertData,
          tableExists: true
        })
      }
    }
    
  } catch (error) {
    console.error('❌ Database test error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
