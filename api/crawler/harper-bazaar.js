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

    // URLs to crawl with category mapping - EXPANDED Harper's Bazaar Coverage for Maximum Content
    const urlsToCrawl = [
      // SPECIFIC HIGH-QUALITY ARTICLES - Full-size fashion images
      { url: 'https://www.harpersbazaar.com/fashion/trends/a65837104/wide-leg-jeans-outfit-ideas/', category: 'street-style', subcategory: 'outfit-ideas', trendScore: 0.99 },
      
      // CELEBRITY STYLE - COMPREHENSIVE Coverage
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/', category: 'celebrity-style', subcategory: 'general', trendScore: 0.98 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/red-carpet/', category: 'celebrity-style', subcategory: 'red-carpet', trendScore: 0.97 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/met-gala/', category: 'celebrity-style', subcategory: 'met-gala', trendScore: 0.96 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/oscars/', category: 'celebrity-style', subcategory: 'oscars', trendScore: 0.95 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/golden-globes/', category: 'celebrity-style', subcategory: 'golden-globes', trendScore: 0.94 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/cannes/', category: 'celebrity-style', subcategory: 'cannes', trendScore: 0.93 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/emmys/', category: 'celebrity-style', subcategory: 'emmys', trendScore: 0.92 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/grahams/', category: 'celebrity-style', subcategory: 'grahams', trendScore: 0.91 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/street-style/', category: 'celebrity-style', subcategory: 'street-style', trendScore: 0.90 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/off-duty/', category: 'celebrity-style', subcategory: 'off-duty', trendScore: 0.89 },
      
      // RUNWAY - COMPREHENSIVE Runway Coverage
      { url: 'https://www.harpersbazaar.com/fashion/runway/', category: 'runway', subcategory: 'general', trendScore: 0.98 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/spring-2025/', category: 'runway', subcategory: 'spring-2025', trendScore: 0.99 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/fall-2024/', category: 'runway', subcategory: 'fall-2024', trendScore: 0.97 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/paris-fashion-week/', category: 'runway', subcategory: 'paris-fw', trendScore: 0.96 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/new-york-fashion-week/', category: 'runway', subcategory: 'nyfw', trendScore: 0.95 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/milan-fashion-week/', category: 'runway', subcategory: 'milan-fw', trendScore: 0.94 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/london-fashion-week/', category: 'runway', subcategory: 'lfw', trendScore: 0.93 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/couture/', category: 'runway', subcategory: 'couture', trendScore: 0.92 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/ready-to-wear/', category: 'runway', subcategory: 'rtw', trendScore: 0.91 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/cruise/', category: 'runway', subcategory: 'cruise', trendScore: 0.90 },
      
      // DESIGNERS - COMPREHENSIVE Designer Coverage
      { url: 'https://www.harpersbazaar.com/fashion/designers/', category: 'designers', subcategory: 'general', trendScore: 0.98 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/spring-2025/', category: 'designers', subcategory: 'spring-2025', trendScore: 0.97 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/fall-2024/', category: 'designers', subcategory: 'fall-2024', trendScore: 0.96 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/chanel/', category: 'designers', subcategory: 'chanel', trendScore: 0.95 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/dior/', category: 'designers', subcategory: 'dior', trendScore: 0.94 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/gucci/', category: 'designers', subcategory: 'gucci', trendScore: 0.93 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/louis-vuitton/', category: 'designers', subcategory: 'louis-vuitton', trendScore: 0.92 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/balenciaga/', category: 'designers', subcategory: 'balenciaga', trendScore: 0.91 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/prada/', category: 'designers', subcategory: 'prada', trendScore: 0.90 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/versace/', category: 'designers', subcategory: 'versace', trendScore: 0.89 },
      
      // TRENDS - COMPREHENSIVE Trend Coverage
      { url: 'https://www.harpersbazaar.com/fashion/trends/', category: 'trends', subcategory: 'general', trendScore: 0.95 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/fall-2024/', category: 'trends', subcategory: 'fall-2024', trendScore: 0.94 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/spring-2025/', category: 'trends', subcategory: 'spring-2025', trendScore: 0.93 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/street-style/', category: 'trends', subcategory: 'street-style', trendScore: 0.92 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/color-trends/', category: 'trends', subcategory: 'color-trends', trendScore: 0.91 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/accessories/', category: 'trends', subcategory: 'accessories', trendScore: 0.90 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/denim/', category: 'trends', subcategory: 'denim', trendScore: 0.89 },
      { url: 'https://www.harpersbazaar.com/fashion/', category: 'trends', subcategory: 'general', trendScore: 0.88 },
      
      // STREET STYLE - COMPREHENSIVE Street Style Coverage
      { url: 'https://www.harpersbazaar.com/fashion/street-style/', category: 'street-style', subcategory: 'general', trendScore: 0.90 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/paris-fashion-week/', category: 'street-style', subcategory: 'paris-fw', trendScore: 0.89 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/new-york-fashion-week/', category: 'street-style', subcategory: 'nyfw', trendScore: 0.88 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/milan-fashion-week/', category: 'street-style', subcategory: 'milan-fw', trendScore: 0.87 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/london-fashion-week/', category: 'street-style', subcategory: 'lfw', trendScore: 0.86 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/daily/', category: 'street-style', subcategory: 'daily', trendScore: 0.85 },
      
      // BEAUTY & LIFESTYLE - Additional Content Areas
      { url: 'https://www.harpersbazaar.com/beauty/', category: 'celebrity-style', subcategory: 'beauty', trendScore: 0.84 },
      { url: 'https://www.harpersbazaar.com/culture/', category: 'celebrity-style', subcategory: 'culture', trendScore: 0.83 }
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
        
        // SIMPLIFIED FILTER - Much more permissive approach to get images back
        const fashionImages = images.filter(img => {
          const src = img.src.toLowerCase()
          const alt = img.alt.toLowerCase()
          
          // Must be a valid image URL
          if (!src || !src.includes('http')) return false
          
          // ONLY check for image format requirements
          if (!src.match(/\.(jpg|jpeg|png|webp)/i)) return false
          
          // ONLY block obvious absolute no's
          if (src.includes('facebook') || src.includes('twitter') || 
              src.includes('instagram') || src.includes('youtube') ||
              src.includes('icon.svg') || src.includes('avatar.png') ||
              alt.includes('facebook') || alt.includes('instagram')) {
            return false
          }
          
          // Allow it then - MINIMAL filtering is key!
          return true
        }).map(img => {
          let processedSrc = img.src.startsWith('//') ? 'https:' + img.src :
                            img.src.startsWith('/') ? 'https://www.harpersbazaar.com' + img.src :
                            img.src.startsWith('http') ? img.src :
                            'https://www.harpersbazaar.com/' + img.src
          
          // Remove resize parameters to get original larger images
          processedSrc = processedSrc.replace(/&resize=\d+:\*/g, '')
          processedSrc = processedSrc.replace(/&resize=\d+:\d+/g, '')
          processedSrc = processedSrc.replace(/resize=\d+:\*/g, '')
          processedSrc = processedSrc.replace(/resize=\d+:\d+/g, '')
          
          return {
            src: processedSrc,
            alt: img.alt,
            category: urlData.category,
            subcategory: urlData.subcategory,
            trendScore: urlData.trendScore,
            sourceUrl: urlData.url,
            crawledAt: new Date().toISOString()
          }
        })
        
        console.log(`✨ Found ${fashionImages.length} fashion images on ${urlData.url}`)
        if (fashionImages.length === 0) {
          console.log(`⚠️ No fashion images passed filter on ${urlData.url}`)
          console.log(`Debug - Sample image:`, images[0]) 
        }
        allFashionImages.push(...fashionImages)
        
      } catch (error) {
        console.log(`❌ Error crawling ${urlData.url}:`, error.message)
        errors.push(`Error crawling ${urlData.url}: ${error.message}`)
      }
    }
    
    // Remove duplicates and store unique images - ENHANCED deduplication
    const seenUrls = new Set()
    const seenAltTexts = new Set() // Also deduplicate based on alt text
    const uniqueImages = allFashionImages.filter(img => {
      // Check for pure URL duplicates
      if (seenUrls.has(img.src)) {
        return false
      }
      
      // Check for alt text duplicates that are similar
      const altKey = img.alt && img.alt.length > 10 ? img.alt.toLowerCase().substring(0, 50) : ''
      if (altKey && seenAltTexts.has(altKey)) {
        return false
      }
      
      // Mark this image as seen for both URL and alt text checks
      seenUrls.add(img.src)
      if (altKey) seenAltTexts.add(altKey)
      return true
    })
    
    console.log(`🎨 Total unique fashion images found: ${uniqueImages.length}`)
    console.log(`🔍 First 3 images for debugging:`, uniqueImages.slice(0, 3))
    
    // CLEAR DATABASE FIRST - Complete refresh ensures only new filtered content
    console.log('🗑️ Clearing old unfiltered images from database...')
    const { error: clearError } = await supabase
      .from('fashion_images_new')
      .delete()
      .neq('id', 0) // Delete all records (id is never 0)
    
    if (clearError) {
      console.log('❌ Database clear error:', clearError.message)
      return res.status(500).json({
        success: false,
        error: `Database clear failed: ${clearError.message}`
      })
    }
    
    console.log('✅ Database cleared - fresh start guaranteed')
    console.log(`📥 About to store ${Math.min(uniqueImages.length, 500)} images to database`)
    
    // Store images in Supabase - FLOOD WITH CONTENT for amazing user experience
    for (const image of uniqueImages.slice(0, 500)) { // Store up to 500 images
      try {
        // REVERT TO BASIC INSERT FORMAT (what was working)
        const { data, error } = await supabase
          .from('fashion_images_new')
          .insert([{
            original_url: image.src,
            title: `Harper's Bazaar ${image.category.charAt(0).toUpperCase() + image.category.slice(1)} Look ${storedImages + 1}`,
            description: image.alt || `Latest ${image.category} trend from Harper's Bazaar`,
            category: image.category
          }])
        
        if (!error && data) {
          storedImages++
          console.log(`✅ Stored image ${storedImages}: ${image.src}`)
        } else {
          console.log(`❌ Database error:`, error?.message || 'Unknown error', error)
          errors.push(`Database error: ${error?.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.log(`❌ Storage error:`, error.message)
        errors.push(`Storage error: ${error.message}`)
      }
    }
    
    console.log(`📊 Final storage result: ${storedImages} successfully stored, ${errors.length} errors`)
    
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