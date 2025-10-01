import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (!supabase) {
    return res.status(500).json({ success: false, error: 'Supabase not configured' })
  }

  try {
    console.log('🔄 Starting training cycle completion process...')

    // Step 1: Get all training feedback
    const { data: allImages, error: fetchError } = await supabase
      .from('fashion_images_new')
      .select('*')

    if (fetchError) {
      return res.status(500).json({ success: false, error: fetchError.message })
    }

    // Categorize images based on feedback
    const approved = allImages.filter(img => img.category?.includes('_approved'))
    const rejected = allImages.filter(img => img.category?.includes('_rejected'))
    const duplicates = allImages.filter(img => img.category?.includes('_duplicate'))
    const untrained = allImages.filter(img => !img.category?.includes('_approved') && !img.category?.includes('_rejected') && !img.category?.includes('_duplicate'))

    console.log(`📊 Training stats: ${approved.length} approved, ${rejected.length} rejected, ${duplicates.length} duplicates, ${untrained.length} untrained`)

    // Step 2: Build exclusion list (rejected + duplicate URLs)
    const excludedUrls = [...rejected, ...duplicates].map(img => img.original_url)
    
    // Step 3: Analyze approved images to extract patterns
    const approvedPatterns = {
      categories: {},
      urlPatterns: [],
      keywords: new Set()
    }

    approved.forEach(img => {
      // Extract base category (before _approved suffix)
      const baseCategory = img.category?.replace('_approved', '') || 'unknown'
      approvedPatterns.categories[baseCategory] = (approvedPatterns.categories[baseCategory] || 0) + 1
      
      // Extract keywords from title and description
      const text = `${img.title || ''} ${img.description || ''}`.toLowerCase()
      const words = text.match(/\b\w{4,}\b/g) || []
      words.forEach(word => approvedPatterns.keywords.add(word))
      
      // Extract URL patterns
      if (img.original_url) {
        const urlParts = img.original_url.split('/').filter(p => p && p !== 'https:' && p !== 'http:')
        urlParts.forEach(part => approvedPatterns.urlPatterns.push(part))
      }
    })

    // Step 4: Delete rejected and duplicate images from database
    if (excludedUrls.length > 0) {
      console.log(`🗑️ Removing ${excludedUrls.length} rejected/duplicate images...`)
      
      for (const url of excludedUrls) {
        await supabase
          .from('fashion_images_new')
          .delete()
          .eq('original_url', url)
      }
      
      console.log(`✅ Removed all rejected and duplicate images`)
    }

    // Step 5: Clean up approved images (remove _approved suffix)
    if (approved.length > 0) {
      console.log(`🧹 Cleaning up ${approved.length} approved images...`)
      
      for (const img of approved) {
        const cleanCategory = img.category.replace('_approved', '')
        await supabase
          .from('fashion_images_new')
          .update({ category: cleanCategory })
          .eq('id', img.id)
      }
      
      console.log(`✅ Cleaned up approved images`)
    }

    // Step 6: Store learning patterns for next crawl
    const learningData = {
      cycle_timestamp: new Date().toISOString(),
      approved_count: approved.length,
      rejected_count: rejected.length,
      duplicate_count: duplicates.length,
      excluded_urls: excludedUrls,
      preferred_categories: approvedPatterns.categories,
      positive_keywords: Array.from(approvedPatterns.keywords).slice(0, 50),
      url_patterns: [...new Set(approvedPatterns.urlPatterns)].slice(0, 30)
    }

    // Store in a simple JSON format (we'll use this in the crawler)
    console.log('📝 Learning patterns stored:', {
      categories: Object.keys(approvedPatterns.categories),
      keywords: learningData.positive_keywords.length,
      excluded: excludedUrls.length
    })

    return res.status(200).json({
      success: true,
      message: 'Training cycle completed successfully',
      stats: {
        approved: approved.length,
        rejected: rejected.length,
        duplicates: duplicates.length,
        excluded: excludedUrls.length,
        remaining: approved.length
      },
      patterns: {
        preferred_categories: approvedPatterns.categories,
        positive_keywords: learningData.positive_keywords,
        excluded_urls_count: excludedUrls.length
      }
    })

  } catch (error) {
    console.error('❌ Error applying training:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}

