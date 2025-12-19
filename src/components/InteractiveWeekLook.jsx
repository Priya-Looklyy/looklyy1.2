import React, { useState, useRef, useEffect } from 'react'
import './InteractiveWeekLook.css'

const InteractiveWeekLook = ({ 
  look, 
  onItemSelect, 
  selectedItemId, 
  onLoveLook, 
  onChangeLook,
  closetItems 
}) => {
  const [hoveredItemId, setHoveredItemId] = useState(null)
  const imageRef = useRef(null)
  const containerRef = useRef(null)

  // Define item positions and types for each look (these would come from AI analysis)
  // For demo, we'll use predefined positions that can be adjusted
  const lookItems = look.items || [
    { id: 'top', name: 'Top', type: 'Tops', x: 50, y: 30, width: 30, height: 25 },
    { id: 'bottom', name: 'Bottom', type: 'Bottoms', x: 50, y: 60, width: 30, height: 30 },
    { id: 'shoes', name: 'Shoes', type: 'Shoes', x: 50, y: 90, width: 20, height: 15 },
    { id: 'accessory', name: 'Accessory', type: 'Accessories', x: 70, y: 25, width: 15, height: 15 }
  ]

  const handleItemClick = (item, e) => {
    e.stopPropagation()
    onItemSelect(item)
  }

  const handleImageClick = (e) => {
    // If clicking on image but not on an item, deselect
    if (e.target === imageRef.current || e.target === containerRef.current) {
      onItemSelect(null)
    }
  }

  return (
    <div 
      ref={containerRef}
      className="interactive-week-look"
      onClick={handleImageClick}
    >
      <div className="look-image-container">
        <img
          ref={imageRef}
          src={look.url}
          alt={look.alt || `${look.day} Look`}
          className="look-image"
          onError={(e) => {
            if (look.fallbackUrl) {
              e.target.src = look.fallbackUrl
            }
          }}
        />
        
        {/* Interactive Item Cutouts */}
        {lookItems.map((item) => {
          const isSelected = selectedItemId === item.id
          const isHovered = hoveredItemId === item.id
          
          return (
            <div
              key={item.id}
              className={`item-cutout ${isSelected ? 'item-selected' : ''} ${isHovered ? 'item-hovered' : ''}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${item.width}%`,
                height: `${item.height}%`
              }}
              onClick={(e) => handleItemClick(item, e)}
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
            >
              {/* Item highlight overlay */}
              <div className="item-overlay" />
              
              {/* Item label */}
              {(isSelected || isHovered) && (
                <div className="item-label">
                  <span>{item.name}</span>
                </div>
              )}
              
              {/* Change button - appears when selected */}
              {isSelected && (
                <button
                  className="item-change-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChangeLook(look.day, item)
                  }}
                  aria-label={`Change ${item.name}`}
                >
                  <svg viewBox="0 0 24 24" className="change-icon">
                    <path d="M1 4v6h6"/>
                    <path d="M23 20v-6h-6"/>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                  </svg>
                  <span>Change</span>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Day Label */}
      <div className={`look-day-label ${look.isWeekend ? 'weekend' : 'weekday'}`}>
        <span className="look-day-text">{look.day}</span>
      </div>

      {/* Action Buttons - Bottom Right */}
      <div className="look-actions">
        <button
          className="look-action-button"
          onClick={(e) => {
            e.stopPropagation()
            onLoveLook(look.day)
          }}
          aria-label="Love this look"
        >
          <svg viewBox="0 0 24 24" className="action-icon">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
        <button
          className="look-action-button"
          onClick={(e) => {
            e.stopPropagation()
            onChangeLook(look.day)
          }}
          aria-label="Change entire look"
        >
          <svg viewBox="0 0 24 24" className="action-icon">
            <path d="M1 4v6h6"/>
            <path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default InteractiveWeekLook

