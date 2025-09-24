import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!supabase) {
    return res.status(500).json({ 
      success: false, 
      error: 'Supabase is not configured' 
    })
  }

  try {
    console.log('Starting daily crawl...')
    
    // Simple test - just return success for now
    const result = {
      success: true,
      message: 'Daily crawl test successful',
      results: {
        sections_crawled: 0,
        images_found: 0,
        images_stored: 0,
        errors: 0,
        status: 'test'
      }
    }
    
    return res.status(200).json(result)
    
  } catch (error) {
    console.error('Daily crawl error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}