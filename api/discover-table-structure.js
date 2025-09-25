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
    return res.status(500).json({ success: false, error: 'Supabase client not configured' })
  }

  try {
    const results = {
      tableExists: false,
      existingColumns: [],
      workingColumns: []
    }

    // Test if table exists by trying to select from it
    console.log('Testing if fashion_images table exists...')
    try {
      const { data, error } = await supabase.from('fashion_images').select('*').limit(1)
      if (error) {
        if (error.code === 'PGRST116') {
          results.tableExists = false
          results.error = 'Table does not exist'
        } else {
          results.tableExists = true
          results.error = error.message
        }
      } else {
        results.tableExists = true
        results.message = 'Table exists and is accessible'
        if (data && data.length > 0) {
          results.existingColumns = Object.keys(data[0])
        }
      }
    } catch (tableError) {
      results.tableExists = false
      results.error = tableError.message
    }

    // If table exists, test which columns work
    if (results.tableExists) {
      console.log('Testing column combinations...')
      
      // Test common column name variations
      const columnTests = [
        { name: 'id', test: { id: 1 } },
        { name: 'url', test: { url: 'https://test.com/image.jpg' } },
        { name: 'image_url', test: { image_url: 'https://test.com/image.jpg' } },
        { name: 'source_url', test: { source_url: 'https://test.com' } },
        { name: 'title', test: { title: 'Test Image' } },
        { name: 'platform', test: { platform: 'harper-bazaar' } },
        { name: 'created_at', test: { created_at: new Date().toISOString() } },
        { name: 'updated_at', test: { updated_at: new Date().toISOString() } }
      ]

      for (const columnTest of columnTests) {
        try {
          console.log(`Testing column: ${columnTest.name}`)
          const { error } = await supabase
            .from('fashion_images')
            .insert([columnTest.test])
          
          if (!error) {
            results.workingColumns.push(columnTest.name)
            console.log(`✅ Column ${columnTest.name} works`)
          } else {
            console.log(`❌ Column ${columnTest.name} failed: ${error.message}`)
          }
        } catch (testError) {
          console.log(`❌ Column ${columnTest.name} exception: ${testError.message}`)
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Table structure discovery completed',
      results
    })

  } catch (error) {
    console.error('Table discovery error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
