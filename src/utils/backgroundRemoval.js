// Background Removal API Integration
// This can be integrated with remove.bg, Photoshop API, or similar services

const API_KEY = process.env.REACT_APP_REMOVEBG_API_KEY || 'your-api-key-here'

export const removeBackground = async (imageFile) => {
  try {
    // Option 1: Remove.bg API
    const formData = new FormData()
    formData.append('image_file', imageFile)
    formData.append('size', 'auto')
    
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
      },
      body: formData,
    })
    
    if (response.ok) {
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    } else {
      throw new Error('Background removal failed')
    }
  } catch (error) {
    console.error('Background removal error:', error)
    // Fallback: return original image
    return URL.createObjectURL(imageFile)
  }
}

export const removeBackgroundFromUrl = async (imageUrl) => {
  try {
    console.log('🚀 Sending image to Remove.bg API:', imageUrl);

    // Use our backend API endpoint for better handling
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
    const response = await fetch(`${API_BASE_URL}/api/removebg-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    // Get PNG blob from response
    const pngBlob = await response.blob();
    
    // Verify it's actually a PNG
    if (pngBlob.type !== 'image/png') {
      console.warn('⚠️ Response is not PNG:', pngBlob.type);
    }

    // Convert to data URL for immediate use
    const dataUrl = await blobToDataUrl(pngBlob);
    
    console.log('✅ Background removal successful, PNG size:', pngBlob.size);
    return dataUrl;

  } catch (error) {
    console.error('❌ Remove.bg API error:', error);
    // Fallback: return original if fails
    return imageUrl;
  }
}

/**
 * Convert Blob to Data URL
 */
const blobToDataUrl = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // Verify it's a PNG data URL
      if (!result.startsWith('data:image/png')) {
        console.warn('⚠️ Data URL is not PNG:', result.substring(0, 50));
      }
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Alternative: Client-side background removal using AI models
export const removeBackgroundClientSide = async (imageFile) => {
  // This could integrate with TensorFlow.js models like BodyPix or MediaPipe
  // For now, returning original image
  console.log('Client-side background removal would process:', imageFile.name)
  return URL.createObjectURL(imageFile)
}

// Utility function to detect if image needs background removal
export const needsBackgroundRemoval = (imageUrl) => {
  // Simple heuristic - in real app, this could use AI to detect backgrounds
  return true // For demo, assume all images can benefit from background removal
}

export default {
  removeBackground,
  removeBackgroundFromUrl,
  removeBackgroundClientSide,
  needsBackgroundRemoval
}
