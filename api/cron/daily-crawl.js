import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Harper's Bazaar fashion sections to crawl
const FASHION_SECTIONS = [
  'https://www.harpersbazaar.com/fashion/',
  'https://www.harpersbazaar.com/fashion/runway/',
  'https://www.harpersbazaar.com/fashion/street-style/',
  'https://www.harpersbazaar.com/fashion/celebrity-style/',
  'https://www.harpersbazaar.com/fashion/trends/',
  'https://www.harpersbazaar.com/fashion/accessories/',
  'https://www.harpersbazaar.com/fashion/beauty/'
]

// Function to extract images from HTML content
function extractImages(html, baseUrl) {
  const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi
  const images = []
  let match
  
  while ((match = imageRegex.exec(html)) !== null) {
    let imageUrl = match[1]
    
    // Convert relative URLs to absolute
    if (imageUrl.startsWith('/')) {
      imageUrl = new URL(imageUrl, baseUrl).href
    }
    
    // Filter for fashion-related images (avoid logos, ads, etc.)
    if (imageUrl.includes('fashion') || 
        imageUrl.includes('runway') || 
        imageUrl.includes('street-style') ||
        imageUrl.includes('celebrity') ||
        imageUrl.includes('trends') ||
        imageUrl.includes('accessories') ||
        imageUrl.includes('beauty')) {
      images.push({
        url: imageUrl,
        alt: match[0].match(/alt="([^"]*)"/)?.[1] || '',
        title: match[0].match(/title="([^"]*)"/)?.[1] || ''
      })
    }
  }
  
  return images
}

// Function to crawl a single page
async function crawlPage(url) {
  try {
    console.log(`🕷️ Crawling: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const html = await response.text()
    const images = extractImages(html, url)
    
    console.log(`✅ Found ${images.length} images on ${url}`)
    
    return {
      url,
      images,
      success: true,
      error: null
    }
    
  } catch (error) {
    console.error(`❌ Error crawling ${url}:`, error.message)
    return {
      url,
      images: [],
      success: false,
      error: error.message
    }
  }
}

// Function to store images in Supabase
async function storeImages(images, sourceUrl) {
  if (!supabase) {
    console.error('❌ Supabase not configured')
    return { stored: 0, errors: ['Supabase not configured'] }
  }
  
  let stored = 0
  const errors = []
  
  for (const image of images) {
    try {
      // Download image
      const imageResponse = await fetch(image.url)
      if (!imageResponse.ok) {
        errors.push(`Failed to download ${image.url}: ${imageResponse.status}`)
        continue
      }
      
      const imageBuffer = await imageResponse.buffer()
      const fileName = `harper-bazaar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fashion-images')
        .upload(fileName, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        })
      
      if (uploadError) {
        errors.push(`Upload failed for ${image.url}: ${uploadError.message}`)
        continue
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('fashion-images')
        .getPublicUrl(fileName)
      
      // Store metadata in database
      const { error: dbError } = await supabase
        .from('fashion_images')
        .insert([
          {
            original_url: image.url,
            stored_url: urlData.publicUrl,
            alt_text: image.alt,
            title: image.title,
            source_url: sourceUrl,
            crawled_at: new Date().toISOString(),
            platform: 'harper-bazaar'
          }
        ])
      
      if (dbError) {
        errors.push(`Database insert failed for ${image.url}: ${dbError.message}`)
        continue
      }
      
      stored++
      console.log(`✅ Stored: ${fileName}`)
      
    } catch (error) {
      errors.push(`Error processing ${image.url}: ${error.message}`)
    }
  }
  
  return { stored, errors }
}

// Main cron job function
export default async function handler(req, res) {
  // Only allow POST requests (Vercel cron jobs)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!supabase) {
    return res.status(500).json({ 
      success: false, 
      error: 'Supabase is not configured on the server' 
    })
  }

  try {
    console.log('🚀 Starting daily Harper\'s Bazaar crawl...')
    
    const results = []
    let totalImages = 0
    let totalStored = 0
    const allErrors = []
    
    // Crawl each fashion section
    for (const sectionUrl of FASHION_SECTIONS) {
      const result = await crawlPage(sectionUrl)
      results.push(result)
      
      if (result.success) {
        totalImages += result.images.length
        
        // Store images if any found
        if (result.images.length > 0) {
          const storeResult = await storeImages(result.images, sectionUrl)
          totalStored += storeResult.stored
          allErrors.push(...storeResult.errors)
        }
      } else {
        allErrors.push(`Failed to crawl ${sectionUrl}: ${result.error}`)
      }
      
      // Small delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // Log crawl results
    const crawlLog = {
      crawl_date: new Date().toISOString(),
      urls_crawled: FASHION_SECTIONS,
      images_found: totalImages,
      images_stored: totalStored,
      errors: allErrors,
      status: allErrors.length === 0 ? 'success' : allErrors.length < FASHION_SECTIONS.length ? 'partial' : 'failed'
    }
    
    // Store crawl log in database
    if (supabase) {
      await supabase
        .from('crawl_logs')
        .insert([crawlLog])
    }
    
    console.log(`🎉 Daily crawl completed: ${totalImages} images found, ${totalStored} stored`)
    
    return res.status(200).json({
      success: true,
      message: 'Daily Harper\'s Bazaar crawl completed',
      results: {
        sections_crawled: FASHION_SECTIONS.length,
        images_found: totalImages,
        images_stored: totalStored,
        errors: allErrors.length,
        status: crawlLog.status
      },
      crawl_log: crawlLog
    })
    
  } catch (error) {
    console.error('❌ Daily crawl error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
