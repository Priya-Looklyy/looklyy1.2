import { useState, useEffect } from 'react'

// Hook to load demo images from the public/demo-images folder
export const useDemoImages = () => {
  const [demoImages, setDemoImages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDemoImages = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('📁 Loading demo images from folder...')
        
        const response = await fetch('/api/demo-images/list')
        
        if (!response.ok) {
          throw new Error(`Failed to load demo images: ${response.status}`)
        }

        const data = await response.json()
        console.log('📸 Demo images API response:', data)

        if (data.success && data.hasImages) {
          setDemoImages(data)
          console.log(`✅ Loaded ${data.totalImages} demo images from folder`)
        } else {
          console.log('📁 No demo images found in folder - will use static data')
          setDemoImages(null)
        }

      } catch (err) {
        console.error('❌ Error loading demo images:', err)
        setError(err.message)
        setDemoImages(null)
      } finally {
        setLoading(false)
      }
    }

    loadDemoImages()
  }, [])

  return { demoImages, loading, error, refetch: () => loadDemoImages() }
}
