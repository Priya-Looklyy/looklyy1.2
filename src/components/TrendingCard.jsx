import React, { useState } from 'react'
import { useLook } from '../context/LookContext'
import './TrendingCard.css'

const TrendingCard = ({ card, onPinLook }) => {
  const { toggleFavorite, isFavorited, showNotification } = useLook()
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    toggleFavorite(card.sliderId)
    
    if (!isFavorited(card.sliderId)) {
      showNotification(`Added to favorites! Moving to top... ❤️`)
    } else {
      showNotification(`Removed from favorites`)
    }
  }

  const handlePinClick = (e) => {
    e.stopPropagation()
    onPinLook(card)
    showNotification(`Look pinned! Opening canvas... 🎨`)
  }

  const handleCardClick = () => {
    showNotification(`Opening details for: ${card.slider.title}`)
    console.log('Card Details:', card)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const isCardFavorited = isFavorited(card.sliderId)

  return (
    <div 
      className={`trending-card ${isCardFavorited ? 'favorited' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-image-container">
        {!imageLoaded && <div className="image-loading"></div>}
        <img
          src={card.image.url}
          alt={card.image.alt}
          onLoad={handleImageLoad}
          style={{ opacity: imageLoaded ? 1 : 0 }}
          className="card-image"
        />
        
        {/* Card Overlay */}
        <div className="card-overlay">
          <div className="card-actions">
            <button
              className={`action-btn heart-btn ${isCardFavorited ? 'active' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isCardFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <i className={`${isCardFavorited ? 'fas' : 'far'} fa-heart`}></i>
            </button>
            <button
              className="action-btn pin-btn"
              onClick={handlePinClick}
              aria-label="Pin look to canvas"
            >
              <i className="fas fa-thumbtack"></i>
            </button>
          </div>
        </div>

        {/* Favorited indicator */}
        {isCardFavorited && (
          <div className="favorited-badge">
            <i className="fas fa-heart"></i>
          </div>
        )}
      </div>
      
      <div className="card-info">
        <h3>{card.slider.title}</h3>
        <p>{card.slider.description}</p>
        <span className="trend-tag">{card.slider.tag}</span>
      </div>
    </div>
  )
}

export default TrendingCard
