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
              <i className={`${isFavorited(slider.id) ? 'fas' : 'far'} fa-heart`}></i>
            </button>
            <button
              className={`action-btn pin-btn ${isPinned(slider.id) ? 'active' : ''}`}
              onClick={handlePinClick}
              aria-label={isPinned(slider.id) ? 'Unpin look' : 'Pin look'}
            >
              <i className="fas fa-thumbtack"></i>
            </button>
          </div>
        </div>


      </div>
    </div>
  )
}

export default ImageSlider
