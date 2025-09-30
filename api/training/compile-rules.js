import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase not configured' })

  try {
    // Pull recent patterns if table exists; otherwise compile defaults
    let patterns = []
    try {
      const { data, error } = await supabase
        .from('learning_patterns')
        .select('pattern_type, pattern_value, feedback_type, confidence_score')
        .limit(500)
      if (!error && data) patterns = data
    } catch (_) {}

    const defaults = {
      positiveKeywords: ['runway','street-style','designer','trends','fashion-week','full look','outfit'],
      negativeKeywords: ['poster','trailer','teaser','netflix','disney','primevideo','movie','cinema','face','headshot','portrait','selfie','icon','sprite','logo','collage']
    }

    const compiled = {
      version: Date.now(),
      weights: {
        positiveSection: 0.25,
        positiveFullLook: 0.2,
        negativeMedia: 0.4,
        negativeFace: 0.3,
        negativeUi: 0.4
      },
      lists: defaults,
      learned: patterns
    }

    return res.status(200).json({ success: true, rules: compiled })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
}


