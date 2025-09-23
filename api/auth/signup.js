import { prisma } from '../../lib/db.js'
import { hashPassword, generateToken } from '../../lib/auth.js'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Name, email, and password are required' 
      })
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f0f0f0&color=1a1a1a`
      }
    })

    // Generate JWT token
    const token = generateToken(user.id)

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ 
      error: 'Internal server error' 
    })
  }
}
