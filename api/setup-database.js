import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!supabase) {
    return res.status(500).json({ 
      success: false, 
      error: 'Supabase is not configured on the server' 
    })
  }

  try {
    console.log('🔧 Setting up database tables for crawler...')
    
    // Create fashion_images table
    const { data: fashionImagesTable, error: fashionImagesError } = await supabase
      .from('fashion_images')
      .select('*')
      .limit(1)
    
    if (fashionImagesError && fashionImagesError.code === 'PGRST116') {
      console.log('📋 Creating fashion_images table...')
      // Table doesn't exist, we need to create it via SQL
      const { data: createTable, error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS fashion_images (
            id SERIAL PRIMARY KEY,
            original_url TEXT NOT NULL,
            stored_url TEXT NOT NULL,
            alt_text TEXT,
            title TEXT,
            source_url TEXT NOT NULL,
            crawled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            platform TEXT DEFAULT 'harper-bazaar',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      })
      
      if (createError) {
        console.error('❌ Error creating fashion_images table:', createError)
      } else {
        console.log('✅ fashion_images table created')
      }
    } else {
      console.log('✅ fashion_images table already exists')
    }
    
    // Create crawl_logs table
    const { data: crawlLogsTable, error: crawlLogsError } = await supabase
      .from('crawl_logs')
      .select('*')
      .limit(1)
    
    if (crawlLogsError && crawlLogsError.code === 'PGRST116') {
      console.log('📋 Creating crawl_logs table...')
      const { data: createTable, error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS crawl_logs (
            id SERIAL PRIMARY KEY,
            crawl_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            urls_crawled TEXT[],
            images_found INTEGER DEFAULT 0,
            images_stored INTEGER DEFAULT 0,
            errors TEXT[],
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      })
      
      if (createError) {
        console.error('❌ Error creating crawl_logs table:', createError)
      } else {
        console.log('✅ crawl_logs table created')
      }
    } else {
      console.log('✅ crawl_logs table already exists')
    }
    
    // Create storage bucket for fashion images
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError)
    } else {
      const fashionImagesBucket = buckets.find(bucket => bucket.name === 'fashion-images')
      
      if (!fashionImagesBucket) {
        console.log('📦 Creating fashion-images storage bucket...')
        const { data: bucket, error: bucketError } = await supabase.storage.createBucket('fashion-images', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 10485760 // 10MB
        })
        
        if (bucketError) {
          console.error('❌ Error creating bucket:', bucketError)
        } else {
          console.log('✅ fashion-images bucket created')
        }
      } else {
        console.log('✅ fashion-images bucket already exists')
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Database setup completed',
      tables: {
        fashion_images: 'created/exists',
        crawl_logs: 'created/exists'
      },
      storage: {
        fashion_images_bucket: 'created/exists'
      }
    })
    
  } catch (error) {
    console.error('❌ Database setup error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
