import React from 'react'
import './Closet.css'

const Closet = () => {
  // 7 closet images with weekdays - similar to homepage layout
  const closetImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Monday Look',
      day: 'Monday',
      isWeekend: false
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Tuesday Look',
      day: 'Tuesday',
      isWeekend: false
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Wednesday Look',
      day: 'Wednesday',
      isWeekend: false
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Thursday Look',
      day: 'Thursday',
      isWeekend: false
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Friday Look',
      day: 'Friday',
      isWeekend: false
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Saturday Look',
      day: 'Saturday',
      isWeekend: true
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Sunday Look',
      day: 'Sunday',
      isWeekend: true
    }
  ]

  const handleLoveLook = (day) => {
    console.log(`Loved look for ${day}`)
    // TODO: Implement learning module - positive feedback
    // This will feed into the learning system for future personalization
  }

  const handleChangeLook = (day) => {
    console.log(`Changing look for ${day}`)
    // TODO: Implement Frame 2 integration - show closet items
    // This will trigger the closet-specific Frame 2 view
  }

  return (
    <div className="closet-page">
      <div className="closet-images-container">
        {closetImages.map(image => (
          <div key={image.id} className="closet-image-item">
            <img 
              src={image.url} 
              alt={image.alt}
              className="closet-image"
            />
            {/* Transparent band with weekday */}
            <div className={`day-label ${image.isWeekend ? 'weekend' : 'weekday'}`}>
              <span className="day-text">{image.day}</span>
            </div>
            {/* Action icons at bottom - Love and Change */}
            <div className="action-icons-container">
              <button 
                className="action-icon love-icon"
                onClick={() => handleLoveLook(image.day)}
                title="Love this look"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <button 
                className="action-icon change-icon"
                onClick={() => handleChangeLook(image.day)}
                title="Change this look"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6"/>
                  <path d="M23 20v-6h-6"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Closet
