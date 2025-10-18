export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Test if API key is available
    const hasApiKey = !!process.env.REMOVEBG_API_KEY;
    
    return res.status(200).json({
      status: 'API endpoint working - Updated',
      hasApiKey: hasApiKey,
      apiKeyLength: hasApiKey ? process.env.REMOVEBG_API_KEY.length : 0,
      timestamp: new Date().toISOString(),
      envVars: Object.keys(process.env).filter(key => key.includes('REMOVE'))
    });

  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return res.status(500).json({ 
      error: 'Test failed',
      details: error.message 
    });
  }
}
