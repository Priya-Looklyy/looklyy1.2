import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import InteractiveWeekLook from './InteractiveWeekLook'
import './ClosetWeekCarousel.css'

const ClosetWeekCarousel = ({ looks, onChangeLook, onLoveLook, onItemSelect, selectedItem, closetItems }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageErrors, setImageErrors] = useState([])
  const carouselRef = useRef(null)
  const touchStartTime = useRef(0)

  // Ensure we have all 7 days (duplicate if needed for circular effect)
  const displayImages = useMemo(() => {
    if (!looks || looks.length === 0) {
      console.log('⚠️ ClosetWeekCarousel: No looks provided')
      return []
    }
    
    // Use all looks, duplicate if less than 7 for smooth circular effect
    if (looks.length < 7) {
      const needed = 7 - looks.length
      const result = [...looks, ...looks.slice(0, needed)].slice(0, 7)
      console.log(`⚠️ ClosetWeekCarousel: Only ${looks.length} looks, duplicated to ${result.length}`)
      return result
    }
    
    const result = looks.slice(0, 7)
    console.log(`✅ ClosetWeekCarousel: Using ${result.length} looks`)
    return result
  }, [looks])

  // Debug: Log when looks change
  useEffect(() => {
    console.log('🖼️ ClosetWeekCarousel looks updated:', {
      inputLooks: looks?.length || 0,
      displayImages: displayImages.length,
      currentIndex,
      currentImage: displayImages[currentIndex]?.url
    })
  }, [looks, displayImages, currentIndex])

  // Circular navigation - wraps around
  const goToIndex = useCallback((newIndex) => {
    if (displayImages.length === 0) return
    let wrappedIndex = newIndex
    if (newIndex < 0) {
      wrappedIndex = displayImages.length - 1
    } else if (newIndex >= displayImages.length) {
      wrappedIndex = 0
    }
    setCurrentIndex(wrappedIndex)
    setImageLoaded(false)
  }, [displayImages.length])

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

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    const currentImage = displayImages[currentIndex]
    if (currentImage && onLoveLook) {
      onLoveLook(currentImage.day)
    }
  }

  const handlePinClick = (e) => {
    e.stopPropagation()
    const currentImage = displayImages[currentIndex]
    if (currentImage && onChangeLook) {
      onChangeLook(currentImage.day)
    }
  }

  // Calculate transform for smooth swipe
  const dragOffset = isDragging ? currentX - startX : 0
  const transform = `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`

  if (displayImages.length === 0) {
    console.log('⚠️ ClosetWeekCarousel: No display images, showing empty state')
    return (
      <div className="closet-carousel-empty">
        <p>No looks available for this week</p>
      </div>
    )
  }

  const currentImage = displayImages[currentIndex]
  
  if (!currentImage) {
    console.error('❌ ClosetWeekCarousel: Current image not found at index', currentIndex)
    return (
      <div className="closet-carousel-empty">
        <p>Error: Current image not found</p>
      </div>
    )
  }

  console.log('✅ ClosetWeekCarousel rendering:', {
    totalImages: displayImages.length,
    currentIndex,
    currentImage: currentImage.day,
    currentUrl: currentImage.url
  })

  return (
    <div 
      className="closet-week-carousel"
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="closet-carousel-track"
        style={{ 
          transform,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {displayImages.map((image, index) => {
          const isCurrent = index === currentIndex
          const isNext = index === (currentIndex + 1) % displayImages.length
          const isPrev = index === (currentIndex - 1 + displayImages.length) % displayImages.length
          const shouldPreload = isCurrent || isNext || isPrev
          
          return (
            <div 
              key={`${image.id || image.day || index}-${index}`} 
              className={`closet-carousel-slide ${isCurrent ? 'slide-current' : ''}`}
            >
              {!imageLoaded && isCurrent && (
                <div className="image-loading"></div>
              )}
              {/* Use InteractiveWeekLook component for current image */}
              {isCurrent ? (
                <InteractiveWeekLook
                  look={image}
                  onItemSelect={onItemSelect}
                  selectedItemId={selectedItem?.id}
                  onLoveLook={onLoveLook}
                  onChangeLook={onChangeLook}
                  closetItems={closetItems}
                />
              ) : (
                <img
                  src={image.url}
                  alt={image.alt || `${image.day || 'Day'} Look`}
                  onError={(e) => {
                    if (image.fallbackUrl && e.target.src !== image.fallbackUrl) {
                      e.target.src = image.fallbackUrl
                    }
                  }}
                  style={{ 
                    opacity: 0,
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  className="closet-carousel-image"
                  loading={shouldPreload ? 'eager' : 'lazy'}
                  decoding="async"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Action Buttons - Icon only, like homepage */}
      <div className="closet-carousel-actions">
        <button
          className="closet-icon-button"
          onClick={handleFavoriteClick}
          aria-label="Love this look"
        >
          <svg viewBox="0 0 24 24" className="closet-icon-svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
        <button
          className="closet-icon-button"
          onClick={handlePinClick}
          aria-label="Change this look"
        >
          <svg viewBox="0 0 24 24" className="closet-icon-svg">
            <path d="M1 4v6h6"/>
            <path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ClosetWeekCarousel

