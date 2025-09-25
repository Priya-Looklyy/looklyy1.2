import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!supabase) {
    return res.status(500).json({ 
      success: false, 
      error: 'Supabase is not configured' 
    })
  }

  try {
    console.log('🔍 Testing database connection and table structure...')
    
    // Test 1: Check if table exists
    const { data: tableData, error: tableError } = await supabase
      .from('fashion_images_new')
      .select('*')
      .limit(1)
    
    console.log('📊 Table test result:', { tableData, tableError })
    
    // Test 2: Try to insert a simple record
    const { data: insertData, error: insertError } = await supabase
      .from('fashion_images_new')
      .insert([{
        original_url: 'https://test.com/image.jpg',
        title: 'Test Image',
        description: 'Test Description',
        category: 'test'
      }])
      .select()
    
    console.log('📝 Insert test result:', { insertData, insertError })
    
    // Test 3: Count existing records
    const { count, error: countError } = await supabase
      .from('fashion_images_new')
      .select('*', { count: 'exact', head: true })
    
    console.log('🔢 Count result:', { count, countError })
    
    return res.status(200).json({
      success: true,
      results: {
        table_exists: !tableError,
        table_error: tableError?.message,
        insert_success: !insertError,
        insert_error: insertError?.message,
        total_records: count,
        count_error: countError?.message
      }
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
