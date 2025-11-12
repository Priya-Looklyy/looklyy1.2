import React, { useState, useEffect } from 'react'
import { useLook } from '../context/LookContext'
import './ImageSlider.css'

const ImageSlider = ({ slider, onPinLook, metricsPerImage }) => {
  const { toggleFavorite, togglePin, isFavorited, isPinned } = useLook()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  
  // Get metrics for current image
  const currentMetrics = metricsPerImage?.[currentImageIndex] || { likes: '2.4k', saves: '892', shopped: '156' }

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || !slider.images.length) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % slider.images.length
      )
      setImageLoaded(false) // Reset loading state for new image
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slider.images.length])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    toggleFavorite(slider.id)
  }

  const handlePinClick = (e) => {
    e.stopPropagation()
    const currentImage = slider.images[currentImageIndex]
    onPinLook(slider, currentImage)
  }

  const handleSliderClick = () => {
    console.log('Slider Details:', slider)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
    setImageLoaded(false)
  }

  const currentImage = slider.images[currentImageIndex]

  return (
    <div 
      className="image-slider" 
      onClick={handleSliderClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="slider-image-container">
        {!imageLoaded && <div className="image-loading"></div>}
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          onLoad={handleImageLoad}
          style={{ opacity: imageLoaded ? 1 : 0 }}
          className="slider-image"
        />
        
        {/* Bottom Overlay with Metrics */}
        <div className="bottom-overlay">
          <div className="metrics-container">
            <div className="metrics-left">
              <div className="metric-item">
                <svg viewBox="0 0 24 24" className="metric-icon">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="metric-number">{currentMetrics.likes}</span>
                <span className="metric-label">saved</span>
              </div>
              <div className="metric-item">
                <svg viewBox="0 0 24 24" className="metric-icon">
                  <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z"/>
                </svg>
                <span className="metric-number">{currentMetrics.saves}</span>
                <span className="metric-label">enriched using Mini Lessons</span>
              </div>
              <div className="metric-item">
                <svg viewBox="0 0 24 24" className="metric-icon">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span className="metric-number">{currentMetrics.shopped}</span>
                <span className="metric-label">shopped using Looklyy</span>
              </div>
            </div>
            <div className="metric-why">
              <span className="why-label">Why this look works</span>
            </div>
          </div>
        </div>

        {/* Slider Overlay */}
        <div className="slider-overlay">
          <div className="slider-actions">
            <div 
              className="icon-container"
              onClick={handleFavoriteClick}
              aria-label={isFavorited(slider.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg viewBox="0 0 24 24" className={`heart-icon ${isFavorited(slider.id) ? 'icon-filled' : 'icon-outline'}`}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div 
              className="icon-container"
              onClick={handlePinClick}
              aria-label={isPinned(slider.id) ? 'Unpin look' : 'Pin look'}
            >
              <svg viewBox="0 0 24 24" className={`bookmark-icon ${isPinned(slider.id) ? 'icon-filled' : 'icon-outline'}`}>
                <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default ImageSlider
