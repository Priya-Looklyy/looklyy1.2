import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    console.log('🧪 TESTING CRAWLER STORAGE LOGIC...')
    
    // Simulate the exact same logic as the crawler
    const testImages = [
      {
        src: 'https://test1.com/image1.jpg',
        alt: 'Test image 1',
        category: 'test',
        subcategory: 'test',
        trendScore: 85,
        sourceUrl: 'https://test.com',
        crawledAt: new Date().toISOString()
      },
      {
        src: 'https://test2.com/image2.jpg', 
        alt: 'Test image 2',
        category: 'test',
        subcategory: 'test',
        trendScore: 90,
        sourceUrl: 'https://test.com',
        crawledAt: new Date().toISOString()
      }
    ]

    console.log(`📥 Testing with ${testImages.length} test images`)
    
    // Test the exact same storage logic as crawler
    let storedImages = 0
    const errors = []
    
    for (const image of testImages) {
      try {
        console.log(`🔍 DEBUG: Attempting to store image ${storedImages + 1}:`, image.src)
        
        const { data, error } = await supabase
          .from('fashion_images_new')
          .insert([{
            original_url: image.src,
            title: `Test Image ${storedImages + 1}`,
            description: image.alt || 'Test description',
            category: image.category
          }])
        
        console.log(`🔍 DEBUG: Insert result - data:`, data, 'error:', error)
        
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
    
    // Clean up test data
    for (const image of testImages) {
      await supabase
        .from('fashion_images_new')
        .delete()
        .eq('original_url', image.src)
    }
    
    return res.status(200).json({
      success: true,
      message: 'Crawler storage test completed',
      results: {
        test_images: testImages.length,
        images_stored: storedImages,
        errors: errors.length,
        error_details: errors,
        storage_works: storedImages === testImages.length
      }
    })

  } catch (error) {
    console.error('❌ Test error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
