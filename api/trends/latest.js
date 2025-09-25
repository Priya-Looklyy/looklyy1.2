import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
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
    let trendingLooks = []

    // Try to get real data from Supabase
    if (supabase) {
      try {
        const { data: realData, error } = await supabase
          .from('fashion_images_new')
          .select('*')
          .order('id', { ascending: false })
          .limit(50)

        if (!error && realData && realData.length > 0) {
          console.log(`Found ${realData.length} real crawled images`)
          trendingLooks = realData.map((item, index) => ({
            id: `hb-real-${item.id}`,
            title: item.title || `Harper's Bazaar Fashion Look ${index + 1}`,
            description: item.description || 'Latest fashion trend from Harper\'s Bazaar',
            category: item.category || 'harper_bazaar',
            source_site: 'harpers_bazaar',
            source_url: 'https://www.harpersbazaar.com/fashion/',
            primary_image_url: item.original_url || `https://images.unsplash.com/photo-${1441986300917 + index}?w=400&h=600&fit=crop&auto=format`,
            image_alt_text: item.title || 'Harper\'s Bazaar fashion image',
            trend_score: 0.9 - (index * 0.05),
            engagement_score: 0.8 - (index * 0.03),
            is_featured: index < 3,
            tags: ['harper-bazaar', 'fashion', 'trending'],
            crawled_at: item.crawled_at || new Date().toISOString()
          }))
        }
      } catch (dbError) {
        console.log('Database query failed:', dbError.message)
      }
    }

    // No fallback data - only show real crawled data
    if (trendingLooks.length === 0) {
      console.log('No crawled data available - crawler may not be working')
      return res.status(200).json({
        success: true,
        data: [],
        meta: {
          total: 0,
          source: 'no_data_available',
          crawled_at: new Date().toISOString(),
          message: 'Crawler has not provided any data yet'
        }
      })
    }

    const { limit = 50, category, min_score = 0 } = req.query
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

    filteredLooks.sort((a, b) => b.trend_score - a.trend_score)
    const limitedLooks = filteredLooks.slice(0, parseInt(limit))

    res.status(200).json({
      success: true,
      data: limitedLooks,
      meta: {
        total: limitedLooks.length,
        source: limitedLooks.length > 0 && limitedLooks[0].id.startsWith('hb-real') ? 'harpers_bazaar_crawled' : 'harpers_bazaar_mock',
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
    
    // Simple fallback on error
    const fallbackLooks = [
      {
        id: 'fallback-1',
        title: 'Fallback Fashion Look',
        description: 'Fashion inspiration from Harper\'s Bazaar',
        category: 'harper_bazaar',
        source_site: 'harpers_bazaar',
        source_url: 'https://www.harpersbazaar.com/fashion/',
        primary_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
        image_alt_text: 'Fashion image',
        trend_score: 0.9,
        engagement_score: 0.8,
        is_featured: true,
        tags: ['harper-bazaar', 'fashion', 'trending'],
        crawled_at: new Date().toISOString()
      }
    ]
    
    res.status(200).json({
      success: true,
      data: fallbackLooks,
      meta: {
        total: fallbackLooks.length,
        source: 'fallback_due_to_error',
        crawled_at: new Date().toISOString(),
        error: error.message
      }
    })
  }
}
