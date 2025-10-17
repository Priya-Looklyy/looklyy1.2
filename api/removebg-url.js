export default async function handler(req, res) {
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
        'X-Api-Key': process.env.REMOVEBG_API_KEY,  // Your API key
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Remove.bg API error: ${response.status} ${response.statusText}`);
    }

    // 3. Get PNG buffer from Remove.bg
    const pngBuffer = await response.buffer();

    console.log('✅ Backend: Remove.bg processing complete - PNG with transparency');

    // 4. Return PNG with correct headers
    res.set({
      'Content-Type': 'image/png',           // ✅ PNG MIME type
      'Content-Length': pngBuffer.length,
      'Access-Control-Allow-Origin': '*',     // Allow frontend access
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    res.send(pngBuffer);  // ✅ Pure PNG with transparency

  } catch (error) {
    console.error('❌ Backend: Background removal failed:', error);
    
    // Return error response
    res.status(500).json({ 
      error: 'Background removal failed',
      details: error.message 
    });
  }
}
