import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

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
    console.log('Starting crawler...')
    
    // Test URLs to crawl
    const testUrls = [
      'https://www.harpersbazaar.com/fashion/',
      'https://www.harpersbazaar.com/fashion/trends/'
    ]
    
    let imagesFound = 0
    const errors = []
    
    // Try to crawl one URL
    try {
      const response = await fetch(testUrls[0], {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (response.ok) {
        const html = await response.text()
        // Simple image count
        const imageMatches = html.match(/<img[^>]+src="[^"]+"/gi)
        imagesFound = imageMatches ? imageMatches.length : 0
        console.log(`Found ${imagesFound} images`)
      } else {
        errors.push(`HTTP ${response.status}`)
      }
    } catch (error) {
      errors.push(error.message)
    }
    
    const result = {
      success: true,
      message: 'Crawler test with real data',
      results: {
        sections_crawled: 1,
        images_found: imagesFound,
        images_stored: 0,
        errors: errors.length,
        status: errors.length === 0 ? 'success' : 'partial'
      }
    }
    
    return res.status(200).json(result)
    
  } catch (error) {
    console.error('Crawler error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}