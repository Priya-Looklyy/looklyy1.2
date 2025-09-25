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
    console.log('🗑️ Clearing fashion_images_new table...')
    
    // Delete all records from the table
    const { error } = await supabase
      .from('fashion_images_new')
      .delete()
      .neq('id', 0) // Delete all records (id is never 0)
    
    if (error) {
      console.error('Error clearing table:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
    
    console.log('✅ Database cleared successfully')
    
    return res.status(200).json({
      success: true,
      message: 'Database cleared successfully',
      action: 'All images removed from fashion_images_new table'
    })
    
  } catch (error) {
    console.error('Clear database error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
