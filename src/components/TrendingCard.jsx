import React, { useState } from 'react'
import './TrendingCard.css'

const TrendingCard = ({ card }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Format category name for display with high-fashion precision
  const formatCategoryName = (category) => {
    if (!category) return 'trends'
    return category
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .split(' ')
      .slice(0, 2) // Limit to 2 words for clean display
      .join(' ')
      .trim()
  }

  return (
    <div className="trending-card">
      <div className="card-image-container">
        {!imageLoaded && <div className="image-loading"></div>}
        <img
          src={card.image.url}
          alt={card.image.alt}
          onLoad={handleImageLoad}
          style={{ opacity: imageLoaded ? 1 : 0 }}
          className="card-image"
        />
        
        {/* High Fashion Category Overlay - Minimalist, Precise */}
        <div className="category-overlay">
          <span className="category-label">
            {formatCategoryName(card.category)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TrendingCard
