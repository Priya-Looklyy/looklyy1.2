import React, { useState, useEffect, useMemo } from 'react'
import StylistSwipeCarousel from './StylistSwipeCarousel'
import CommunityFeed from './CommunityFeed'
import { useLook } from '../context/LookContext'
import { useAuth } from '../context/AuthContext'
import { getAllSliders } from '../data/fashionDatabase'
import { useDemoImages } from '../hooks/useDemoImages'
import trendingAPI from '../services/trendingAPI'
import './LooklyySuggests.css'

const LooklyySuggests = () => {
  const { favorites } = useLook()
  const { imageShuffleSeed } = useAuth()
  const [trendingImages, setTrendingImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('swipe') // 'swipe' or 'community'
  const [selectedLook, setSelectedLook] = useState(null)
  const { demoImages, loading: demoLoading } = useDemoImages()

  // Get favorite images from all sliders
  const favoriteImages = useMemo(() => {
    if (!favorites || favorites.length === 0) {
      return []
    }

    // This would ideally come from a stored collection of all images user has seen
    // For now, we'll need to reconstruct from available data
    // In production, this would be stored in localStorage or backend
    const storedFavoriteImages = JSON.parse(localStorage.getItem('looklyy_favorite_images') || '[]')
    return storedFavoriteImages.filter(img => favorites.includes(img.id))
  }, [favorites])

  // Load trending images (similar to HomePage)
  useEffect(() => {
    const loadTrendingData = async () => {
      setLoading(true)
      
      const isDemoMode = localStorage.getItem('looklyy_demo_mode') === 'true'
      
      if (isDemoMode) {
        if (demoLoading) return
        
        if (demoImages && demoImages.hasImages && demoImages.sliders) {
          // Flatten all slider images
          const allImages = []
          Object.values(demoImages.sliders).forEach(slider => {
            slider.images.forEach(image => {
              allImages.push({
                ...image,
                sliderId: slider.id,
                slider: slider
              })
            })
          })
          setTrendingImages(allImages.slice(0, 50)) // Get up to 50 trending images
        } else {
          const fallbackSliders = getAllSliders()
          const allImages = []
          fallbackSliders.forEach(slider => {
            slider.images.forEach(image => {
              allImages.push({
                ...image,
                sliderId: slider.id,
                slider: slider
              })
            })
          })
          setTrendingImages(allImages.slice(0, 50))
        }
        setLoading(false)
        return
      }
      
      try {
        const response = await trendingAPI.getLatestTrends({ limit: 100 })
        
        if (response && response.data && response.data.trending) {
          const images = response.data.trending
            .slice(0, 50)
            .map((item, index) => ({
              id: `trending-${index}`,
              url: item.primary_image_url || '',
              alt: item.image_alt_text || item.title || `Trending Look ${index + 1}`,
              sliderId: `trending-${index}`,
              source: 'trending'
            }))
            .filter(img => img.url && img.url.trim() !== '')
          
          setTrendingImages(images)
        } else {
          const fallbackSliders = getAllSliders()
          const allImages = []
          fallbackSliders.forEach(slider => {
            slider.images.forEach(image => {
              allImages.push({
                ...image,
                sliderId: slider.id,
                slider: slider
              })
            })
          })
          setTrendingImages(allImages.slice(0, 50))
        }
      } catch (error) {
        console.warn('Trending API failed, using fallback:', error)
        const fallbackSliders = getAllSliders()
        const allImages = []
        fallbackSliders.forEach(slider => {
          slider.images.forEach(image => {
            allImages.push({
              ...image,
              sliderId: slider.id,
              slider: slider
            })
          })
        })
        setTrendingImages(allImages.slice(0, 50))
      } finally {
        setLoading(false)
      }
    }

    loadTrendingData()
  }, [imageShuffleSeed, demoImages, demoLoading])

  if (loading) {
    return (
      <div className="stylist-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your personalized looks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="stylist-page">
      <div className="stylist-header">
        <h1 className="stylist-title">Stylist</h1>
        <p className="stylist-subtitle">Community style guidance & advice</p>
        <div className="stylist-tabs">
          <button 
            className={`stylist-tab ${activeTab === 'swipe' ? 'active' : ''}`}
            onClick={() => setActiveTab('swipe')}
          >
            Browse Looks
          </button>
          <button 
            className={`stylist-tab ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            Community Feed
          </button>
        </div>
      </div>
      
      <div className="stylist-content">
        {activeTab === 'swipe' ? (
          <StylistSwipeCarousel 
            favoriteImages={favoriteImages}
            trendingImages={trendingImages}
          />
        ) : (
          <CommunityFeed onSelectLook={setSelectedLook} />
        )}
      </div>
    </div>
  )
}

export default LooklyySuggests
