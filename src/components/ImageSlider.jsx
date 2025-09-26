import React, { useState, useEffect } from 'react'
import { useLook } from '../context/LookContext'
import './ImageSlider.css'

const ImageSlider = ({ slider, onPinLook }) => {
  const { toggleFavorite, togglePin, isFavorited, isPinned, showNotification } = useLook()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!isAutoPlaying || !slider.images.length) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % slider.images.length
      )
      setImageLoaded(false) // Reset loading state for new image
    }, 3000)

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
    showNotification(`Opening details for: ${slider.title}`)
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
        
        {/* Slider Overlay */}
        <div className="slider-overlay">
          <div className="slider-actions">
            <button
              className={`action-btn heart-btn ${isFavorited(slider.id) ? 'active' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorited(slider.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg viewBox="0 0 24 24" className="heart-icon" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <button
              className={`action-btn pin-btn ${isPinned(slider.id) ? 'active' : ''}`}
              onClick={handlePinClick}
              aria-label={isPinned(slider.id) ? 'Unpin look' : 'Pin look'}
            >
              <svg viewBox="0 0 24 24" className="pin-icon" fill="currentColor">
                <path d="M12 2c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </button>
          </div>
        </div>


      </div>
    </div>
  )
}

export default ImageSlider
