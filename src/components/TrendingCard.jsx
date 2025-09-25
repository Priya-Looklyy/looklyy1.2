import React, { useState } from 'react'
import './TrendingCard.css'

const TrendingCard = ({ card }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
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
        
        {/* No overlay buttons - clean image display */}
      </div>
      
      {/* No text info - clean image-only display */}
    </div>
  )
}

export default TrendingCard
