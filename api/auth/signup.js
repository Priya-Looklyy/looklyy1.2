// Supabase-backed Signup API (server-side only)
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET

// Debug logging for environment variables
console.log('🔧 Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET')
console.log('🔧 Supabase Service Role:', supabaseServiceRole ? 'SET' : 'NOT SET')

const supabase = supabaseUrl && supabaseServiceRole ? createClient(supabaseUrl, supabaseServiceRole) : null

export default async function handler(req, res) {
  // Allow all origins for simplicity while we stabilize
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase is not configured on the server' })
    }

    const { name, email, password } = req.body || {}

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const { data: existing, error: existingErr } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .maybeSingle()

    if (existingErr) {
      console.error('Supabase select error:', existingErr)
      // Continue – table might have different structure; we will try insert
    }

    if (existing && existing.email === email) {
      return res.status(409).json({ success: false, error: 'User already exists' })
    }

    // Hash password with sha256 for now (keeps zero extra deps). Replace with bcrypt later.
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex')

    // Try inserting into existing 'users' table with common columns
    const { data: inserted, error: insertErr } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash: passwordHash,
        },
      ])
      .select('id, name, email')
      .maybeSingle()

    if (insertErr) {
      console.error('Supabase insert error (users):', insertErr)
      return res.status(500).json({ success: false, error: 'Database error while creating user' })
    }

    return res.status(200).json({ success: true, user: inserted })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
}
