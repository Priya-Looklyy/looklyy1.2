import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useLook } from '../context/LookContext'
import './CircularSwipeCarousel.css'

const CircularSwipeCarousel = ({ images }) => {
  const { toggleFavorite, isFavorited } = useLook()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageErrors, setImageErrors] = useState([])
  const [displayedImage, setDisplayedImage] = useState(null) // null, 'bookmark', or 'image-click'
  const [showCanvas, setShowCanvas] = useState(false) // Canvas overlay state
  const [canvasSwipeStartY, setCanvasSwipeStartY] = useState(0)
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
    // Don't handle carousel swipes when canvas is active or when displayedImage is shown
    if (showCanvas || displayedImage) return
    
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setCurrentX(e.touches[0].clientX)
    touchStartTime.current = Date.now()
  }

  const handleTouchMove = (e) => {
    if (!isDragging || showCanvas || displayedImage) return
    e.preventDefault()
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    // Handle canvas swipe down
    if (showCanvas && canvasSwipeStartY > 0) {
      const endY = e.changedTouches ? e.changedTouches[0].clientY : 0
      const deltaY = endY - canvasSwipeStartY
      if (deltaY > 100) { // Swipe down threshold
        setShowCanvas(false)
        setDisplayedImage(null)
      }
      setCanvasSwipeStartY(0)
      return
    }

    // Don't handle carousel swipes when canvas is active or when displayedImage is shown
    if (showCanvas || displayedImage) return

    if (!isDragging) {
      // If not dragging, treat as tap/click
      const deltaTime = Date.now() - touchStartTime.current
      if (deltaTime < 300) { // Quick tap
        handleImageClick(e)
      }
      return
    }
    
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

  const handleCanvasTouchStart = (e) => {
    if (showCanvas) {
      e.stopPropagation()
      setCanvasSwipeStartY(e.touches[0].clientY)
    }
  }

  const handleCanvasTouchEnd = (e) => {
    if (showCanvas && canvasSwipeStartY > 0) {
      e.stopPropagation()
      const endY = e.changedTouches ? e.changedTouches[0].clientY : 0
      const deltaY = endY - canvasSwipeStartY
      if (deltaY > 100) { // Swipe down threshold
        setShowCanvas(false)
        setDisplayedImage(null)
      }
      setCanvasSwipeStartY(0)
    }
  }

  // Mouse handlers for desktop drag
  const handleMouseDown = useCallback((e) => {
    // Don't handle carousel drags when canvas is active or when displayedImage is shown
    if (showCanvas || displayedImage) return
    
    setIsDragging(true)
    setStartX(e.clientX)
    setCurrentX(e.clientX)
    touchStartTime.current = Date.now()
  }, [showCanvas, displayedImage])

  // Cleanup mouse events
  useEffect(() => {
    if (!isDragging || showCanvas || displayedImage) return

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
  }, [isDragging, startX, currentX, currentIndex, goToIndex, showCanvas, displayedImage])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    const currentImage = displayImages[currentIndex]
    if (currentImage.sliderId) {
      toggleFavorite(currentImage.sliderId)
      
      // Store favorite image in localStorage for Stylist page
      const storedFavorites = JSON.parse(localStorage.getItem('looklyy_favorite_images') || '[]')
      const isAlreadyFavorite = storedFavorites.some(img => img.id === currentImage.sliderId)
      
      if (!isAlreadyFavorite) {
        // Add to favorites
        const favoriteImage = {
          id: currentImage.sliderId,
          url: currentImage.url,
          alt: currentImage.alt,
          sliderId: currentImage.sliderId,
          slider: currentImage.slider,
          favoritedAt: new Date().toISOString()
        }
        storedFavorites.push(favoriteImage)
        localStorage.setItem('looklyy_favorite_images', JSON.stringify(storedFavorites))
      } else {
        // Remove from favorites
        const updatedFavorites = storedFavorites.filter(img => img.id !== currentImage.sliderId)
        localStorage.setItem('looklyy_favorite_images', JSON.stringify(updatedFavorites))
      }
    }
  }

  const handleBookmarkClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    // Toggle canvas overlay
    setShowCanvas(prev => {
      const newState = !prev
      // Reset displayedImage and ensure carousel is functional when closing canvas
      if (prev && newState === false) {
        setDisplayedImage(null)
        // Reset dragging state to ensure carousel works
        setIsDragging(false)
        setStartX(0)
        setCurrentX(0)
      }
      return newState
    })
  }

  const handleImageClick = (e) => {
    // Only trigger if not dragging (to distinguish from swipe)
    if (!isDragging) {
      e.stopPropagation()
      setDisplayedImage('image-click')
    }
  }

  const handleDisplayedImageClick = (e) => {
    // When clicking on the bookmark image, navigate to the image-click image
    if (displayedImage === 'bookmark') {
      e.stopPropagation()
      setDisplayedImage('image-click')
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
      className={`circular-carousel ${showCanvas ? 'canvas-active' : ''}`}
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
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: (displayedImage && !showCanvas) ? 0 : 1,
          pointerEvents: (displayedImage && !showCanvas) ? 'none' : (showCanvas ? 'none' : 'auto')
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
                onClick={handleImageClick}
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
                  WebkitImageRendering: '-webkit-optimize-contrast', // Safari optimization
                  cursor: 'pointer' // Indicate image is clickable
                }}
                className="carousel-image"
                loading={shouldPreload ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          )
        })}
      </div>

      {/* Heart and Bookmark Icons - Top Right */}
      <div className="carousel-actions-top">
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
          className={`icon-button ${showCanvas ? 'icon-active' : ''}`}
          onClick={handleBookmarkClick}
          onMouseDown={handleBookmarkClick}
          aria-label={showCanvas ? 'Close canvas' : 'Bookmark look'}
        >
          <svg viewBox="0 0 24 24" className={`bookmark-icon ${showCanvas ? 'icon-filled' : 'icon-outline'}`}>
            <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </button>
      </div>

      {/* Canvas Overlay - Emerges from tapped image */}
      {showCanvas && currentImage && (
        <div 
          className="canvas-overlay"
          onTouchStart={handleCanvasTouchStart}
          onTouchEnd={handleCanvasTouchEnd}
        >
          {/* Blurred background */}
          <div className="canvas-background-blur">
            <img 
              src={currentImage.url} 
              alt={currentImage.alt}
              className="blurred-background-image"
            />
          </div>

          {/* Style Labels - Top */}
          <div className="canvas-style-labels">
            CASUAL | BOHO STREET
          </div>

          {/* Canvas Card */}
          <div className="canvas-card">
            {/* Mini Preview Image - Left aligned */}
            <div className="canvas-mini-preview">
              <img 
                src={currentImage.url} 
                alt={currentImage.alt}
                className="mini-preview-image"
              />
            </div>

            {/* Content area - Right side */}
            <div className="canvas-card-content">
              {/* Recommendation Copy */}
              <div className="canvas-recommendation">
                Jacket here, is the statement
              </div>

              {/* Primary CTA Button */}
              <button 
                className="canvas-cta-button"
                onClick={(e) => {
                  e.stopPropagation()
                  // Navigate to recreation flow
                  setDisplayedImage('image-click')
                  setShowCanvas(false)
                }}
              >
                Let's Recreate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display selected image - replaces carousel view */}
      {displayedImage && (
        <div className="carousel-displayed-image">
          <img 
            src={displayedImage === 'bookmark' ? '/pear-shape-bookmark.png' : '/pear-shape-image-click.png'}
            alt={displayedImage === 'bookmark' ? 'Pear Shape Bookmark' : 'Pear Shape Image Click'}
            className="displayed-image-full"
            onClick={handleDisplayedImageClick}
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '150%',
              maxHeight: '150%',
              objectFit: 'contain',
              objectPosition: 'center',
              cursor: displayedImage === 'bookmark' ? 'pointer' : 'default'
            }}
          />
        </div>
      )}

    </div>
  )
}

export default CircularSwipeCarousel

