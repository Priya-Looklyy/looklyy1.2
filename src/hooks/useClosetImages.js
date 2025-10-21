import { useState, useEffect } from 'react'

// Hook to load closet images from the public/closet-images subfolders
export const useClosetImages = () => {
  const [closetImages, setClosetImages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadClosetImages = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('👗 Loading closet images from subfolders...')
        
        const response = await fetch('/api/closet-images/list')
        
        if (!response.ok) {
          throw new Error(`Failed to load closet images: ${response.status}`)
        }

        const data = await response.json()
        console.log('👗 Closet images API response:', data)

        if (data.success && data.hasImages) {
          setClosetImages(data.items)
          console.log(`✅ Loaded ${data.totalItems} closet items from ${data.totalFolders} look folders`)
        } else {
          console.log('📁 No closet images found in subfolders - will use static data')
          setClosetImages([])
        }

      } catch (err) {
        console.error('❌ Error loading closet images:', err)
        setError(err.message)
        setClosetImages([])
      } finally {
        setLoading(false)
      }
    }

    loadClosetImages()
  }, [])

  return { closetImages, loading, error, refetch: () => loadClosetImages() }
}
