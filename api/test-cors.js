export default async function handler(req, res) {
  // Enhanced CORS configuration for both domains
  const origin = req.headers.origin
  const allowedOrigins = [
    'https://www.looklyy.com',
    'https://looklyy.com',
    'http://localhost:3000' // For development
  ]
  
  console.log('🔍 CORS Test - Origin:', origin)
  console.log('🔍 CORS Test - Allowed origins:', allowedOrigins)
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    console.log('✅ CORS Test - Origin allowed:', origin)
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log('⚠️ CORS Test - Using wildcard for origin:', origin)
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400')

  // Handle preflight OPTIONS request immediately
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS Test - OPTIONS preflight handled')
    res.status(200).end()
    return
  }

  // Return test data
  res.status(200).json({
    success: true,
    message: 'CORS test successful',
    origin: origin,
    method: req.method,
    timestamp: new Date().toISOString()
  })
}
