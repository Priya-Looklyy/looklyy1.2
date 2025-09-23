import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'
const supabase = createClient(supabaseUrl, supabaseKey)

const JWT_SECRET = process.env.JWT_SECRET || 'looklyy-super-secret-jwt-key-2024-production-ready'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  console.log('Login endpoint called with:', req.body)

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  try {
    console.log('Attempting to connect to Supabase...')
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    console.log('Supabase query result:', { user: !!user, error: findError })

    if (findError || !user) {
      console.log('User not found or error:', findError)
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      console.log('Password mismatch')
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    console.log('Login successful for user:', user.email)
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
      },
      token,
    })

  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ message: error.message || 'Server error during login' })
  }
}