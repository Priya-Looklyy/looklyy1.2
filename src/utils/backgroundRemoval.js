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
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        size: 'auto'
      }),
    })
    
    if (response.ok) {
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    } else {
      throw new Error('Background removal failed')
    }
  } catch (error) {
    console.error('Background removal error:', error)
    return imageUrl // Return original if fails
  }
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
