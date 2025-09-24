// Simple Signup API - No CORS issues
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
    const { name, email, password } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and password are required' 
      })
    }
    
    // Simple validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      })
    }
    
    // For now, just return success - we'll add Supabase later
    res.status(200).json({ 
      success: true, 
      message: 'User created successfully',
      user: { name, email }
    })
    
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    })
  }
}
