import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useLook } from '../context/LookContext'
import './CircularSwipeCarousel.css'

const CircularSwipeCarousel = ({ images, onPinLook }) => {
  const { toggleFavorite, isFavorited } = useLook()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageErrors, setImageErrors] = useState([])
  const carouselRef = useRef(null)
  const touchStartTime = useRef(0)
  
  // Ensure we have exactly 25 images (duplicate if needed for circular effect)
  const displayImages = useMemo(() => {
    if (images.length === 0) {
      console.log('⚠️ CircularSwipeCarousel: No images provided')
      return []
    }
    
    // If we have 25 or more, take first 25
    if (images.length >= 25) {
      const result = images.slice(0, 25)
      console.log(`✅ CircularSwipeCarousel: Using ${result.length} images`)
      return result
    }
    
    // If we have less than 25, duplicate to reach 25
    const needed = 25 - images.length
    const duplicated = [...images, ...images.slice(0, needed)]
    const result = duplicated.slice(0, 25)
    console.log(`⚠️ CircularSwipeCarousel: Only ${images.length} images, duplicated to ${result.length}`)
    return result
  }, [images])
  
  // Debug: Log when images change
  useEffect(() => {
    console.log('🖼️ CircularSwipeCarousel images updated:', {
      inputImages: images.length,
      displayImages: displayImages.length,
      currentIndex,
      currentImage: displayImages[currentIndex]?.url
    })
  }, [images, displayImages, currentIndex])

  // Circular navigation - wraps around
  const goToIndex = useCallback((newIndex) => {
    if (displayImages.length === 0) return
    // Handle circular wrapping
    let wrappedIndex = newIndex
    if (newIndex < 0) {
      wrappedIndex = displayImages.length - 1
    } else if (newIndex >= displayImages.length) {
      wrappedIndex = 0
    }
    setCurrentIndex(wrappedIndex)
    // Reset image loaded state for new image
    setImageLoaded(false)
  }, [displayImages.length])
  
  // Reset image loaded when index changes and preload next/prev
  useEffect(() => {
    setImageLoaded(false)
    // Preload next and previous images for crisp display
    const nextIndex = (currentIndex + 1) % displayImages.length
    const prevIndex = (currentIndex - 1 + displayImages.length) % displayImages.length
    
    if (displayImages[nextIndex]) {
      const nextImg = new Image()
      nextImg.src = displayImages[nextIndex].url
    }
    if (displayImages[prevIndex]) {
      const prevImg = new Image()
      prevImg.src = displayImages[prevIndex].url
    }
  }, [currentIndex, displayImages])

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
    const swipeThreshold = 50 // Minimum distance for swipe
    const quickSwipeThreshold = 30 // For quick swipes
    
    // Determine swipe direction
    if (Math.abs(deltaX) > swipeThreshold || (Math.abs(deltaX) > quickSwipeThreshold && deltaTime < 300)) {
      if (deltaX > 0) {
        // Swipe left - next image
        goToIndex(currentIndex + 1)
      } else {
        // Swipe right - previous image
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
    if (currentImage.sliderId) {
      toggleFavorite(currentImage.sliderId)
    }
  }

  const handlePinClick = (e) => {
    e.stopPropagation()
    const currentImage = displayImages[currentIndex]
    if (onPinLook && currentImage.slider) {
      onPinLook(currentImage.slider, currentImage)
    }
  }

  // Calculate transform for smooth swipe
  // Full-width layout: each slide takes 100% width
  const dragOffset = isDragging ? currentX - startX : 0
  const transform = `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`

  // Debug: Log when component renders
  useEffect(() => {
    console.log('🔄 CircularSwipeCarousel render:', {
      imagesProp: images.length,
      displayImages: displayImages.length,
      currentIndex,
      currentImageUrl: displayImages[currentIndex]?.url
    })
  }, [images, displayImages, currentIndex])

  if (displayImages.length === 0) {
    console.warn('⚠️ CircularSwipeCarousel: No images to display', {
      imagesProp: images,
      displayImages
    })
    return (
      <div className="circular-carousel-empty">
        <p>No images available</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#9ca3af' }}>
          Received {images.length} images
        </p>
      </div>
    )
  }

  const currentImage = displayImages[currentIndex]
  
  if (!currentImage) {
    console.error('❌ Current image is undefined:', { currentIndex, displayImages })
    return (
      <div className="circular-carousel-empty">
        <p>Error: Current image not found</p>
      </div>
    )
  }

  return (
    <div 
      className="circular-carousel"
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="carousel-track"
        style={{ 
          transform,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {displayImages.map((image, index) => {
          const isCurrent = index === currentIndex
          const isNext = index === (currentIndex + 1) % displayImages.length
          const isPrev = index === (currentIndex - 1 + displayImages.length) % displayImages.length
          // Preload current, next, and previous images for crisp display
          const shouldPreload = isCurrent || isNext || isPrev
          
          return (
            <div 
              key={`${image.id || image.url}-${index}`} 
              className="carousel-slide"
            >
              {!imageLoaded && isCurrent && (
                <div className="image-loading"></div>
              )}
              <img
                src={image.url}
                alt={image.alt || `Fashion look ${index + 1}`}
                onLoad={() => {
                  if (isCurrent) {
                    console.log('✅ Image loaded:', image.url)
                    handleImageLoad()
                  }
                }}
                onError={(e) => {
                  console.error('❌ Image failed to load:', {
                    url: image.url,
                    index,
                    isCurrent,
                    image
                  })
                  setImageErrors(prev => [...prev, image.url])
                  // Keep image visible but show error state
                  e.target.style.opacity = '0.5'
                  e.target.style.filter = 'grayscale(100%)'
                }}
                style={{ 
                  opacity: isCurrent 
                    ? (imageErrors.includes(image.url) ? 0.5 : 1)
                    : 0,
                  display: isCurrent ? 'block' : 'none',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  imageRendering: 'crisp-edges', // Better image quality
                  WebkitImageRendering: '-webkit-optimize-contrast' // Safari optimization
                }}
                className="carousel-image"
                loading={shouldPreload ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          )
        })}
      </div>

      {/* Action Buttons - Positioned directly, no overlay */}
      <div className="carousel-actions">
        <button
          className="icon-button"
          onClick={handleFavoriteClick}
          aria-label={isFavorited(currentImage?.sliderId) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg viewBox="0 0 24 24" className={`heart-icon ${isFavorited(currentImage?.sliderId) ? 'icon-filled' : 'icon-outline'}`}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
        <button
          className="icon-button"
          onClick={handlePinClick}
          aria-label="Pin look"
        >
          <svg viewBox="0 0 24 24" className="bookmark-icon icon-outline">
            <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </button>
      </div>

    </div>
  )
}

export default CircularSwipeCarousel

