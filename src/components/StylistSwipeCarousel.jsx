import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useLook } from '../context/LookContext'
import CommunityShare from './CommunityShare'
import './StylistSwipeCarousel.css'

const StylistSwipeCarousel = ({ favoriteImages = [], trendingImages = [] }) => {
  const { isFavorited } = useLook()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [showCommunityShare, setShowCommunityShare] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageErrors, setImageErrors] = useState([])
  const carouselRef = useRef(null)
  const touchStartTime = useRef(0)

  // Combine favorites and trending images, marking favorites
  // Add styling guide indicator for select images (every 3rd image)
  const combinedImages = useMemo(() => {
    const allImages = []
    
    // Add favorite images first (marked as favorites)
    favoriteImages.forEach((img, index) => {
      allImages.push({
        ...img,
        isFavorite: true,
        source: 'favorites',
        hasStylingGuide: index % 3 === 0 // Every 3rd favorite has styling guide
      })
    })
    
    // Add trending images (not favorites)
    trendingImages.forEach((img, index) => {
      allImages.push({
        ...img,
        isFavorite: false,
        source: 'trending',
        hasStylingGuide: (favoriteImages.length + index) % 4 === 0 // Every 4th trending has styling guide
      })
    })
    
    // If no images, return empty array
    if (allImages.length === 0) {
      return []
    }
    
    // Ensure at least some images have styling guides
    if (allImages.length > 0 && !allImages.some(img => img.hasStylingGuide)) {
      allImages[0].hasStylingGuide = true
    }
    
    return allImages
  }, [favoriteImages, trendingImages])

  // Circular navigation - wraps around
  const goToIndex = useCallback((newIndex) => {
    if (combinedImages.length === 0) return
    let wrappedIndex = newIndex
    if (newIndex < 0) {
      wrappedIndex = combinedImages.length - 1
    } else if (newIndex >= combinedImages.length) {
      wrappedIndex = 0
    }
    setCurrentIndex(wrappedIndex)
    setImageLoaded(false)
  }, [combinedImages.length])

  // Reset image loaded when index changes
  useEffect(() => {
    setImageLoaded(false)
  }, [currentIndex])

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setCurrentX(e.touches[0].clientX)
    touchStartTime.current = Date.now()
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const deltaX = startX - currentX
    const deltaTime = Date.now() - touchStartTime.current
    const swipeThreshold = 50
    const quickSwipeThreshold = 30
    
    if (Math.abs(deltaX) > swipeThreshold || (Math.abs(deltaX) > quickSwipeThreshold && deltaTime < 300)) {
      if (deltaX > 0) {
        goToIndex(currentIndex + 1)
      } else {
        goToIndex(currentIndex - 1)
      }
    }
    
    setIsDragging(false)
    setStartX(0)
    setCurrentX(0)
  }

  // Mouse handlers for desktop drag
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setCurrentX(e.clientX)
    touchStartTime.current = Date.now()
  }, [])

  // Cleanup mouse events
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      e.preventDefault()
      setCurrentX(e.clientX)
    }

    const handleMouseUp = () => {
      const deltaX = startX - currentX
      const deltaTime = Date.now() - touchStartTime.current
      const swipeThreshold = 50
      
      if (Math.abs(deltaX) > swipeThreshold || (Math.abs(deltaX) > 30 && deltaTime < 300)) {
        if (deltaX > 0) {
          goToIndex(currentIndex + 1)
        } else {
          goToIndex(currentIndex - 1)
        }
      }
      
      setIsDragging(false)
      setStartX(0)
      setCurrentX(0)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, startX, currentX, currentIndex, goToIndex])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleShareClick = (e) => {
    e.stopPropagation()
    setShowCommunityShare(true)
  }

  const handleCloseShare = () => {
    setShowCommunityShare(false)
  }

  const handleShareSuccess = (shareData) => {
    console.log('Shared with community:', shareData)
    // Could show a notification here
  }

  // Calculate transform for smooth swipe
  const dragOffset = isDragging ? currentX - startX : 0
  const transform = `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`

  if (combinedImages.length === 0) {
    return (
      <div className="stylist-carousel-empty">
        <div className="empty-state">
          <svg viewBox="0 0 24 24" className="empty-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3>No looks available</h3>
          <p>Start liking looks on the homepage to see them here</p>
        </div>
      </div>
    )
  }

  const currentImage = combinedImages[currentIndex]
  const isCurrent = true // Only show current image

  return (
    <div 
      className="stylist-carousel"
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="stylist-carousel-track"
        style={{ 
          transform,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {combinedImages.map((image, index) => {
          const isCurrentSlide = index === currentIndex
          
          return (
            <div 
              key={`${image.id || image.url}-${index}`} 
              className={`stylist-carousel-slide ${isCurrentSlide ? 'slide-current' : ''}`}
              style={{
                display: isCurrentSlide ? 'flex' : 'none',
                transform: `translateX(${(index - currentIndex) * 100}%)`,
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {!imageLoaded && isCurrentSlide && (
                <div className="image-loading"></div>
              )}
              <img
                src={image.url}
                alt={image.alt || `Stylist look ${index + 1}`}
                onLoad={() => {
                  if (isCurrentSlide) {
                    handleImageLoad()
                  }
                }}
                onError={(e) => {
                  console.error('❌ Image failed to load:', image.url)
                  setImageErrors(prev => [...prev, image.url])
                  e.target.style.opacity = '0.5'
                  e.target.style.filter = 'grayscale(100%)'
                }}
                style={{ 
                  opacity: isCurrentSlide 
                    ? (imageErrors.includes(image.url) ? 0.5 : 1)
                    : 0,
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  imageRendering: 'crisp-edges',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
                className="stylist-carousel-image"
                loading={isCurrentSlide ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="stylist-actions">
        {currentImage.isFavorite && (
          <div className="stylist-badge favorite-badge">
            <svg viewBox="0 0 24 24" className="badge-icon">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Your Favorite</span>
          </div>
        )}
        <button 
          className="stylist-action-btn share-btn"
          onClick={handleShareClick}
          aria-label="Share with community"
        >
          <svg viewBox="0 0 24 24" className="action-icon">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
          <span>Share</span>
        </button>
        <button 
          className="stylist-action-btn advice-btn"
          onClick={handleShareClick}
          aria-label="Get style advice"
        >
          <svg viewBox="0 0 24 24" className="action-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>Get Advice</span>
        </button>
      </div>

      {/* Community Share Modal */}
      <CommunityShare 
        look={currentImage}
        onShare={handleShareSuccess}
        onClose={handleCloseShare}
      />
    </div>
  )
}

export default StylistSwipeCarousel

