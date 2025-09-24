// Simple test endpoint to check environment variables
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE
  
  res.status(200).json({
    success: true,
    supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
    supabaseServiceRole: supabaseServiceRole ? 'SET' : 'NOT SET',
    supabaseUrlValue: supabaseUrl,
    timestamp: new Date().toISOString()
  })
}
