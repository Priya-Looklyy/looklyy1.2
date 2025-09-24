// Supabase-backed Login API (server-side only)
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET
const supabase = supabaseUrl && supabaseServiceRole ? createClient(supabaseUrl, supabaseServiceRole) : null

export default async function handler(req, res) {
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

    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' })
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex')

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash')
      .eq('email', email)
      .maybeSingle()

    if (error) {
      console.error('Supabase select error (login):', error)
      return res.status(500).json({ success: false, error: 'Database error while fetching user' })
    }

    if (!user || user.password_hash !== passwordHash) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    return res.status(200).json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
}
