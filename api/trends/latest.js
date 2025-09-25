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
          .order('trend_score', { ascending: false }) // Order by trend score (highest first)
          .limit(100)

        if (!error && realData && realData.length > 0) {
          console.log(`Found ${realData.length} real crawled images`)
          
          // Organize data by categories
          const categorizedData = {
            trending: [], // Top 10 most trending
            trends: [],
            runway: [],
            'street-style': [],
            'celebrity-style': [],
            designers: []
          }
          
          // Sort by trend score and categorize
          realData.forEach((item, index) => {
            const transformedItem = {
              id: `hb-real-${item.id}`,
              title: item.title || `Harper's Bazaar Fashion Look ${index + 1}`,
              description: item.description || 'Latest fashion trend from Harper\'s Bazaar',
              category: item.category || 'trends',
              subcategory: item.subcategory || 'general',
              source_site: 'harpers_bazaar',
              source_url: item.source_url || 'https://www.harpersbazaar.com/fashion/',
              primary_image_url: item.original_url,
              image_alt_text: item.title || 'Harper\'s Bazaar fashion image',
              trend_score: item.trend_score || 0.8,
              engagement_score: 0.8 - (index * 0.01),
              is_featured: index < 10, // Top 10 are featured
              tags: ['harper-bazaar', 'fashion', item.category || 'trending'],
              crawled_at: item.crawled_at || new Date().toISOString()
            }
            
            // Add to trending (top 10)
            if (index < 10) {
              categorizedData.trending.push(transformedItem)
            }
            
            // Add to category
            const category = item.category || 'trends'
            if (categorizedData[category]) {
              categorizedData[category].push(transformedItem)
            } else {
              categorizedData.trends.push(transformedItem) // Fallback
            }
          })
          
          // Return organized data
          trendingLooks = {
            trending: categorizedData.trending.slice(0, 10), // Top 10 trending
            categories: {
              trends: categorizedData.trends.slice(0, 15),
              runway: categorizedData.runway.slice(0, 15),
              'street-style': categorizedData['street-style'].slice(0, 15),
              'celebrity-style': categorizedData['celebrity-style'].slice(0, 15),
              designers: categorizedData.designers.slice(0, 15)
            }
          }
        }
      } catch (dbError) {
        console.log('Database query failed:', dbError.message)
      }
    }

    // Check if we have categorized data
    if (!trendingLooks || (typeof trendingLooks === 'object' && !trendingLooks.trending)) {
      console.log('No crawled data available - crawler may not be working')
      return res.status(200).json({
        success: true,
        data: {
          trending: [],
          categories: {
            trends: [],
            runway: [],
            'street-style': [],
            'celebrity-style': [],
            designers: []
          }
        },
        meta: {
          total: 0,
          source: 'no_data_available',
          crawled_at: new Date().toISOString(),
          message: 'Crawler has not provided any data yet'
        }
      })
    }

    // Return categorized data
    res.status(200).json({
      success: true,
      data: trendingLooks,
      meta: {
        total: trendingLooks.trending.length + 
               Object.values(trendingLooks.categories).reduce((sum, cat) => sum + cat.length, 0),
        source: 'harpers_bazaar_crawled_categorized',
        crawled_at: new Date().toISOString(),
        categories: Object.keys(trendingLooks.categories),
        trending_count: trendingLooks.trending.length
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
