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
    console.log('🔧 Setting up RLS policies...')
    
    // Note: RLS policies need to be set up manually in Supabase dashboard
    // This endpoint provides the SQL commands to run
    
    const rlsPolicies = {
      storage_policies: [
        {
          name: 'Allow public uploads to fashion-images bucket',
          sql: `CREATE POLICY "Allow public uploads to fashion-images bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fashion-images');`
        },
        {
          name: 'Allow public reads from fashion-images bucket',
          sql: `CREATE POLICY "Allow public reads from fashion-images bucket" ON storage.objects FOR SELECT USING (bucket_id = 'fashion-images');`
        }
      ],
      table_policies: [
        {
          name: 'Allow public inserts to fashion_images',
          sql: `CREATE POLICY "Allow public inserts to fashion_images" ON fashion_images FOR INSERT WITH CHECK (true);`
        },
        {
          name: 'Allow public reads from fashion_images',
          sql: `CREATE POLICY "Allow public reads from fashion_images" ON fashion_images FOR SELECT USING (true);`
        },
        {
          name: 'Allow public inserts to crawl_logs',
          sql: `CREATE POLICY "Allow public inserts to crawl_logs" ON crawl_logs FOR INSERT WITH CHECK (true);`
        },
        {
          name: 'Allow public reads from crawl_logs',
          sql: `CREATE POLICY "Allow public reads from crawl_logs" ON crawl_logs FOR SELECT USING (true);`
        }
      ]
    }
    
    return res.status(200).json({
      success: true,
      message: 'RLS policy setup instructions',
      instructions: {
        step1: 'Go to your Supabase dashboard',
        step2: 'Navigate to Authentication → Policies',
        step3: 'Run the SQL commands below for each table and storage bucket',
        step4: 'Or disable RLS temporarily for testing'
      },
      policies: rlsPolicies,
      alternative: {
        message: 'Alternative: Disable RLS for testing',
        steps: [
          'Go to Supabase dashboard',
          'Navigate to Authentication → Policies',
          'Find the fashion_images table',
          'Click "Disable RLS"',
          'Repeat for crawl_logs table',
          'For storage: Go to Storage → Settings → Disable RLS for fashion-images bucket'
        ]
      }
    })
    
  } catch (error) {
    console.error('❌ RLS setup error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
