export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    console.log('🎯 Backend: Starting background removal for:', imageUrl);

    // Check if API key is available
    if (!process.env.REMOVEBG_API_KEY) {
      console.log('⚠️ No API key found, using fallback');
      return res.status(200).json({ 
        error: 'No API key configured',
        fallback: true,
        originalUrl: imageUrl 
      });
    }

    // 1. Prepare Remove.bg API request
    const formData = new FormData();
    formData.append('image_url', imageUrl);
    formData.append('format', 'png');        // ✅ Force PNG output
    formData.append('channels', 'rgba');     // ✅ Force alpha channel
    formData.append('size', 'auto');         // Best quality

    // 2. Call Remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVEBG_API_KEY,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Remove.bg API error:', response.status, errorText);
      throw new Error(`Remove.bg API error: ${response.status} ${response.statusText}`);
    }

    // 3. Get PNG buffer from Remove.bg
    const pngBuffer = await response.arrayBuffer();

    console.log('✅ Backend: Remove.bg processing complete - PNG with transparency');

    // 4. Return PNG with correct headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', pngBuffer.byteLength);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    res.send(Buffer.from(pngBuffer));  // ✅ Pure PNG with transparency

  } catch (error) {
    console.error('❌ Backend: Background removal failed:', error);
    
    // Return error response with CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ 
      error: 'Background removal failed',
      details: error.message 
    });
  }
}
