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
    
             // Start with main fashion page and discover all URLs
             const baseUrl = 'https://www.harpersbazaar.com'
             const startUrl = 'https://www.harpersbazaar.com/fashion/'
             
             // URLs to crawl - will be populated dynamically
             let urlsToCrawl = [startUrl]
             let crawledUrls = new Set()
             let discoveredUrls = new Set()
    
    let imagesFound = 0
    let imagesStored = 0
    const errors = []
    
    // Recursive crawling to discover all fashion pages
    let allImageUrls = []
    let maxPages = 50 // Limit to prevent infinite crawling
    let pagesCrawled = 0
    
    while (urlsToCrawl.length > 0 && pagesCrawled < maxPages) {
      const currentUrl = urlsToCrawl.shift()
      
      if (crawledUrls.has(currentUrl)) {
        continue // Skip already crawled URLs
      }
      
      crawledUrls.add(currentUrl)
      pagesCrawled++
      
      try {
        console.log(`Crawling page ${pagesCrawled}/${maxPages}: ${currentUrl}`)
        const response = await fetch(currentUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })
      
        if (response.ok) {
          const html = await response.text()
          
          // Extract image URLs
          const imageMatches = html.match(/<img[^>]+src="([^"]+)"/gi)
          const pageImagesFound = imageMatches ? imageMatches.length : 0
          imagesFound += pageImagesFound
          console.log(`Found ${pageImagesFound} images on ${currentUrl}`)
          
          // Extract fashion images
          if (imageMatches && imageMatches.length > 0) {
            const imageUrls = imageMatches.slice(0, 20).map(match => {
              const srcMatch = match.match(/src="([^"]+)"/)
              let url = srcMatch ? srcMatch[1] : null

              // Convert relative URLs to absolute URLs
              if (url && !url.startsWith('http')) {
                if (url.startsWith('//')) {
                  url = 'https:' + url
                } else if (url.startsWith('/')) {
                  url = baseUrl + url
                } else {
                  url = baseUrl + '/' + url
                }
              }

              return url
            }).filter(url => {
              // Enhanced filtering for real fashion images
              const isValid = url && 
                (url.includes('http') || url.includes('data:')) &&
                // Exclude icons, SVGs, and design elements
                !url.includes('.svg') &&
                !url.includes('icon') &&
                !url.includes('logo') &&
                !url.includes('button') &&
                !url.includes('_assets') &&
                !url.includes('design-tokens') &&
                !url.includes('checkmark') &&
                !url.includes('magnifying') &&
                !url.includes('arrow') &&
                !url.includes('play') &&
                !url.includes('close') &&
                !url.includes('menu') &&
                !url.includes('search') &&
                !url.includes('social') &&
                !url.includes('share') &&
                !url.includes('like') &&
                !url.includes('heart') &&
                !url.includes('pin') &&
                !url.includes('star') &&
                !url.includes('badge') &&
                !url.includes('sponsor') &&
                !url.includes('ad') &&
                !url.includes('banner') &&
                !url.includes('header') &&
                !url.includes('footer') &&
                !url.includes('nav') &&
                !url.includes('sidebar') &&
                // Only include common image formats
                (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp')) &&
                // Look for fashion-related keywords in URL
                (url.includes('fashion') || url.includes('style') || url.includes('runway') || 
                 url.includes('trend') || url.includes('look') || url.includes('outfit') ||
                 url.includes('model') || url.includes('celebrity') || url.includes('street') ||
                 url.includes('designer') || url.includes('collection') || url.includes('show') ||
                 url.includes('photo') || url.includes('image') || url.includes('gallery') ||
                 url.includes('editorial') || url.includes('shoot') || url.includes('campaign'))
              
              return isValid
            })
            
            allImageUrls = allImageUrls.concat(imageUrls)
            console.log(`Added ${imageUrls.length} valid fashion images from ${currentUrl}`)
          }
          
          // Discover new URLs to crawl (only fashion-related pages)
          const linkMatches = html.match(/<a[^>]+href="([^"]+)"/gi)
          if (linkMatches) {
            linkMatches.forEach(match => {
              const hrefMatch = match.match(/href="([^"]+)"/)
              if (hrefMatch) {
                let linkUrl = hrefMatch[1]
                
                // Convert relative URLs to absolute URLs
                if (linkUrl.startsWith('/')) {
                  linkUrl = baseUrl + linkUrl
                } else if (!linkUrl.startsWith('http')) {
                  linkUrl = baseUrl + '/' + linkUrl
                }
                
                // Only add Harper's Bazaar fashion-related URLs
                if (linkUrl.includes('harpersbazaar.com') && 
                    linkUrl.includes('/fashion/') &&
                    !crawledUrls.has(linkUrl) &&
                    !discoveredUrls.has(linkUrl) &&
                    !linkUrl.includes('#') &&
                    !linkUrl.includes('?') &&
                    !linkUrl.includes('.pdf') &&
                    !linkUrl.includes('.jpg') &&
                    !linkUrl.includes('.png') &&
                    !linkUrl.includes('.gif') &&
                    !linkUrl.includes('.css') &&
                    !linkUrl.includes('.js')) {
                  
                  discoveredUrls.add(linkUrl)
                  urlsToCrawl.push(linkUrl)
                }
              }
            })
          }
          
          console.log(`Discovered ${discoveredUrls.size} new URLs to crawl`)
          
        } else {
          console.log(`Failed to fetch ${currentUrl}: ${response.status}`)
          errors.push(`HTTP ${response.status} for ${currentUrl}`)
        }
      } catch (error) {
        console.log(`Error crawling ${currentUrl}:`, error.message)
        errors.push(`Error crawling ${currentUrl}: ${error.message}`)
      }
    }
    
    // Remove duplicates and store unique images
    const uniqueImageUrls = [...new Set(allImageUrls)]
    console.log(`Total unique fashion images found: ${uniqueImageUrls.length}`)
    
    if (uniqueImageUrls.length > 0) {
      // Store images in database
      console.log('Starting database storage...')
      
      for (const imageUrl of uniqueImageUrls.slice(0, 25)) { // Store up to 25 images
        try {
          console.log(`Attempting to store: ${imageUrl}`)
          const { error } = await supabase
            .from('fashion_images_new')
            .insert([{
              original_url: imageUrl,
              title: `Harper's Bazaar Fashion Look ${imagesStored + 1}`,
              description: 'Latest fashion trend from Harper\'s Bazaar',
              category: 'harper_bazaar'
            }])
          
          if (!error) {
            imagesStored++
            console.log(`Successfully stored image record for: ${imageUrl}`)
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
      console.log('No valid fashion images found across all URLs')
      errors.push('No valid fashion images found')
    }
    
    const result = {
      success: true,
      message: 'Full website crawler completed',
      results: {
        pages_crawled: pagesCrawled,
        urls_discovered: discoveredUrls.size,
        images_found: imagesFound,
        unique_images_found: uniqueImageUrls.length,
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