import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'
const supabase = createClient(supabaseUrl, supabaseKey)

const JWT_SECRET = process.env.JWT_SECRET || 'looklyy-super-secret-jwt-key-2024-production-ready'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.id)
        .single()

      if (error || !data) {
        return res.status(401).json({ message: 'Not authorized, user not found' })
      }

      res.status(200).json({
        success: true,
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          preferences: data.preferences,
        },
      })

    } catch (error) {
      console.error('Token verification failed:', error.message)
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
}