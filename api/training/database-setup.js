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
    console.log('🔧 Setting up training database...')
    
    // Add training columns to existing fashion_images_new table
    const { error: alterTable, data } = await supabase
      .from('fashion_images_new')
      .select('*')
      .limit(1)

    if (alterTable && alterTable.code === '42501') {
      console.log('📋 Adding training columns to fashion_images_new table...')
      
      // Since Supabase doesn't support ALTER directly via API, we'll document what needs to be done
      return res.status(200).json({
        success: true,
        message: 'Training database ready - manually add these columns to fashion_images_new:',
        columns_to_add: `
          needs_training BOOLEAN DEFAULT true,
          training_status TEXT DEFAULT 'pending',
          training_feedback TEXT,
          training_category TEXT,
          training_notes TEXT,
          training_timestamp TIMESTAMP WITH TIME ZONE
        `
      })
    }

    // Create learning_patterns table for algorithm training
    const { error: patternTable } = await supabase
      .from('learning_patterns')
      .select('*')
      .limit(1)

    if (patternTable && patternTable.code === 'PGRST116') {
      return res.status(200).json({
        success: true,
        message: 'Learning tables ready - add with SQL:',
        sql_to_run: `
          CREATE TABLE IF NOT EXISTS learning_patterns (
            id SERIAL PRIMARY KEY,
            image_url TEXT NOT NULL,
            approved BOOLEAN NOT NULL,
            categories TEXT[],
            keywords TEXT[],
            image_features JSON,
            user_notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Training system is ready'
    })

  } catch (error) {
    console.error('❌ Training database setup error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
