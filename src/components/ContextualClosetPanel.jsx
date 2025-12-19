import React, { useState, useEffect } from 'react'
import './ContextualClosetPanel.css'

const ContextualClosetPanel = ({ 
  selectedItem, 
  closetItems, 
  onItemReplace, 
  onClose,
  currentDay 
}) => {
  const [activeTab, setActiveTab] = useState(selectedItem?.type || 'Tops')
  const [visibleItems, setVisibleItems] = useState(12)

  // Filter items by selected item type
  const relevantItems = closetItems[selectedItem?.type] || []

  useEffect(() => {
    if (selectedItem?.type) {
      setActiveTab(selectedItem.type)
    }
  }, [selectedItem])

  const handleItemClick = (item) => {
    onItemReplace(selectedItem, item, currentDay)
    onClose()
  }

  if (!selectedItem) return null

  return (
    <div className={`contextual-closet-panel ${selectedItem ? 'active' : ''}`}>
      <div className="panel-overlay" onClick={onClose} />
      <div className="panel-content">
        <div className="panel-header">
          <div className="panel-title">
            <h3>Replace {selectedItem.name}</h3>
            <p className="panel-subtitle">Choose from your {selectedItem.type}</p>
          </div>
          <button className="panel-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="panel-items">
          {relevantItems.length > 0 ? (
            <div className="items-grid">
              {relevantItems.slice(0, visibleItems).map(item => (
                <div
                  key={item.id}
                  className="closet-item-card"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="item-image-wrapper">
                    <img src={item.image} alt={item.name} />
                    <div className="item-overlay-hover">
                      <span className="item-name-hover">{item.name}</span>
                    </div>
                  </div>
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <div className="item-meta">
                      <span>{item.ownedSince}</span>
                      <span>•</span>
                      <span>{item.wornCount} wears</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No {selectedItem.type} available in your closet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContextualClosetPanel

