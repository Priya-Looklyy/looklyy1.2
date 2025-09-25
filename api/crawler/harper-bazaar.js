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
    
    // Test URLs to crawl
    const testUrls = [
      'https://www.harpersbazaar.com/fashion/',
      'https://www.harpersbazaar.com/fashion/trends/'
    ]
    
    let imagesFound = 0
    let imagesStored = 0
    const errors = []
    
    // Try to crawl one URL
    try {
      const response = await fetch(testUrls[0], {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (response.ok) {
        const html = await response.text()
        // Extract image URLs
        const imageMatches = html.match(/<img[^>]+src="([^"]+)"/gi)
        imagesFound = imageMatches ? imageMatches.length : 0
        console.log(`Found ${imagesFound} images`)
        
        // Try to store first few images
        console.log('About to process image matches...')
        if (imageMatches && imageMatches.length > 0) {
          console.log(`Processing ${imageMatches.length} image matches`)
          
          const imageUrls = imageMatches.slice(0, 3).map(match => {
            const srcMatch = match.match(/src="([^"]+)"/)
            let url = srcMatch ? srcMatch[1] : null
            console.log(`Raw image match: ${match}`)
            console.log(`Extracted URL: ${url}`)
            
            // Convert relative URLs to absolute URLs
            if (url && !url.startsWith('http')) {
              if (url.startsWith('//')) {
                url = 'https:' + url
              } else if (url.startsWith('/')) {
                url = 'https://www.harpersbazaar.com' + url
              } else {
                url = 'https://www.harpersbazaar.com/' + url
              }
              console.log(`Converted to absolute URL: ${url}`)
            }
            
            return url
          }).filter(url => {
            const isValid = url && (url.includes('http') || url.includes('data:'))
            console.log(`URL ${url} is valid: ${isValid}`)
            return isValid
          })
          
          console.log(`Extracted ${imageUrls.length} image URLs`)
          console.log('First few URLs:', imageUrls.slice(0, 2))
          
          if (imageUrls.length === 0) {
            console.log('No valid HTTP URLs found in image matches')
            errors.push('No valid HTTP URLs found')
          } else {
            // Store images in database
            console.log('Starting database storage...')
            
            // First, test database table existence and structure
            try {
              console.log('Testing database table existence...')
              const { data: tableData, error: tableError } = await supabase
                .from('fashion_images')
                .select('*')
                .limit(1)
              
              if (tableError) {
                console.log('❌ Table access error:', tableError)
                errors.push(`Table access error: ${tableError.message}`)
              } else {
                console.log('✅ Table exists and is accessible')
                console.log('Table structure sample:', tableData)
                
                // Try to get table schema info
                try {
                  const { data: schemaData, error: schemaError } = await supabase
                    .from('information_schema.columns')
                    .select('column_name, data_type, is_nullable')
                    .eq('table_name', 'fashion_images')
                    .eq('table_schema', 'public')
                  
                  if (!schemaError && schemaData) {
                    console.log('Table columns:', schemaData.map(col => `${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`))
                  } else {
                    console.log('Schema error:', schemaError)
                  }
                } catch (schemaTestError) {
                  console.log('Could not get schema info:', schemaTestError.message)
                }
              }
            } catch (tableTestError) {
              console.log('❌ Table test exception:', tableTestError)
              errors.push(`Table test exception: ${tableTestError.message}`)
            }
            
            // Test with only the id column (auto-generated)
            try {
              console.log('Testing database connection with empty insert (id auto-generated)...')
              const { error: testError } = await supabase
                .from('fashion_images')
                .insert([{}])
              
              if (!testError) {
                console.log('✅ Database connection test successful with empty insert')
                imagesStored++
              } else {
                console.log('❌ Database connection test failed with empty insert:', testError)
                errors.push(`Database test error: ${testError.message}`)
              }
            } catch (testError) {
              console.log('❌ Database connection test exception:', testError)
              errors.push(`Database test exception: ${testError.message}`)
            }
            
            // Now try to store the actual crawled images (just store the URL in memory for now)
            for (const imageUrl of imageUrls) {
              try {
                console.log(`Attempting to store: ${imageUrl}`)
                // Store actual image data with proper columns
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
          }
        } else {
          console.log('No image matches found to store')
          errors.push('No image matches found')
        }
      } else {
        errors.push(`HTTP ${response.status}`)
      }
    } catch (error) {
      errors.push(error.message)
    }
    
    const result = {
      success: true,
      message: 'Crawler test with real data',
      results: {
        sections_crawled: 1,
        images_found: imagesFound,
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