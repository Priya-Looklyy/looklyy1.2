import { prisma } from '../../lib/db.js'
import { verifyPassword, generateToken } from '../../lib/auth.js'

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
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      })
    }

    // Generate JWT token
    const token = generateToken(user.id)

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      success: true,
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      error: 'Internal server error' 
    })
  }
}
