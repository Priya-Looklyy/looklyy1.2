// Simple signup without database dependency
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

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  // Simple hardcoded response for testing
  return res.status(201).json({
    success: true,
    user: {
      id: Date.now().toString(),
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f0f0f0&color=1a1a1a`,
      preferences: { theme: 'purple', notifications: true }
    },
    token: 'test-token-' + Date.now()
  })
}
