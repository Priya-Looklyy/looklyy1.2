import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockTrendingImages, mockWardrobeImages, mockTrainingImages, mockUserProfile, MockImage } from './data/mockImages'

interface DemoContextType {
  isDemoMode: boolean
  setDemoMode: (enabled: boolean) => void
  trendingImages: MockImage[]
  wardrobeImages: MockImage[]
  trainingImages: MockImage[]
  userProfile: typeof mockUserProfile
  toggleHeart: (imageId: string) => void
  submitTrainingFeedback: (imageId: string, action: 'approve' | 'reject' | 'duplicate') => void
  refreshImages: () => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export const useDemoMode = () => {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemoMode must be used within DemoProvider')
  }
  return context
}

interface DemoProviderProps {
  children: React.ReactNode
}

export const DemoProvider: React.FC<DemoProviderProps> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [trendingImages, setTrendingImages] = useState<MockImage[]>(mockTrendingImages)
  const [wardrobeImages, setWardrobeImages] = useState<MockImage[]>(mockWardrobeImages)
  const [trainingImages, setTrainingImages] = useState<MockImage[]>(mockTrainingImages)

  // Check for demo mode in localStorage or URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const demoParam = urlParams.get('demo')
    const storedDemoMode = localStorage.getItem('looklyy_demo_mode')
    
    if (demoParam === 'true' || storedDemoMode === 'true') {
      setIsDemoMode(true)
    }
  }, [])

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled)
    localStorage.setItem('looklyy_demo_mode', enabled.toString())
    
    if (enabled) {
      console.log('🎭 Demo Mode Enabled - Using static data')
    } else {
      console.log('🔴 Demo Mode Disabled - Using live data')
    }
  }

  const toggleHeart = (imageId: string) => {
    setTrendingImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, is_heart_marked: !img.is_heart_marked }
          : img
      )
    )

    // Update wardrobe
    setWardrobeImages(prev => {
      const image = trendingImages.find(img => img.id === imageId)
      if (!image) return prev

      const isInWardrobe = prev.some(img => img.id === imageId)
      
      if (isInWardrobe) {
        // Remove from wardrobe
        return prev.filter(img => img.id !== imageId)
      } else {
        // Add to wardrobe
        return [...prev, { ...image, is_heart_marked: true }]
      }
    })
  }

  const submitTrainingFeedback = (imageId: string, action: 'approve' | 'reject' | 'duplicate') => {
    console.log(`🎯 Demo Training Feedback: ${action} for image ${imageId}`)
    
    setTrainingImages(prev => 
      prev.filter(img => img.id !== imageId)
    )

    // In demo mode, we simulate the feedback being recorded
    setTimeout(() => {
      console.log(`✅ Demo feedback recorded for image ${imageId}`)
    }, 500)
  }

  const refreshImages = () => {
    console.log('🔄 Refreshing demo images...')
    
    // Simulate a refresh by shuffling images
    setTrendingImages([...mockTrendingImages].sort(() => Math.random() - 0.5))
    setTrainingImages([...mockTrainingImages].sort(() => Math.random() - 0.5))
    
    setTimeout(() => {
      console.log('✅ Demo images refreshed')
    }, 1000)
  }

  const value: DemoContextType = {
    isDemoMode,
    setDemoMode,
    trendingImages,
    wardrobeImages,
    trainingImages,
    userProfile: mockUserProfile,
    toggleHeart,
    submitTrainingFeedback,
    refreshImages
  }

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}
