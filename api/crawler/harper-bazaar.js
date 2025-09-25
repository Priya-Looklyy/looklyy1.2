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
    console.log('🚀 Starting simple HTTP crawler (Vercel compatible)...')
    
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: 'Supabase is not configured' 
      })
    }

    // URLs to crawl with category mapping
    const urlsToCrawl = [
      { url: 'https://www.harpersbazaar.com/fashion/trends/', category: 'trends', subcategory: 'general', trendScore: 0.95 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/', category: 'runway', subcategory: 'general', trendScore: 0.90 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/', category: 'street-style', subcategory: 'general', trendScore: 0.85 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/', category: 'celebrity-style', subcategory: 'general', trendScore: 0.88 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/', category: 'designers', subcategory: 'general', trendScore: 0.87 },
      { url: 'https://www.harpersbazaar.com/fashion/', category: 'trends', subcategory: 'general', trendScore: 0.92 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/fall-2024/', category: 'trends', subcategory: 'fall-2024', trendScore: 0.93 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/spring-2025/', category: 'runway', subcategory: 'spring-2025', trendScore: 0.94 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/paris-fashion-week/', category: 'street-style', subcategory: 'fashion-week', trendScore: 0.89 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/red-carpet/', category: 'celebrity-style', subcategory: 'red-carpet', trendScore: 0.91 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/spring-2025/', category: 'trends', subcategory: 'spring-2025', trendScore: 0.96 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/fall-2024/', category: 'runway', subcategory: 'fall-2024', trendScore: 0.88 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/new-york-fashion-week/', category: 'street-style', subcategory: 'fashion-week', trendScore: 0.90 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/street-style/', category: 'celebrity-style', subcategory: 'street-style', trendScore: 0.86 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/spring-2025/', category: 'designers', subcategory: 'spring-2025', trendScore: 0.89 }
    ]
    
    let totalImages = 0
    let storedImages = 0
    let pagesCrawled = 0
    const errors = []
    const allFashionImages = []
    
    // Crawl each URL with proper error handling
    for (const urlData of urlsToCrawl) {
      try {
        console.log(`🎯 Crawling: ${urlData.url} (${urlData.category})`)
        pagesCrawled++
        
        const response = await fetch(urlData.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          }
        })
        
        if (!response.ok) {
          console.log(`❌ Failed to fetch ${urlData.url}: ${response.status}`)
          errors.push(`HTTP ${response.status} for ${urlData.url}`)
          continue
        }
        
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
        
        console.log(`📸 Found ${images.length} images on ${urlData.url}`)
        totalImages += images.length
        
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
            'close', 'checkmark', 'magnifying', '_assets', 'design-tokens',
            'facebook', 'twitter', 'instagram', 'pinterest', 'youtube'
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
            'campaign', 'dress', 'clothing', 'apparel', 'beauty',
            'harpersbazaar', 'bazaar'
          ]
          
          return fashionKeywords.some(keyword => 
            absoluteUrl.includes(keyword) || alt.includes(keyword)
          )
        }).map(img => ({
          src: img.src.startsWith('//') ? 'https:' + img.src :
               img.src.startsWith('/') ? 'https://www.harpersbazaar.com' + img.src :
               img.src.startsWith('http') ? img.src :
               'https://www.harpersbazaar.com/' + img.src,
          alt: img.alt,
          category: urlData.category,
          subcategory: urlData.subcategory,
          trendScore: urlData.trendScore,
          sourceUrl: urlData.url,
          crawledAt: new Date().toISOString()
        }))
        
        console.log(`✨ Found ${fashionImages.length} fashion images on ${urlData.url}`)
        allFashionImages.push(...fashionImages)
        
      } catch (error) {
        console.log(`❌ Error crawling ${urlData.url}:`, error.message)
        errors.push(`Error crawling ${urlData.url}: ${error.message}`)
      }
    }
    
    // Remove duplicates and store unique images
    const uniqueImages = [...new Set(allFashionImages.map(img => img.src))]
      .map(src => allFashionImages.find(img => img.src === src))
    
    console.log(`🎨 Total unique fashion images found: ${uniqueImages.length}`)
    
    // Store images in Supabase
    for (const image of uniqueImages.slice(0, 50)) { // Store up to 50 images
      try {
        const { error } = await supabase
          .from('fashion_images_new')
          .insert([{
            original_url: image.src,
            title: `Harper's Bazaar ${image.category.charAt(0).toUpperCase() + image.category.slice(1)} Look ${storedImages + 1}`,
            description: image.alt || `Latest ${image.category} trend from Harper's Bazaar`,
            category: image.category,
            subcategory: image.subcategory,
            trend_score: image.trendScore,
            source_url: image.sourceUrl,
            crawled_at: image.crawledAt
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
    
    const result = {
      success: true,
      message: 'Simple HTTP crawler completed successfully (Vercel compatible)',
      results: {
        pages_crawled: pagesCrawled,
        total_images_found: totalImages,
        unique_fashion_images: uniqueImages.length,
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