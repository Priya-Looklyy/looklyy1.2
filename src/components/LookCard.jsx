import React, { useState } from 'react'
import { useLook } from '../context/LookContext'
import './LookCard.css'

const LookCard = ({ look }) => {
  const { toggleFavorite, togglePin, isFavorited, isPinned } = useLook()
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    toggleFavorite(look.id)
  }

  const handlePinClick = (e) => {
    e.stopPropagation()
    togglePin(look.id)
  }

  const handleCardClick = () => {
    // In a real app, this would navigate to a detailed view
    console.log('Look Details:', look)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <div className="look-card" onClick={handleCardClick}>
      <div className="look-image">
        {!imageLoaded && <div className="image-loading"></div>}
        <img
          src={look.image}
          alt={look.title}
          onLoad={handleImageLoad}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        <div className="look-overlay">
          <div className="look-actions">
            <div 
              className="icon-container"
              onClick={handleFavoriteClick}
              aria-label={isFavorited(look.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg viewBox="0 0 24 24" className={`heart-icon ${isFavorited(look.id) ? 'icon-filled' : 'icon-outline'}`}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div 
              className="icon-container"
              onClick={handlePinClick}
              aria-label={isPinned(look.id) ? 'Unpin look' : 'Pin look'}
            >
              <svg viewBox="0 0 24 24" className={`bookmark-icon ${isPinned(look.id) ? 'icon-filled' : 'icon-outline'}`}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LookCard
