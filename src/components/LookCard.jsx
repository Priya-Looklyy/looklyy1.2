import React, { useState } from 'react'
import { useLook } from '../context/LookContext'
import './LookCard.css'

const LookCard = ({ look }) => {
  const { toggleFavorite, togglePin, isFavorited, isPinned, showNotification } = useLook()
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
    showNotification(`Opening details for: ${look.title}`)
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
            <button
              className={`action-btn heart-btn ${isFavorited(look.id) ? 'active' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorited(look.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <i className={`${isFavorited(look.id) ? 'fas' : 'far'} fa-heart`}></i>
            </button>
            <button
              className={`action-btn pin-btn ${isPinned(look.id) ? 'active' : ''}`}
              onClick={handlePinClick}
              aria-label={isPinned(look.id) ? 'Unpin look' : 'Pin look'}
            >
              <i className="fas fa-thumbtack"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LookCard
