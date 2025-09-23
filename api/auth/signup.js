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

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  try {
    // Check if user exists
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    if (findError && findError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw findError
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    console.log('Creating user with data:', { name, email, hashedPassword: hashedPassword.substring(0, 20) + '...' })
    
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f0f0f0&color=1a1a1a`,
          preferences: { theme: 'purple', notifications: true },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
      .select()
      .single()

    console.log('User creation result:', { 
      user: newUser ? { id: newUser.id, email: newUser.email, name: newUser.name } : null,
      error: createError ? { message: createError.message, code: createError.code, details: createError.details } : null
    })

    if (createError) {
      console.log('User creation error:', createError)
      return res.status(500).json({ message: 'Database error: ' + createError.message })
    }

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        preferences: newUser.preferences,
      },
      token,
    })

  } catch (error) {
    console.error('Signup error:', error.message)
    res.status(500).json({ message: error.message || 'Server error during signup' })
  }
}