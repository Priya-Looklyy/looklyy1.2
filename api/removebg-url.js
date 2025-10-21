import { Buffer } from 'buffer';

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

    // 1. Prepare URLSearchParams with CRITICAL parameters for better accuracy
    const formData = new URLSearchParams();
    formData.append('image_url', imageUrl);
    
    // ✅ CRITICAL PARAMETERS FOR BETTER ACCURACY (same as working project)
    formData.append('format', 'png');
    formData.append('channels', 'rgba');
    formData.append('size', 'auto');

    console.log('🚀 Calling Remove.bg API with enhanced parameters...');

    // 2. Call Remove.bg API with proper headers
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVEBG_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    // Handle API errors with detailed logging (like working project)
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Remove.bg API error:', response.status, errorText);
      
      let errorMessage = 'Background removal failed';
      if (response.status === 402) {
        errorMessage = 'Remove.bg API quota exceeded';
      } else if (response.status === 403) {
        errorMessage = 'Invalid Remove.bg API key';
      } else if (response.status === 400) {
        errorMessage = 'Invalid image format or size';
      }

      return res.status(response.status).json({
        error: errorMessage,
        details: errorText
      });
    }

    // 3. Get PNG buffer from Remove.bg
    const pngBuffer = await response.arrayBuffer();
    console.log(`✅ Remove.bg success: ${pngBuffer.byteLength} bytes PNG received`);

    // 4. Return PNG with correct headers (like working project)
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': pngBuffer.byteLength,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    });
    
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
