import React, { useState } from 'react'
import ImageSlider from './ImageSlider'
import NotificationCenter from './NotificationCenter'
import SlidingCanvas from './SlidingCanvas'
import { getAllSliders } from '../data/fashionDatabase'
import { useLook } from '../context/LookContext'
import './HomePage.css'

const HomePage = () => {
  const [pinnedLook, setPinnedLook] = useState(null)
  const [isFrame2Active, setIsFrame2Active] = useState(false)
  const { favorites } = useLook()
  
  const allSliders = getAllSliders()
  
  // Sort sliders: favorited ones first, then others
  const sortedSliders = [...allSliders].sort((a, b) => {
    const aFavorited = favorites.includes(a.id)
    const bFavorited = favorites.includes(b.id)
    
    if (aFavorited && !bFavorited) return -1
    if (!aFavorited && bFavorited) return 1
    return 0
  })

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

  return (
    <div className={`home-page ${isFrame2Active ? 'frame2-active' : ''}`}>
      {/* 5 Auto-sliding Carousels - transform when Frame 2 is active */}
      <div className={`sliders-container ${isFrame2Active ? 'frame2-layout' : ''}`}>
        {isFrame2Active ? (
          // Frame 2: Show pinned look on far left (same size as original slider)
          <div className="pinned-look-display">
            <div className="pinned-slider">
              <img 
                src={pinnedLook.currentImage.url} 
                alt={pinnedLook.currentImage.alt}
                className="pinned-image"
              />
              <div className="pinned-overlay">
                <div className="pinned-actions">
                  <button
                    className="action-btn unpin-btn"
                    onClick={closeFrame2}
                    aria-label="Unpin look"
                  >
                    <i className="fas fa-thumbtack"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Frame 1: Original 5 sliders
          sortedSliders.map(slider => (
            <ImageSlider 
              key={slider.id} 
              slider={slider}
              onPinLook={handlePinLook}
            />
          ))
        )}
        
        {/* Frame 2: Canvas and Closet sections */}
        {isFrame2Active && (
          <SlidingCanvas 
            pinnedLook={pinnedLook}
            onClose={closeFrame2}
          />
        )}
      </div>
      
      <NotificationCenter />
    </div>
  )
}

export default HomePage
