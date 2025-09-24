// Simple Login API - No CORS issues
export default async function handler(req, res) {
  // Allow all origins for simplicity
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      })
    }
    
    // Simple mock login - we'll add real auth later
    if (email === 'test@example.com' && password === 'password123') {
      res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        user: { name: 'Test User', email: 'test@example.com' },
        token: 'mock-token-123'
      })
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      })
    }
    
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    })
  }
}
