import React, { useState, useEffect, useMemo } from 'react'
import CircularSwipeCarousel from './CircularSwipeCarousel'
import NotificationCenter from './NotificationCenter'
import SlidingCanvas from './SlidingCanvas'
import { getAllSliders } from '../data/fashionDatabase'
import { useDemoImages } from '../hooks/useDemoImages'
import trendingAPI from '../services/trendingAPI'
import { useLook } from '../context/LookContext'
import { useAuth } from '../context/AuthContext'
import './HomePage.css'

const HomePage = () => {
  const [pinnedLook, setPinnedLook] = useState(null)
  const [isFrame2Active, setIsFrame2Active] = useState(false)
  const [sliderData, setSliderData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { favorites } = useLook()
  const { imageShuffleSeed } = useAuth()
  
  // Load demo images from folder
  const { demoImages, loading: demoLoading, error: demoError } = useDemoImages()
  
  // Convert trending API data to HomePage slider format - simplified
  const transformTrendingDataToSliders = (trendingData, shuffleSeed = 0) => {
    if (!trendingData || !trendingData.trending) {
      console.log('No trending data')
      return []
    }

    const { trending, categories } = trendingData
    const sliders = []
    
    // Create 5 sliders from categories
    const categoryGroups = [
      { key: 'celebrity-style', name: 'Celebrity Style', description: 'Red carpet and celebrity fashion' },
      { key: 'street-style', name: 'Street Style', description: 'Urban fashion captured on the streets' },
      { key: 'runway', name: 'Runway', description: 'Latest from fashion weeks' },
      { key: 'designers', name: 'Designers', description: 'Luxury and emerging designers' },
      { key: 'trends', name: 'Trends', description: 'What\'s trending now' }
    ]

    categoryGroups.forEach((categoryGroup, index) => {
      let categoryImages = categories[categoryGroup.key] || []
      console.log(`${categoryGroup.name}: ${categoryImages.length} images`)
      
      // APPLY SHUFFLING to each category's images based on shuffleSeed
      const shufflingFactor = Math.floor(shuffleSeed * 100) % 100
      categoryImages = categoryImages
        .map((item, imgIndex) => ({ 
          item, 
          sortKey: (imgIndex + shufflingFactor + index * 10) * Math.random() 
        }))
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(vo => vo.item)
      
      // Get images for this slider (minimum 5, maximum 8)
      const sliderImages = categoryImages.slice(0, 8)
        .map((item, imgIndex) => ({
          id: `${categoryGroup.key}-${imgIndex}`,
          url: item.primary_image_url || '', // Use API raw format
          alt: item.image_alt_text || item.title || `${categoryGroup.name} Look ${imgIndex + 1}`
        }))
        .filter(img => img.url && img.url.trim() !== '') // Filter out empty images

      // If we have enough images, create the slider
      if (sliderImages.length >= 3) {
        console.log(`Created slider for ${categoryGroup.name} with ${sliderImages.length} images`)
        sliders.push({
          id: categoryGroup.key,
          title: categoryGroup.name,
          description: categoryGroup.description,
          tag: categoryGroup.name,
          images: sliderImages
        })
      }
    })
    
    // Fallback: If we don't have enough category-based sliders, use the trending data
    if (sliders.length < 3 && trending && trending.length > 0) {
      console.log('Using trending fallback', trending.length)
      // Split trending data into chunks for remaining sliders
      const remainingSlidersNeeded = 5 - sliders.length
      const chunksPerSlider = Math.ceil(trending.length / remainingSlidersNeeded)
      
      for (let i = 0; i < remainingSlidersNeeded; i++) {
        const startIndex = i * chunksPerSlider
        const endIndex = startIndex + chunksPerSlider
        const chunk = trending.slice(startIndex, endIndex)
        
        if (chunk.length > 0) {
          const sliderImages = chunk
            .map((item, imgIndex) => ({
              id: `trending-${i}-${imgIndex}`,
              url: item.primary_image_url || '',
              alt: item.image_alt_text || item.title || `Trending Look ${imgIndex + 1}`
            }))
            .filter(img => img.url && img.url.trim() !== '') // Filter out empty images
          
          if (sliderImages.length >= 3) {
            sliders.push({
              id: `trending-${i}`,
              title: `Trending ${i + 1}`,
              description: 'The latest trending looks',
              tag: 'Trending',
              images: sliderImages
            })
          }
        }
      }
    }

    console.log('Final HomePage sliders:', sliders.length)
    
    // Also shuffle all sliders themselves when shuffling multiple times
    const shufflingFactor = Math.floor(shuffleSeed * 100) % 100
    const shuffledSliders = sliders
      .map((slider, index) => ({ slider, sortKey: (index + shufflingFactor) * Math.random() }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(vo => vo.slider)

    return shuffledSliders
  }

  // Load trending data and transform to slider format
  useEffect(() => {
    const loadTrendingData = async () => {
      setLoading(true)
      setError(null)
      
      // Check if we're in demo mode
      const isDemoMode = localStorage.getItem('looklyy_demo_mode') === 'true'
      
      if (isDemoMode) {
        console.log('🎭 Demo mode detected - checking for folder-based images')
        
        // Wait for demo images to load
        if (demoLoading) {
          console.log('⏳ Waiting for demo images to load...')
          return
        }
        
        if (demoImages && demoImages.hasImages && demoImages.sliders) {
          console.log('📁 Using folder-based demo images:', demoImages.totalImages, 'images')
          // Convert folder-based images to slider format
          const folderSliders = Object.values(demoImages.sliders)
          setSliderData(folderSliders)
        } else {
          console.log('📁 No folder images found - using static mock data')
          // Fallback to static mock data
          const fallbackSliders = getAllSliders()
          setSliderData(fallbackSliders)
        }
        
        setLoading(false)
        return
      }
      
      try {
        console.log('🔄 Loading trending data for homepage...')
        const response = await trendingAPI.getLatestTrends({ limit: 100 })
        console.log('📊 Trending API Response for Homepage:', response)
        
        if (response && response.data && response.data.trending && response.data.categories) {
          const transformedSliders = transformTrendingDataToSliders(response.data, imageShuffleSeed)
          console.log('✅ Transformed sliders:', transformedSliders)
          
          if (transformedSliders.length > 0) {
            setSliderData(transformedSliders)
          } else {
            console.warn('No valid slider data created from trending API - using fallback')
            const fallbackSliders = getAllSliders()
            setSliderData(fallbackSliders)
          }
        } else {
          console.warn('Invalid API response format - using fallback')
          const fallbackSliders = getAllSliders()
          setSliderData(fallbackSliders)
        }
      } catch (apiError) {
        console.warn('Trending API failed for homepage, falling back to dummy data:', apiError)
        // Fallback to dummy data
        const fallbackSliders = getAllSliders()
        setSliderData(fallbackSliders)
      } finally {
        setLoading(false)
      }
    }

    loadTrendingData()
  }, [imageShuffleSeed, demoImages, demoLoading]) // Include demo images dependencies
  
  // Flatten all images from all sliders into a single array of 25 images
  const carouselImages = useMemo(() => {
    if (!sliderData || sliderData.length === 0) return []
    
    // Flatten all images from all sliders
    const allImages = []
    sliderData.forEach(slider => {
      slider.images.forEach(image => {
        allImages.push({
          ...image,
          sliderId: slider.id,
          slider: slider // Keep reference to slider for pinning
        })
      })
    })
    
    // Limit to exactly 25 images
    return allImages.slice(0, 25)
  }, [sliderData])

  const handlePinLook = (slider, currentImage) => {
    setPinnedLook({
      slider,
      currentImage
    })
    setIsFrame2Active(true)
  }

  const closeFrame2 = () => {
    setIsFrame2Active(false)
    setPinnedLook(null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading trending looks...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="home-page">
        <div className="error-container">
          <h2>Unable to load trending looks</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`home-page ${isFrame2Active ? 'frame2-active' : ''}`}>
      <div className={`home-content ${isFrame2Active ? 'frame2-layout' : ''}`}>
        {isFrame2Active ? (
          // Frame 2: Show pinned look on far left (same size as original slider)
          <>
            <div className="pinned-look-display">
              <div className="pinned-slider">
                <img 
                  src={pinnedLook.currentImage.url} 
                  alt={pinnedLook.currentImage.alt}
                  className="pinned-image"
                />
                <div className="pinned-overlay">
                  <div className="pinned-actions">
                    <div
                      className="icon-container"
                      onClick={closeFrame2}
                      aria-label="Unpin look"
                    >
                      <svg viewBox="0 0 24 24" className="bookmark-icon icon-filled">
                        <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <SlidingCanvas 
              pinnedLook={pinnedLook}
              onClose={closeFrame2}
            />
          </>
        ) : (
          // Frame 1: Circular swipe carousel with 25 images (no vertical scroll)
          <CircularSwipeCarousel 
            images={carouselImages}
            onPinLook={handlePinLook}
          />
        )}
      </div>
      
      <NotificationCenter />
    </div>
  )
}

export default HomePage
