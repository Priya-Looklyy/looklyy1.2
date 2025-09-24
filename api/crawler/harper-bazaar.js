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
    let imagesStored = 0
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
        // Extract image URLs
        const imageMatches = html.match(/<img[^>]+src="([^"]+)"/gi)
        imagesFound = imageMatches ? imageMatches.length : 0
        console.log(`Found ${imagesFound} images`)
        
        // Try to store first few images
        if (imageMatches && imageMatches.length > 0) {
          const imageUrls = imageMatches.slice(0, 3).map(match => {
            const srcMatch = match.match(/src="([^"]+)"/)
            return srcMatch ? srcMatch[1] : null
          }).filter(url => url && url.includes('http'))
          
          console.log(`Extracted ${imageUrls.length} image URLs`)
          console.log('First few URLs:', imageUrls.slice(0, 2))
          
          // Store images in database
          for (const imageUrl of imageUrls) {
            try {
              console.log(`Attempting to store: ${imageUrl}`)
              const { error } = await supabase
                .from('fashion_images')
                .insert([
                  {
                    original_url: imageUrl,
                    stored_url: imageUrl, // For now, just store the original URL
                    alt_text: 'Harpers Bazaar fashion image',
                    title: 'Fashion Image',
                    source_url: testUrls[0],
                    crawled_at: new Date().toISOString(),
                    platform: 'harper-bazaar'
                  }
                ])
              
              if (!error) {
                imagesStored++
                console.log(`Successfully stored image: ${imageUrl}`)
              } else {
                console.log(`Database error for ${imageUrl}:`, error)
                errors.push(`Database error: ${error.message}`)
              }
            } catch (error) {
              console.log(`Storage error for ${imageUrl}:`, error)
              errors.push(`Storage error: ${error.message}`)
            }
          }
        } else {
          console.log('No image matches found to store')
        }
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
        images_stored: imagesStored,
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