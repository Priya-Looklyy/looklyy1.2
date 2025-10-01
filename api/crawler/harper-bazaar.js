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
    console.log('🚀 Starting adaptive HTTP crawler with training integration...')
    
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: 'Supabase is not configured' 
      })
    }

    // STEP 1: Load learning patterns from previous training cycles (NO URL exclusion)
    let preferredCategories = {}
    
    try {
      // Get existing images to learn category preferences only
      const { data: existingImages } = await supabase
        .from('fashion_images_new')
        .select('category')
      
      if (existingImages) {
        // Count approved categories to prioritize them in URL ordering
        existingImages.forEach(img => {
          if (img.category && !img.category.includes('_rejected') && !img.category.includes('_duplicate')) {
            preferredCategories[img.category] = (preferredCategories[img.category] || 0) + 1
          }
        })
        
        console.log(`📊 Learning from history - Preferred categories:`, Object.keys(preferredCategories).slice(0, 5))
      }
    } catch (error) {
      console.log('⚠️ Could not load training history, proceeding with default priorities')
    }

    // URLs to crawl - PRIORITIZED for fashion-forward full-body images (Runway, Trends, Street-Style first)
    const urlsToCrawl = [
      // RUNWAY - HIGHEST PRIORITY (Full-body fashion shots)
      { url: 'https://www.harpersbazaar.com/fashion/runway/spring-2025/', category: 'runway', subcategory: 'spring-2025', trendScore: 0.99 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/', category: 'runway', subcategory: 'general', trendScore: 0.98 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/fall-2024/', category: 'runway', subcategory: 'fall-2024', trendScore: 0.97 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/paris-fashion-week/', category: 'runway', subcategory: 'paris-fw', trendScore: 0.96 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/new-york-fashion-week/', category: 'runway', subcategory: 'nyfw', trendScore: 0.95 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/milan-fashion-week/', category: 'runway', subcategory: 'milan-fw', trendScore: 0.94 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/london-fashion-week/', category: 'runway', subcategory: 'lfw', trendScore: 0.93 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/couture/', category: 'runway', subcategory: 'couture', trendScore: 0.92 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/ready-to-wear/', category: 'runway', subcategory: 'rtw', trendScore: 0.91 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/cruise/', category: 'runway', subcategory: 'cruise', trendScore: 0.90 },
      
      // TRENDS - HIGH PRIORITY (Fashion-forward outfit ideas)
      { url: 'https://www.harpersbazaar.com/fashion/trends/a65837104/wide-leg-jeans-outfit-ideas/', category: 'street-style', subcategory: 'outfit-ideas', trendScore: 0.89 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/', category: 'trends', subcategory: 'general', trendScore: 0.88 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/fall-2024/', category: 'trends', subcategory: 'fall-2024', trendScore: 0.87 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/spring-2025/', category: 'trends', subcategory: 'spring-2025', trendScore: 0.86 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/street-style/', category: 'trends', subcategory: 'street-style', trendScore: 0.85 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/accessories/', category: 'trends', subcategory: 'accessories', trendScore: 0.84 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/denim/', category: 'trends', subcategory: 'denim', trendScore: 0.83 },
      { url: 'https://www.harpersbazaar.com/fashion/', category: 'trends', subcategory: 'general', trendScore: 0.82 },
      
      // STREET STYLE - MEDIUM-HIGH PRIORITY (Real fashion inspiration)
      { url: 'https://www.harpersbazaar.com/fashion/street-style/', category: 'street-style', subcategory: 'general', trendScore: 0.81 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/paris-fashion-week/', category: 'street-style', subcategory: 'paris-fw', trendScore: 0.80 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/new-york-fashion-week/', category: 'street-style', subcategory: 'nyfw', trendScore: 0.79 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/milan-fashion-week/', category: 'street-style', subcategory: 'milan-fw', trendScore: 0.78 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/london-fashion-week/', category: 'street-style', subcategory: 'lfw', trendScore: 0.77 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/daily/', category: 'street-style', subcategory: 'daily', trendScore: 0.76 },
      
      // DESIGNERS - MEDIUM PRIORITY (Designer collections)
      { url: 'https://www.harpersbazaar.com/fashion/designers/', category: 'designers', subcategory: 'general', trendScore: 0.75 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/spring-2025/', category: 'designers', subcategory: 'spring-2025', trendScore: 0.74 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/fall-2024/', category: 'designers', subcategory: 'fall-2024', trendScore: 0.73 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/chanel/', category: 'designers', subcategory: 'chanel', trendScore: 0.72 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/dior/', category: 'designers', subcategory: 'dior', trendScore: 0.71 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/gucci/', category: 'designers', subcategory: 'gucci', trendScore: 0.70 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/louis-vuitton/', category: 'designers', subcategory: 'louis-vuitton', trendScore: 0.69 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/balenciaga/', category: 'designers', subcategory: 'balenciaga', trendScore: 0.68 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/prada/', category: 'designers', subcategory: 'prada', trendScore: 0.67 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/versace/', category: 'designers', subcategory: 'versace', trendScore: 0.66 },
      
      // CELEBRITY STYLE - LOWER PRIORITY (Often has face shots - use sparingly)
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/', category: 'celebrity-style', subcategory: 'general', trendScore: 0.50 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/red-carpet/', category: 'celebrity-style', subcategory: 'red-carpet', trendScore: 0.49 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/met-gala/', category: 'celebrity-style', subcategory: 'met-gala', trendScore: 0.48 }
    ]
    
    let totalImages = 0
    let storedImages = 0
    let pagesCrawled = 0
    const errors = []
    const allFashionImages = []
    
    // Crawl each URL with proper error handling
    // Simple scoring rules in shadow mode
    const keywordWeight = (text, patterns, weight) => {
      if (!text) return 0
      const lower = text.toLowerCase()
      return patterns.some(p => lower.includes(p)) ? weight : 0
    }
    const computeScore = (img) => {
      const urlText = `${img.src} ${img.sourceUrl || ''}`
      const altText = `${img.alt || ''}`
      let score = 0
      // Positive cues
      score += keywordWeight(urlText, ['runway','street-style','designer','trends','fashion-week'], 0.25)
      score += keywordWeight(altText, ['full look','head-to-toe','runway look','outfit'], 0.2)
      // Negative cues
      score -= keywordWeight(urlText + ' ' + altText, ['poster','trailer','teaser','netflix','disney','primevideo','movie','cinema'], 0.4)
      score -= keywordWeight(urlText + ' ' + altText, ['face','headshot','portrait','selfie'], 0.3)
      score -= keywordWeight(urlText, ['icon','sprite','logo','collage'], 0.4)
      return Math.max(-1, Math.min(1, score))
    }

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
        
        // DEBUG: Show sample of raw images
        if (images.length > 0) {
          console.log(`🔍 DEBUG: Sample raw images:`, images.slice(0, 2).map(img => ({ src: img.src, alt: img.alt })))
        }
        
        // RESTORE WORKING FILTER: Basic image format validation (what was working before)
        const fashionImages = images
          .filter(img => {
            const src = img.src || ''
            // Only basic URL validation - what was working before
            return src && src.includes('http') && src.match(/\.(jpg|jpeg|png|webp|jpeg)/i)
          })
          .map(img => {
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
        // Compute shadow-mode score for each image
        const scored = fashionImages.map(img => ({ ...img, score: computeScore(img), ruleVersion: 1 }))
        allFashionImages.push(...scored)
        
      } catch (error) {
        console.log(`❌ Error crawling ${urlData.url}:`, error.message)
        errors.push(`Error crawling ${urlData.url}: ${error.message}`)
      }
    }
    
    // RESTORE WORKING DEDUPLICATION: Enhanced deduplication (what was working before)
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
    
    // CRITICAL DEBUG: Check what we have before deduplication
    console.log(`🔍 DEBUG: allFashionImages.length = ${allFashionImages.length}`)
    if (allFashionImages.length > 0) {
      console.log(`🔍 DEBUG: First allFashionImage:`, allFashionImages[0])
      console.log(`🔍 DEBUG: Sample URLs:`, allFashionImages.slice(0, 3).map(img => img.src))
    } else {
      console.log(`❌ CRITICAL: allFashionImages is EMPTY - filtering is too restrictive!`)
    }
    
    // CLEAR DATABASE FIRST - Use a working approach
    console.log('🗑️ Clearing old unfiltered images from database...')
    try {
      // Get all existing records first
      const { data: existingRecords, error: fetchError } = await supabase
        .from('fashion_images_new')
        .select('id')
        .limit(1000)
      
      if (fetchError) {
        console.log('❌ Error fetching existing records:', fetchError.message)
        // Continue without clearing - don't fail the entire crawl
      } else if (existingRecords && existingRecords.length > 0) {
        // Delete records one by one to avoid RLS issues
        const deletePromises = existingRecords.map(record => 
          supabase.from('fashion_images_new').delete().eq('id', record.id)
        )
        
        await Promise.all(deletePromises)
        console.log(`✅ Cleared ${existingRecords.length} existing records`)
      } else {
        console.log('✅ No existing records to clear')
      }
    } catch (clearError) {
      console.log('⚠️ Database clear failed, continuing anyway:', clearError.message)
      // Don't fail the entire crawl if clearing fails
    }
    console.log(`📥 About to store ${Math.min(uniqueImages.length, 500)} images to database`)
    
    // CRITICAL CHECK: If no uniqueImages, something is wrong with filtering
    if (uniqueImages.length === 0) {
      console.log(`❌ CRITICAL: No unique images to store - filtering is too restrictive or broken`)
      console.log(`Debug - totalImages: ${totalImages}, allFashionImages.length: ${allFashionImages.length}`)
      
      // EMERGENCY BYPASS: Use allFashionImages directly if uniqueImages is empty
      if (allFashionImages.length > 0) {
        console.log(`🚨 EMERGENCY BYPASS: Using allFashionImages directly (${allFashionImages.length} images)`)
        uniqueImages.push(...allFashionImages.slice(0, 500)) // Use first 500 images
      } else {
        return res.status(200).json({
          success: true,
          message: 'Crawler found images but none passed filtering',
          results: {
            pages_crawled: pagesCrawled,
            total_images_found: totalImages,
            unique_fashion_images: 0,
            images_stored: 0,
            errors: errors.length,
            status: 'no_images_passed_filter'
          }
        })
      }
    }
    
    // Store images in Supabase - FLOOD WITH CONTENT for amazing user experience
    console.log(`🔍 DEBUG: About to store ${uniqueImages.length} images, first image:`, uniqueImages[0])
    
    for (const image of uniqueImages.slice(0, 500)) { // Store up to 500 images
      try {
        console.log(`🔍 DEBUG: Attempting to store image ${storedImages + 1}:`, image.src)
        
        const { data, error } = await supabase
          .from('fashion_images_new')
          .insert([{
            original_url: image.src,
            title: `Harper's Bazaar ${image.category.charAt(0).toUpperCase() + image.category.slice(1)} Look ${storedImages + 1}`,
            description: image.alt || `Latest ${image.category} trend from Harper's Bazaar`,
            category: image.category
          }])
          .select()
        
        console.log(`🔍 DEBUG: Insert result - data:`, data, 'error:', error)
        
        if (!error) {
          storedImages++
          console.log(`✅ Stored image ${storedImages}: ${image.src}`)
          // Shadow-mode: try to write score/flags if columns exist (ignore errors)
          try {
            const needsTraining = image.score >= 0.15 && image.score < 0.35
            await supabase
              .from('fashion_images_new')
              .update({
                score: image.score,
                rule_version: image.ruleVersion,
                needs_training: needsTraining,
                training_status: 'pending'
              })
              .eq('original_url', image.src)
          } catch (e) {
            console.log('ℹ️ Shadow score update skipped (likely missing columns):', e?.message)
          }
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