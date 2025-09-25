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

  if (!supabase) {
    return res.status(500).json({ 
      success: false, 
      error: 'Supabase client not configured',
      details: {
        supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
        supabaseAnonKey: supabaseAnonKey ? 'SET' : 'NOT SET'
      }
    })
  }

  try {
    const results = {
      connection: {},
      table: {},
      schema: {},
      rls: {}
    }

    // 1. Test basic connection
    console.log('Testing Supabase connection...')
    try {
      const { data, error } = await supabase.from('fashion_images').select('count').limit(1)
      if (error) {
        results.connection.status = 'FAILED'
        results.connection.error = error.message
        results.connection.code = error.code
      } else {
        results.connection.status = 'SUCCESS'
        results.connection.message = 'Connected to Supabase'
      }
    } catch (connError) {
      results.connection.status = 'FAILED'
      results.connection.error = connError.message
    }

    // 2. Test table existence and get schema
    console.log('Testing table existence and schema...')
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_name', 'fashion_images')
        .eq('table_schema', 'public')
      
      if (schemaError) {
        results.table.status = 'FAILED'
        results.table.error = schemaError.message
      } else if (!schemaData || schemaData.length === 0) {
        results.table.status = 'NOT_FOUND'
        results.table.error = 'fashion_images table does not exist'
      } else {
        results.table.status = 'EXISTS'
        results.table.columns = schemaData.map(col => ({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable === 'YES',
          default: col.column_default
        }))
      }
    } catch (tableError) {
      results.table.status = 'FAILED'
      results.table.error = tableError.message
    }

    // 3. Test RLS status
    console.log('Testing RLS status...')
    try {
      const { data: rlsData, error: rlsError } = await supabase
        .from('pg_tables')
        .select('tablename, rowsecurity')
        .eq('tablename', 'fashion_images')
        .eq('schemaname', 'public')
        .single()
      
      if (rlsError) {
        results.rls.status = 'UNKNOWN'
        results.rls.error = rlsError.message
      } else {
        results.rls.status = rlsData.rowsecurity ? 'ENABLED' : 'DISABLED'
        results.rls.message = rlsData.rowsecurity ? 'RLS is enabled' : 'RLS is disabled'
      }
    } catch (rlsTestError) {
      results.rls.status = 'UNKNOWN'
      results.rls.error = rlsTestError.message
    }

    // 4. Test simple insert
    console.log('Testing simple insert...')
    try {
      const { error: insertError } = await supabase
        .from('fashion_images')
        .insert([{
          original_url: 'https://test.example.com/image.jpg',
          stored_url: 'https://test.example.com/image.jpg'
        }])
      
      if (insertError) {
        results.insert = {
          status: 'FAILED',
          error: insertError.message,
          code: insertError.code,
          details: insertError.details
        }
      } else {
        results.insert = {
          status: 'SUCCESS',
          message: 'Simple insert worked'
        }
      }
    } catch (insertTestError) {
      results.insert = {
        status: 'FAILED',
        error: insertTestError.message
      }
    }

    res.status(200).json({
      success: true,
      message: 'Supabase diagnostic completed',
      results
    })

  } catch (error) {
    console.error('Supabase diagnostic error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
