import React, { useState } from 'react'
import './Closet.css'

const Closet = () => {
  // Frame 2 state management
  const [closetFrame2Active, setClosetFrame2Active] = useState(false)
  const [selectedClosetImage, setSelectedClosetImage] = useState(null)
  const [closetCanvasItems, setClosetCanvasItems] = useState([])
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
    // Find the image for this day
    const imageToChange = closetImages.find(img => img.day === day)
    if (imageToChange) {
      setSelectedClosetImage(imageToChange)
      setClosetFrame2Active(true)
      setClosetCanvasItems([]) // Reset canvas items
    }
  }

  const handleSaveChanges = () => {
    console.log(`Saving changes for ${selectedClosetImage.day}`)
    // TODO: Implement save functionality
    // 1. Update the specific day's image with new look
    // 2. Feed change data into learning system
    // 3. Return to normal closet view
    setClosetFrame2Active(false)
    setSelectedClosetImage(null)
    setClosetCanvasItems([])
  }

  // Frame 2 Layout - Similar to homepage
  if (closetFrame2Active && selectedClosetImage) {
    return (
      <div className="closet-page frame2-layout">
        <div className="closet-frame2-container">
          {/* Selected Image - Left (20%) */}
          <div className="selected-closet-image">
            <div className="selected-image-container">
              <img 
                src={selectedClosetImage.url} 
                alt={selectedClosetImage.alt}
                className="selected-image"
              />
              <div className={`day-label ${selectedClosetImage.isWeekend ? 'weekend' : 'weekday'}`}>
                <span className="day-text">{selectedClosetImage.day}</span>
              </div>
            </div>
          </div>

          {/* Working Canvas - Center (30%) */}
          <div className="closet-working-canvas">
            <div className="canvas-header">
              <h3>Working Canvas</h3>
            </div>
            <div className="canvas-area">
              {closetCanvasItems.map(item => (
                <div key={item.id} className="canvas-item">
                  <img src={item.image} alt={item.name} />
                </div>
              ))}
            </div>
          </div>

          {/* Closet Items - Right (50%) */}
          <div className="closet-items-panel">
            <div className="closet-items-header">
              <h3>Closet Items</h3>
              <button 
                className="save-changes-btn"
                onClick={() => handleSaveChanges()}
              >
                Save Changes
              </button>
            </div>
            <div className="closet-items-grid">
              {/* TODO: Load closet items from useClosetImages hook */}
              <div className="closet-item-placeholder">
                <p>Closet items will load here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Normal Closet Layout
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
            {/* Action icons at bottom - Love and Change */}
            <div className="action-icons-container">
              <div 
                className="icon-container"
                onClick={() => handleLoveLook(image.day)}
                aria-label="Love this look"
              >
                <svg viewBox="0 0 24 24" className="heart-icon icon-outline">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div 
                className="icon-container"
                onClick={() => handleChangeLook(image.day)}
                aria-label="Change this look"
              >
                <svg viewBox="0 0 24 24" className="change-icon icon-outline">
                  <path d="M1 4v6h6"/>
                  <path d="M23 20v-6h-6"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
              </div>
            </div>
            {/* Transparent band with weekday */}
            <div className={`day-label ${image.isWeekend ? 'weekend' : 'weekday'}`}>
              <span className="day-text">{image.day}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Closet
