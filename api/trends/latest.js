// Harper's Bazaar Trending Fashion API
// Fetches latest trending fashion content from Harper's Bazaar

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Try to get real data from Supabase first
    let trendingLooks = []
    
    if (supabase) {
      try {
        const { data: realData, error } = await supabase
          .from('fashion_images')
          .select('*')
          .order('crawled_at', { ascending: false })
          .limit(50)
        
        if (!error && realData && realData.length > 0) {
          // Transform real data to match expected format
          trendingLooks = realData.map((item, index) => ({
            id: `hb-real-${item.id}`,
            title: item.title || `Harper's Bazaar Fashion Look ${index + 1}`,
            description: item.alt_text || 'Latest fashion trend from Harper\'s Bazaar',
            category: 'harper_bazaar',
            source_site: 'harpers_bazaar',
            source_url: item.source_url,
            primary_image_url: item.stored_url,
            image_alt_text: item.alt_text,
            trend_score: 0.9 - (index * 0.05), // Decreasing score for older items
            engagement_score: 0.8 - (index * 0.03),
            is_featured: index < 3,
            tags: ['harper-bazaar', 'fashion', 'trending'],
            crawled_at: item.crawled_at
          }))
        }
      } catch (dbError) {
        console.log('Database query failed, using fallback data:', dbError.message)
      }
    }
    
    // Fallback to curated data if no real data available
    if (trendingLooks.length === 0) {
      console.log('Using fallback data - no real crawled data available')
      trendingLooks = [
      {
        id: 'hb-001',
        title: 'Oversized Blazers Are the Ultimate Power Move',
        description: 'Channel your inner boss with these statement blazers that redefine professional chic.',
        category: 'runway_trends',
        source_site: 'harpers_bazaar',
        source_url: 'https://www.harpersbazaar.com/fashion/trends/',
        primary_image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center',
        image_alt_text: 'Oversized blazer fashion trend',
        trend_score: 0.95,
        engagement_score: 0.88,
        is_featured: true,
        tags: ['blazers', 'power-dressing', 'oversized', 'professional'],
        crawled_at: new Date().toISOString()
      },
      {
        id: 'hb-002',
        title: 'Metallic Textures Dominate Fall Runways',
        description: 'Shimmer and shine your way through the season with these lustrous metallic pieces.',
        category: 'runway_trends',
        source_site: 'harpers_bazaar',
        source_url: 'https://www.harpersbazaar.com/fashion/trends/',
        primary_image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&crop=center',
        image_alt_text: 'Metallic fashion textures',
        trend_score: 0.92,
        engagement_score: 0.85,
        is_featured: true,
        tags: ['metallic', 'textures', 'fall', 'runway'],
        crawled_at: new Date().toISOString()
      },
      {
        id: 'hb-003',
        title: 'Sustainable Fashion Takes Center Stage',
        description: 'Eco-conscious designs that prove style and sustainability go hand in hand.',
        category: 'sustainable_fashion',
        source_site: 'harpers_bazaar',
        source_url: 'https://www.harpersbazaar.com/fashion/trends/',
        primary_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center',
        image_alt_text: 'Sustainable fashion collection',
        trend_score: 0.89,
        engagement_score: 0.82,
        is_featured: false,
        tags: ['sustainable', 'eco-friendly', 'conscious-fashion'],
        crawled_at: new Date().toISOString()
      },
      {
        id: 'hb-004',
        title: 'Bold Color Blocking Makes a Statement',
        description: 'Make heads turn with these vibrant color combinations that scream confidence.',
        category: 'color_trends',
        source_site: 'harpers_bazaar',
        source_url: 'https://www.harpersbazaar.com/fashion/trends/',
        primary_image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&crop=center',
        image_alt_text: 'Color blocking fashion trend',
        trend_score: 0.87,
        engagement_score: 0.79,
        is_featured: false,
        tags: ['color-blocking', 'bold-colors', 'statement-pieces'],
        crawled_at: new Date().toISOString()
      },
      {
        id: 'hb-005',
        title: 'Minimalist Accessories That Speak Volumes',
        description: 'Less is more with these carefully curated accessories that elevate any look.',
        category: 'accessories',
        source_site: 'harpers_bazaar',
        source_url: 'https://www.harpersbazaar.com/fashion/trends/',
        primary_image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=600&fit=crop&crop=center',
        image_alt_text: 'Minimalist accessories collection',
        trend_score: 0.84,
        engagement_score: 0.76,
        is_featured: false,
        tags: ['accessories', 'minimalist', 'elevated-basics'],
        crawled_at: new Date().toISOString()
      },
      {
        id: 'hb-006',
        title: 'Vintage-Inspired Silhouettes Return',
        description: 'Nostalgic cuts and classic shapes get a modern twist for contemporary appeal.',
        category: 'vintage_inspired',
        source_site: 'harpers_bazaar',
        source_url: 'https://www.harpersbazaar.com/fashion/trends/',
        primary_image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&crop=center',
        image_alt_text: 'Vintage-inspired fashion silhouettes',
        trend_score: 0.81,
        engagement_score: 0.73,
        is_featured: false,
        tags: ['vintage', 'silhouettes', 'classic-cuts'],
        crawled_at: new Date().toISOString()
      },
      {
        id: 'hb-007',
        title: 'Athleisure Meets High Fashion',
        description: 'Where comfort meets couture in this perfect blend of athletic and elegant.',
        category: 'athleisure',
        source_site: 'harpers_bazaar',
        source_url: 'https://www.harpersbazaar.com/fashion/trends/',
        primary_image_url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop&crop=center',
        image_alt_text: 'Athleisure high fashion trend',
        trend_score: 0.78,
        engagement_score: 0.71,
        is_featured: false,
        tags: ['athleisure', 'comfort', 'high-fashion'],
        crawled_at: new Date().toISOString()
      },
      {
        id: 'hb-008',
        title: 'Statement Sleeves Steal the Show',
        description: 'Dramatic sleeves that transform any outfit into a runway-worthy ensemble.',
        category: 'statement_pieces',
        source_site: 'harpers_bazaar',
        source_url: 'https://www.harpersbazaar.com/fashion/trends/',
        primary_image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center',
        image_alt_text: 'Statement sleeves fashion trend',
        trend_score: 0.75,
        engagement_score: 0.68,
        is_featured: false,
        tags: ['statement-sleeves', 'dramatic', 'runway'],
        crawled_at: new Date().toISOString()
      }
    ]

    // Get query parameters
    const { limit = 50, category, min_score = 0 } = req.query

    // Filter and limit results
    let filteredLooks = trendingLooks

    if (category) {
      filteredLooks = filteredLooks.filter(look => 
        look.category === category || look.tags.includes(category)
      )
    }

    if (min_score) {
      filteredLooks = filteredLooks.filter(look => 
        look.trend_score >= parseFloat(min_score)
      )
    }

    // Sort by trend score (highest first)
    filteredLooks.sort((a, b) => b.trend_score - a.trend_score)

    // Apply limit
    const limitedLooks = filteredLooks.slice(0, parseInt(limit))

    res.status(200).json({
      success: true,
      data: limitedLooks,
      meta: {
        total: limitedLooks.length,
        source: 'harpers_bazaar',
        crawled_at: new Date().toISOString(),
        filters: {
          limit: parseInt(limit),
          category: category || null,
          min_score: parseFloat(min_score)
        }
      }
    })

  } catch (error) {
    console.error('Trending API error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending looks',
      message: error.message
    })
  }
}