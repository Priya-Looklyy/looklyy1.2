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

  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' })
    }

    // Simple test - just return success without database
    res.status(200).json({
      success: true,
      message: 'Test signup successful',
      user: {
        id: 'test-123',
        name,
        email,
        avatar: 'https://example.com/avatar.jpg'
      },
      token: 'test-token-123'
    })

  } catch (error) {
    console.error('Test signup error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
