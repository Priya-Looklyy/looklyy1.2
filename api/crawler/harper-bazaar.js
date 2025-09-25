import { createClient } from '@supabase/supabase-js'
import { HttpCrawler, Dataset } from 'crawlee'

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
    console.log('🚀 Starting Crawlee-powered crawler...')
    
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: 'Supabase is not configured' 
      })
    }

    // Initialize HTTP-based Crawlee crawler (no browser dependencies)
    const crawler = new HttpCrawler({
      maxRequestsPerCrawl: 50, // Limit to prevent infinite crawling
      requestHandlerTimeoutSecs: 30,
      
      // Anti-blocking configuration
      additionalMimeTypes: ['text/html', 'application/json'],
      
      // Request handler for each page
      async requestHandler({ request, response, enqueueLinks, log }) {
        log.info(`🎯 Crawling: ${request.url}`)
        
        try {
          const html = await response.text()
          
          // Extract all images from HTML
          const imageMatches = html.match(/<img[^>]+src="([^"]+)"/gi) || []
          const images = imageMatches.map(match => {
            const srcMatch = match.match(/src="([^"]+)"/)
            const altMatch = match.match(/alt="([^"]*)"/)
            return {
              src: srcMatch ? srcMatch[1] : '',
              alt: altMatch ? altMatch[1] : ''
            }
          })
          
          log.info(`📸 Found ${images.length} images on ${request.url}`)
          
          // Filter for fashion images
          const fashionImages = images.filter(img => {
            const src = img.src.toLowerCase()
            const alt = img.alt.toLowerCase()
            
            // Must be a valid image URL
            if (!src || !src.includes('http')) return false
            
            // Convert relative URLs to absolute URLs
            let absoluteUrl = src
            if (src.startsWith('//')) {
              absoluteUrl = 'https:' + src
            } else if (src.startsWith('/')) {
              absoluteUrl = 'https://www.harpersbazaar.com' + src
            } else if (!src.startsWith('http')) {
              absoluteUrl = 'https://www.harpersbazaar.com/' + src
            }
            
            // Exclude icons, SVGs, and design elements
            const excludeKeywords = [
              'icon', 'logo', 'button', 'svg', 'avatar', 'thumbnail',
              'social', 'share', 'like', 'heart', 'pin', 'star',
              'badge', 'sponsor', 'ad', 'banner', 'header', 'footer',
              'nav', 'sidebar', 'menu', 'search', 'arrow', 'play',
              'close', 'checkmark', 'magnifying', '_assets', 'design-tokens'
            ]
            
            if (excludeKeywords.some(keyword => absoluteUrl.includes(keyword) || alt.includes(keyword))) {
              return false
            }
            
            // Must be common image formats
            if (!absoluteUrl.match(/\.(jpg|jpeg|png|webp)(\?|$)/i)) {
              return false
            }
            
            // Look for fashion-related keywords
            const fashionKeywords = [
              'fashion', 'style', 'runway', 'trend', 'look', 'outfit',
              'model', 'celebrity', 'street', 'designer', 'collection',
              'show', 'photo', 'image', 'gallery', 'editorial', 'shoot',
              'campaign', 'dress', 'clothing', 'apparel', 'beauty'
            ]
            
            return fashionKeywords.some(keyword => 
              absoluteUrl.includes(keyword) || alt.includes(keyword)
            )
          }).map(img => ({
            src: img.src.startsWith('//') ? 'https:' + img.src :
                 img.src.startsWith('/') ? 'https://www.harpersbazaar.com' + img.src :
                 img.src.startsWith('http') ? img.src :
                 'https://www.harpersbazaar.com/' + img.src,
            alt: img.alt
          }))
          
          log.info(`✨ Found ${fashionImages.length} fashion images on ${request.url}`)
          
          // Store fashion images in dataset
          if (fashionImages.length > 0) {
            await Dataset.pushData({
              url: request.url,
              images: fashionImages,
              crawledAt: new Date().toISOString()
            })
          }
          
          // Discover new URLs to crawl (only fashion-related pages)
          await enqueueLinks({
            selector: 'a[href*="/fashion/"]',
            label: 'FASHION_PAGE',
            transformRequestFunction: (request) => {
              // Only crawl Harper's Bazaar fashion pages
              if (request.url.includes('harpersbazaar.com') && 
                  request.url.includes('/fashion/') &&
                  !request.url.includes('#') &&
                  !request.url.includes('?') &&
                  !request.url.match(/\.(pdf|jpg|png|gif|css|js)$/i)) {
                return request
              }
              return false
            }
          })
          
        } catch (error) {
          log.error(`❌ Error processing ${request.url}:`, error.message)
        }
      },
      
      // Handle failed requests
      failedRequestHandler({ request, error, log }) {
        log.error(`❌ Failed to crawl ${request.url}:`, error.message)
      }
    })
    
    // Start crawling from Harper's Bazaar fashion section
    await crawler.run(['https://www.harpersbazaar.com/fashion/'])
    
    // Get all crawled data
    const dataset = await Dataset.getData()
    console.log(`📊 Crawled ${dataset.items.length} pages`)
    
    // Process and store images in Supabase
    let totalImages = 0
    let storedImages = 0
    const errors = []
    
    for (const item of dataset.items) {
      if (item.images && item.images.length > 0) {
        totalImages += item.images.length
        
        // Store each image in Supabase
        for (const image of item.images.slice(0, 5)) { // Limit to 5 images per page
          try {
            const { error } = await supabase
              .from('fashion_images_new')
              .insert([{
                original_url: image.src,
                title: `Harper's Bazaar Fashion Look ${storedImages + 1}`,
                description: image.alt || 'Latest fashion trend from Harper\'s Bazaar',
                category: 'harper_bazaar'
              }])
            
            if (!error) {
              storedImages++
              console.log(`✅ Stored image: ${image.src}`)
            } else {
              console.log(`❌ Database error:`, error.message)
              errors.push(`Database error: ${error.message}`)
            }
          } catch (error) {
            console.log(`❌ Storage error:`, error.message)
            errors.push(`Storage error: ${error.message}`)
          }
        }
      }
    }
    
    const result = {
      success: true,
      message: 'Crawlee-powered crawler completed successfully',
      results: {
        pages_crawled: dataset.items.length,
        total_images_found: totalImages,
        images_stored: storedImages,
        errors: errors.length,
        status: errors.length === 0 ? 'success' : 'partial'
      }
    }
    
    console.log('🎉 Crawler completed:', result)
    return res.status(200).json(result)
    
  } catch (error) {
    console.error('Crawler error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}