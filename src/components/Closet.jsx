import React, { useState } from 'react'
import './Closet.css'

const Closet = () => {
  // Frame 2 state management
  const [closetFrame2Active, setClosetFrame2Active] = useState(false)
  const [selectedClosetImage, setSelectedClosetImage] = useState(null)
  const [closetCanvasItems, setClosetCanvasItems] = useState([])
  
  // Pagination state management
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages] = useState(4) // 4 different wardrobe sets to browse through
  // Multiple wardrobe sets for pagination
  const wardrobeSets = [
    // Week 1 - Current Week
    [
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
    ],
    // Week 2 - Casual Week
    [
      {
        id: 8,
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Monday Casual',
        day: 'Monday',
        isWeekend: false
      },
      {
        id: 9,
        url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Tuesday Casual',
        day: 'Tuesday',
        isWeekend: false
      },
      {
        id: 10,
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Wednesday Casual',
        day: 'Wednesday',
        isWeekend: false
      },
      {
        id: 11,
        url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Thursday Casual',
        day: 'Thursday',
        isWeekend: false
      },
      {
        id: 12,
        url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Friday Casual',
        day: 'Friday',
        isWeekend: false
      },
      {
        id: 13,
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Saturday Casual',
        day: 'Saturday',
        isWeekend: true
      },
      {
        id: 14,
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Sunday Casual',
        day: 'Sunday',
        isWeekend: true
      }
    ],
    // Week 3 - Formal Week
    [
      {
        id: 15,
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Monday Formal',
        day: 'Monday',
        isWeekend: false
      },
      {
        id: 16,
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Tuesday Formal',
        day: 'Tuesday',
        isWeekend: false
      },
      {
        id: 17,
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Wednesday Formal',
        day: 'Wednesday',
        isWeekend: false
      },
      {
        id: 18,
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Thursday Formal',
        day: 'Thursday',
        isWeekend: false
      },
      {
        id: 19,
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Friday Formal',
        day: 'Friday',
        isWeekend: false
      },
      {
        id: 20,
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Saturday Formal',
        day: 'Saturday',
        isWeekend: true
      },
      {
        id: 21,
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Sunday Formal',
        day: 'Sunday',
        isWeekend: true
      }
    ],
    // Week 4 - Weekend Vibes
    [
      {
        id: 22,
        url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Monday Relaxed',
        day: 'Monday',
        isWeekend: false
      },
      {
        id: 23,
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Tuesday Relaxed',
        day: 'Tuesday',
        isWeekend: false
      },
      {
        id: 24,
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Wednesday Relaxed',
        day: 'Wednesday',
        isWeekend: false
      },
      {
        id: 25,
        url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Thursday Relaxed',
        day: 'Thursday',
        isWeekend: false
      },
      {
        id: 26,
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Friday Relaxed',
        day: 'Friday',
        isWeekend: false
      },
      {
        id: 27,
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Saturday Relaxed',
        day: 'Saturday',
        isWeekend: true
      },
      {
        id: 28,
        url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&auto=format&q=80',
        alt: 'Sunday Relaxed',
        day: 'Sunday',
        isWeekend: true
      }
    ]
  ]

  // Get current wardrobe set based on pagination
  const currentWardrobeSet = wardrobeSets[currentPage] || wardrobeSets[0]

  const handleLoveLook = (day) => {
    console.log(`Loved look for ${day}`)
    // TODO: Implement learning module - positive feedback
    // This will feed into the learning system for future personalization
  }

  const handleChangeLook = (day) => {
    console.log(`Changing look for ${day}`)
    // Find the image for this day in current wardrobe set
    const imageToChange = currentWardrobeSet.find(img => img.day === day)
    if (imageToChange) {
      setSelectedClosetImage(imageToChange)
      setClosetFrame2Active(true)
      setClosetCanvasItems([]) // Reset canvas items
    }
  }

  // Pagination functions
  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex)
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
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

  // Frame 2 Layout - Only show when explicitly triggered
  if (closetFrame2Active && selectedClosetImage) {
    console.log('Showing Frame 2 for:', selectedClosetImage.day)
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
  console.log('Rendering normal closet layout. Frame2Active:', closetFrame2Active, 'SelectedImage:', selectedClosetImage)
  return (
    <div className="closet-page">
      <div className="closet-images-container">
        {currentWardrobeSet.map(image => (
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
      
      {/* Pagination Dots */}
      <div className="pagination-container">
        <div className="pagination-dots">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`pagination-dot ${index === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(index)}
              aria-label={`Go to wardrobe set ${index + 1}`}
            />
          ))}
        </div>
        <div className="pagination-labels">
          <span className="current-set-label">
            {currentPage === 0 && 'Current Week'}
            {currentPage === 1 && 'Casual Week'}
            {currentPage === 2 && 'Formal Week'}
            {currentPage === 3 && 'Weekend Vibes'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Closet
