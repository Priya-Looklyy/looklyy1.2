// Simple authentication without database dependency
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  // Simple hardcoded user for testing
  if (email === 'test@test.com' && password === 'test123') {
    return res.status(200).json({
      success: true,
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        avatar: 'https://ui-avatars.com/api/?name=Test+User&background=f0f0f0&color=1a1a1a',
        preferences: { theme: 'purple', notifications: true }
      },
      token: 'test-token-123'
    })
  }

  return res.status(400).json({ message: 'Invalid credentials' })
}
