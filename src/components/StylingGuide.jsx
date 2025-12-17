import React, { useState } from 'react'
import './StylingGuide.css'

const StylingGuide = ({ look, isVisible, onClose }) => {
  if (!isVisible || !look) return null

  // Mock styling tips - in production, this would come from AI/ML analysis
  const stylingTips = look.stylingTips || [
    {
      category: 'Color Palette',
      tip: 'This look uses a monochromatic palette. Try pairing with neutral accessories.',
      items: ['Black belt', 'Tan bag', 'Gold jewelry']
    },
    {
      category: 'Silhouette',
      tip: 'The relaxed fit creates a casual yet polished look. Perfect for daytime events.',
      items: ['Rolled sleeves', 'Tucked shirt', 'Straight-leg jeans']
    },
    {
      category: 'Accessories',
      tip: 'Minimal accessories keep the focus on the outfit. Add a statement piece for evening.',
      items: ['Gold bracelets', 'Leopard print flats', 'Woven handbag']
    }
  ]

  return (
    <div className="styling-guide-overlay" onClick={onClose}>
      <div className="styling-guide-card" onClick={(e) => e.stopPropagation()}>
        <button className="styling-guide-close" onClick={onClose} aria-label="Close guide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        
        <div className="styling-guide-header">
          <h3 className="styling-guide-title">Styling Guide</h3>
          <p className="styling-guide-subtitle">Personalized tips for this look</p>
        </div>

        <div className="styling-guide-content">
          {stylingTips.map((tip, index) => (
            <div key={index} className="styling-tip-section">
              <div className="styling-tip-category">
                <span className="tip-category-icon">✨</span>
                <span className="tip-category-name">{tip.category}</span>
              </div>
              <p className="styling-tip-text">{tip.tip}</p>
              {tip.items && tip.items.length > 0 && (
                <div className="styling-tip-items">
                  {tip.items.map((item, itemIndex) => (
                    <span key={itemIndex} className="styling-tip-item">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="styling-guide-footer">
          <button className="styling-guide-action-btn">
            Save to Closet
          </button>
        </div>
      </div>
    </div>
  )
}

export default StylingGuide

