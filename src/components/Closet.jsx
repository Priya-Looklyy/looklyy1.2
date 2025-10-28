import React, { useState } from 'react'
import './Closet.css'

const Closet = () => {
  // Frame 2 state management
  const [closetFrame2Active, setClosetFrame2Active] = useState(false)
  const [selectedClosetImage, setSelectedClosetImage] = useState(null)
  const [closetCanvasItems, setClosetCanvasItems] = useState([])
  
  // Tabs state management
  const [activeTab, setActiveTab] = useState('Tops')
  const [visibleItems, setVisibleItems] = useState(5) // Start with 5 items (1 full row), load more on scroll
  const [isLoading, setIsLoading] = useState(false)
  
  // Modal state management
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  // 7 closet looks - main display (unchanged)
  const closetLooks = [
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

  // Categorized closet items for tabs with enhanced data
  const closetCategories = {
    'Tops': [
      { id: 1, name: 'White Blouse', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jan 2023', wornCount: 12 },
      { id: 2, name: 'Black Shirt', image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Mar 2023', wornCount: 8 },
      { id: 3, name: 'Blue Top', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jun 2023', wornCount: 15 },
      { id: 4, name: 'Red Blouse', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Sep 2023', wornCount: 6 },
      { id: 5, name: 'Green Top', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Nov 2023', wornCount: 9 },
      { id: 6, name: 'Pink Shirt', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Dec 2023', wornCount: 4 },
      { id: 7, name: 'Striped Blouse', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Feb 2024', wornCount: 7 },
      { id: 8, name: 'Silk Top', image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Apr 2024', wornCount: 11 },
      { id: 9, name: 'Cotton Blouse', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'May 2024', wornCount: 14 },
      { id: 10, name: 'Linen Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jun 2024', wornCount: 9 },
      { id: 11, name: 'Chiffon Top', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jul 2024', wornCount: 6 },
      { id: 12, name: 'Knit Sweater', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Aug 2024', wornCount: 8 },
      { id: 13, name: 'Tank Top', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Sep 2024', wornCount: 12 }
    ],
    'Tee Shirts': [
      { id: 20, name: 'White T-Shirt', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jan 2023', wornCount: 25 },
      { id: 21, name: 'Black T-Shirt', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Mar 2023', wornCount: 18 },
      { id: 22, name: 'Blue T-Shirt', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'May 2023', wornCount: 22 },
      { id: 23, name: 'Red T-Shirt', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jul 2023', wornCount: 14 },
      { id: 24, name: 'Green T-Shirt', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Aug 2023', wornCount: 16 },
      { id: 25, name: 'Pink T-Shirt', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Oct 2023', wornCount: 13 },
      { id: 26, name: 'Graphic Tee', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Dec 2023', wornCount: 19 },
      { id: 27, name: 'Vintage Tee', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jan 2024', wornCount: 8 },
      { id: 28, name: 'Band Tee', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Feb 2024', wornCount: 15 },
      { id: 29, name: 'Oversized Tee', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Mar 2024', wornCount: 11 },
      { id: 30, name: 'Crop Top', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Apr 2024', wornCount: 7 },
      { id: 31, name: 'Long Sleeve Tee', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'May 2024', wornCount: 9 },
      { id: 32, name: 'Henley Shirt', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jun 2024', wornCount: 6 }
    ],
    'Bottoms': [
      { id: 40, name: 'Black Jeans', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jan 2023', wornCount: 20 },
      { id: 41, name: 'Blue Jeans', image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Feb 2023', wornCount: 17 },
      { id: 42, name: 'Black Pants', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Apr 2023', wornCount: 12 },
      { id: 43, name: 'White Pants', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jun 2023', wornCount: 9 },
      { id: 44, name: 'Gray Pants', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Aug 2023', wornCount: 11 },
      { id: 45, name: 'Brown Pants', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Sep 2023', wornCount: 7 },
      { id: 46, name: 'Cargo Pants', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Nov 2023', wornCount: 5 },
      { id: 47, name: 'Skinny Jeans', image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Dec 2023', wornCount: 14 },
      { id: 48, name: 'Wide Leg Pants', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jan 2024', wornCount: 8 },
      { id: 49, name: 'Cropped Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Feb 2024', wornCount: 12 },
      { id: 50, name: 'High Waist Jeans', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Mar 2024', wornCount: 15 },
      { id: 51, name: 'Straight Leg Jeans', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Apr 2024', wornCount: 10 },
      { id: 52, name: 'Trouser Pants', image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'May 2024', wornCount: 6 }
    ],
    'Dresses': [
      { id: 60, name: 'Black Dress', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jan 2023', wornCount: 8 },
      { id: 61, name: 'Red Dress', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Mar 2023', wornCount: 6 },
      { id: 62, name: 'Blue Dress', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'May 2023', wornCount: 10 },
      { id: 63, name: 'White Dress', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jul 2023', wornCount: 7 },
      { id: 64, name: 'Green Dress', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Aug 2023', wornCount: 4 },
      { id: 65, name: 'Pink Dress', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Oct 2023', wornCount: 5 },
      { id: 66, name: 'Maxi Dress', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Dec 2023', wornCount: 3 },
      { id: 67, name: 'Cocktail Dress', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jan 2024', wornCount: 2 },
      { id: 68, name: 'Midi Dress', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Feb 2024', wornCount: 9 },
      { id: 69, name: 'Wrap Dress', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Mar 2024', wornCount: 7 },
      { id: 70, name: 'Shift Dress', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Apr 2024', wornCount: 6 },
      { id: 71, name: 'A-Line Dress', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'May 2024', wornCount: 8 },
      { id: 72, name: 'Bodycon Dress', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=400&fit=crop&auto=format&q=80', ownedSince: 'Jun 2024', wornCount: 4 }
    ]
  }

  const handleLoveLook = (day) => {
    console.log(`Loved look for ${day}`)
    // TODO: Implement learning module - positive feedback
    // This will feed into the learning system for future personalization
  }

  const handleChangeLook = (day) => {
    console.log(`Changing look for ${day}`)
    // Find the image for this day
    const imageToChange = closetLooks.find(img => img.day === day)
    if (imageToChange) {
      setSelectedClosetImage(imageToChange)
      setClosetFrame2Active(true)
      setClosetCanvasItems([]) // Reset canvas items
    }
  }

  // Tab functions
  const handleTabChange = (tabName) => {
    setActiveTab(tabName)
    setVisibleItems(5) // Reset visible items when switching tabs (1 full row)
  }

  // Modal functions
  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false)
  }

  // Handle infinite scroll and auto-dissolve modal based on page scroll position
  React.useEffect(() => {
    const handlePageScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Auto-dissolve modal on any scroll
      if (showWelcomeModal && scrollTop > 50) {
        setShowWelcomeModal(false)
      }

      // Handle infinite scroll - trigger when user is near bottom
      const currentCategoryItems = closetCategories[activeTab] || []
      const hasMoreItems = visibleItems < currentCategoryItems.length
      
      if (scrollTop + windowHeight >= documentHeight - 200 && !isLoading && hasMoreItems) {
        setIsLoading(true)
        setTimeout(() => {
          setVisibleItems(prev => Math.min(prev + 5, currentCategoryItems.length)) // Load 5 more items (1 full row) or remaining items
          setIsLoading(false)
        }, 500) // Simulate loading delay
      }
    }

    window.addEventListener('scroll', handlePageScroll)
    return () => window.removeEventListener('scroll', handlePageScroll)
  }, [isLoading, activeTab, visibleItems, showWelcomeModal])

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
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="welcome-modal-overlay">
          <div className="welcome-modal">
            <div className="welcome-modal-header">
              <h2 className="welcome-modal-title">Your Weekly Curated Looks</h2>
            </div>
            <div className="welcome-modal-content">
              <p className="welcome-modal-text">
                AI-powered outfits from your closet, personalized just for you. 
                Each look is carefully curated based on your style preferences and wardrobe.
              </p>
              <div className="welcome-modal-features">
                <div className="feature-item">
                  <div className="feature-icon">❤️</div>
                  <span>Love looks to improve recommendations</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔄</div>
                  <span>Change looks to explore alternatives</span>
                </div>
              </div>
            </div>
            <div className="welcome-modal-footer">
              <button 
                className="welcome-modal-button"
                onClick={handleCloseWelcomeModal}
              >
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 7 Looks Section - Full Screen */}
      <div className="closet-images-container">
        {closetLooks.map(image => (
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
        
        {/* Scroll Indicator - REMOVED */}
      </div>
      
      {/* Categorized Closet Items Tabs Section */}
      <div className="closet-tabs-section">
        <div className="tabs-header">
          <div className="tabs-container">
            {Object.keys(closetCategories).map(tabName => (
              <button
                key={tabName}
                className={`tab-button ${activeTab === tabName ? 'active' : ''}`}
                onClick={() => handleTabChange(tabName)}
              >
                {tabName}
              </button>
            ))}
          </div>
        </div>
        
        <div className="tabs-content">
          <div className="closet-items-grid">
            {closetCategories[activeTab]?.slice(0, visibleItems).map(item => (
              <div key={item.id} className="closet-item">
                <div className="item-image-container">
                  <img src={item.image} alt={item.name} />
                  <div className="item-hover-overlay">
                    <div className="hover-content">
                      <div className="hover-stats">
                        <span className="hover-date">{item.ownedSince}</span>
                        <span className="hover-separator">•</span>
                        <span className="hover-count">{item.wornCount} wears</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="item-name">{item.name}</span>
              </div>
            ))}
            {isLoading && (
              <div className="loading-indicator">
                <div className="loading-spinner"></div>
                <span>Loading more items...</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
        {/* Go to Top Button - REMOVED */}
    </div>
  )
}

export default Closet
