import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase not configured' })

  try {
    const { data, error } = await supabase
      .from('fashion_images_new')
      .select('id, original_url, title, description, category, score, needs_training, training_status, training_feedback')
      .order('needs_training', { ascending: false })
      .order('id', { ascending: false })
      .limit(50)

    if (error) return res.status(500).json({ success: false, error: error.message })

    return res.status(200).json({ success: true, images: data || [] })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
}


