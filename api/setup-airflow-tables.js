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
    console.log('🏗️ Setting up Airflow pipeline database tables...')

    const tables = []

    // 1. User Favorites Table (for heart-marked images)
    const userFavoritesTable = `
      CREATE TABLE IF NOT EXISTS user_favorites (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT NOT NULL DEFAULT 'default_user',
        image_id BIGINT NOT NULL,
        original_url TEXT NOT NULL,
        is_heart_marked BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, image_id)
      );
    `
    tables.push({ name: 'user_favorites', sql: userFavoritesTable })

    // 2. User Database Table (synced heart-marked images)
    const userDatabaseTable = `
      CREATE TABLE IF NOT EXISTS user_database (
        id BIGSERIAL PRIMARY KEY,
        original_url TEXT NOT NULL UNIQUE,
        title TEXT,
        description TEXT,
        category TEXT,
        is_heart_marked BOOLEAN DEFAULT true,
        synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        global_image_id BIGINT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    tables.push({ name: 'user_database', sql: userDatabaseTable })

    // 3. Review Sessions Table (for tracking manual review cycles)
    const reviewSessionsTable = `
      CREATE TABLE IF NOT EXISTS review_sessions (
        id BIGSERIAL PRIMARY KEY,
        session_id TEXT NOT NULL UNIQUE,
        review_type TEXT NOT NULL,
        sync_timestamp TIMESTAMP WITH TIME ZONE,
        total_images INTEGER DEFAULT 0,
        images_reviewed INTEGER DEFAULT 0,
        images_approved INTEGER DEFAULT 0,
        images_rejected INTEGER DEFAULT 0,
        images_duplicates INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE
      );
    `
    tables.push({ name: 'review_sessions', sql: reviewSessionsTable })

    // 4. Add new columns to existing fashion_images_new table
    const addTrainingColumns = `
      ALTER TABLE fashion_images_new 
      ADD COLUMN IF NOT EXISTS training_status TEXT DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS training_feedback TEXT,
      ADD COLUMN IF NOT EXISTS training_timestamp TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS needs_training BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS review_session_id TEXT,
      ADD COLUMN IF NOT EXISTS queued_at TIMESTAMP WITH TIME ZONE;
    `
    tables.push({ name: 'fashion_images_new_columns', sql: addTrainingColumns })

    // 5. Pipeline Logs Table (for tracking Airflow pipeline runs)
    const pipelineLogsTable = `
      CREATE TABLE IF NOT EXISTS pipeline_logs (
        id BIGSERIAL PRIMARY KEY,
        dag_run_id TEXT NOT NULL,
        task_id TEXT NOT NULL,
        status TEXT NOT NULL,
        start_time TIMESTAMP WITH TIME ZONE,
        end_time TIMESTAMP WITH TIME ZONE,
        duration_seconds INTEGER,
        error_message TEXT,
        result_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    tables.push({ name: 'pipeline_logs', sql: pipelineLogsTable })

    // 6. Learning Patterns Table (for storing model learning data)
    const learningPatternsTable = `
      CREATE TABLE IF NOT EXISTS learning_patterns (
        id BIGSERIAL PRIMARY KEY,
        cycle_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        approved_count INTEGER DEFAULT 0,
        rejected_count INTEGER DEFAULT 0,
        duplicate_count INTEGER DEFAULT 0,
        excluded_urls JSONB,
        preferred_categories JSONB,
        positive_keywords JSONB,
        url_patterns JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    tables.push({ name: 'learning_patterns', sql: learningPatternsTable })

    // Create all tables
    const results = []
    for (const table of tables) {
      try {
        console.log(`Creating table: ${table.name}`)
        
        // Use the exec_sql RPC function if available, otherwise use direct SQL
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: table.sql
        })

        if (error) {
          console.error(`❌ Error creating ${table.name}:`, error.message)
          results.push({ table: table.name, success: false, error: error.message })
        } else {
          console.log(`✅ Created table: ${table.name}`)
          results.push({ table: table.name, success: true })
        }
      } catch (error) {
        console.error(`❌ Exception creating ${table.name}:`, error.message)
        results.push({ table: table.name, success: false, error: error.message })
      }
    }

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_favorites_heart_marked ON user_favorites(is_heart_marked);',
      'CREATE INDEX IF NOT EXISTS idx_user_database_heart_marked ON user_database(is_heart_marked);',
      'CREATE INDEX IF NOT EXISTS idx_review_sessions_status ON review_sessions(status);',
      'CREATE INDEX IF NOT EXISTS idx_review_sessions_created_at ON review_sessions(created_at);',
      'CREATE INDEX IF NOT EXISTS idx_fashion_images_training_status ON fashion_images_new(training_status);',
      'CREATE INDEX IF NOT EXISTS idx_fashion_images_review_session ON fashion_images_new(review_session_id);',
      'CREATE INDEX IF NOT EXISTS idx_pipeline_logs_dag_run ON pipeline_logs(dag_run_id);',
      'CREATE INDEX IF NOT EXISTS idx_learning_patterns_timestamp ON learning_patterns(cycle_timestamp);'
    ]

    console.log('Creating indexes...')
    for (const indexSql of indexes) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: indexSql })
        if (error) {
          console.error(`❌ Error creating index:`, error.message)
        } else {
          console.log(`✅ Created index`)
        }
      } catch (error) {
        console.error(`❌ Exception creating index:`, error.message)
      }
    }

    // Set up Row Level Security (RLS) policies
    const rlsPolicies = [
      // User favorites - users can only see their own
      'ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY IF NOT EXISTS "Users can manage their own favorites" ON user_favorites FOR ALL USING (user_id = current_setting(\'app.current_user_id\', true));',
      
      // User database - users can only see their own
      'ALTER TABLE user_database ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY IF NOT EXISTS "Users can view their own database" ON user_database FOR SELECT USING (true);', // Allow read for now
      
      // Review sessions - admin only
      'ALTER TABLE review_sessions ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY IF NOT EXISTS "Admin can manage review sessions" ON review_sessions FOR ALL USING (true);', // Allow all for now
      
      // Pipeline logs - admin only
      'ALTER TABLE pipeline_logs ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY IF NOT EXISTS "Admin can manage pipeline logs" ON pipeline_logs FOR ALL USING (true);', // Allow all for now
      
      // Learning patterns - admin only
      'ALTER TABLE learning_patterns ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY IF NOT EXISTS "Admin can manage learning patterns" ON learning_patterns FOR ALL USING (true);' // Allow all for now
    ]

    console.log('Setting up RLS policies...')
    for (const policySql of rlsPolicies) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: policySql })
        if (error) {
          console.error(`❌ Error setting up RLS policy:`, error.message)
        } else {
          console.log(`✅ Set up RLS policy`)
        }
      } catch (error) {
        console.error(`❌ Exception setting up RLS policy:`, error.message)
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    return res.status(200).json({
      success: true,
      message: `Airflow pipeline database setup completed: ${successCount}/${totalCount} tables created`,
      results: results,
      tables_created: successCount,
      total_tables: totalCount,
      setup_timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error setting up Airflow pipeline database:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
