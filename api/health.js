// Health check endpoint for Harper's Bazaar crawler
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  res.status(200).json({
    status: 'healthy',
    service: 'harpers_bazaar_crawler',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      trending: '/api/trends/latest',
      featured: '/api/trends/featured',
      health: '/api/health'
    }
  })
}