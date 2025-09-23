import { prisma } from '../../lib/db.js'
import { getTokenFromRequest, verifyToken } from '../../lib/auth.js'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    // Get token from request
    const token = getTokenFromRequest(req)

    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided' 
      })
    }

    // Verify token
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({ 
        error: 'Invalid token' 
      })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        preferences: true
      }
    })

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      })
    }

    res.status(200).json({
      success: true,
      user
    })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ 
      error: 'Internal server error' 
    })
  }
}
