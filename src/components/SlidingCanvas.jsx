import React, { useState, useRef } from 'react'
import './SlidingCanvas.css'

const SlidingCanvas = ({ pinnedLook, onClose }) => {
  const [canvasItems, setCanvasItems] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const canvasRef = useRef(null)

  // Mock closet items
  const closetItems = [
    { id: 1, name: 'White T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop', category: 'tops' },
    { id: 2, name: 'Blue Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop', category: 'bottoms' },
    { id: 3, name: 'Black Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop', category: 'outerwear' },
    { id: 4, name: 'Red Dress', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop', category: 'dresses' },
    { id: 5, name: 'Sneakers', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop', category: 'shoes' },
    { id: 6, name: 'Sunglasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop', category: 'accessories' }
  ]

  const partnerBrands = [
    { id: 7, name: 'Designer Bag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop', category: 'accessories', brand: 'LuxeBrand' },
    { id: 8, name: 'Gold Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop', category: 'accessories', brand: 'TimeKeeper' },
    { id: 9, name: 'Silk Scarf', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100&h=100&fit=crop', category: 'accessories', brand: 'SilkCo' }
  ]

  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (!draggedItem) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - canvasRect.left
    const y = e.clientY - canvasRect.top

    const newItem = {
      ...draggedItem,
      canvasId: Date.now(),
      x: Math.max(0, Math.min(x - 25, canvasRect.width - 50)),
      y: Math.max(0, Math.min(y - 25, canvasRect.height - 50)),
      width: 50,
      height: 50
    }

    setCanvasItems(prev => [...prev, newItem])
    setDraggedItem(null)
  }

  const removeCanvasItem = (canvasId) => {
    setCanvasItems(prev => prev.filter(item => item.canvasId !== canvasId))
  }

  const clearCanvas = () => {
    setCanvasItems([])
  }

  return (
    <div className="sliding-canvas-container">
      {/* Working Canvas (40% width - 1.5x image size) */}
      <div className="working-canvas-section">
        <div 
          className="working-canvas"
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Canvas Controls (5% left) */}
          <div className="canvas-controls">
            <button className="control-btn" title="Save Look">
              💾
            </button>
            <button className="control-btn" title="Delete All">
              🗑️
            </button>
            <button className="control-btn" title="Reorder Items">
              ↕️
            </button>
            
            {/* Items List */}
            <div className="items-list">
              {canvasItems.slice(0, 3).map((item, index) => (
                <div
                  key={item.canvasId}
                  className="item-mini"
                  title={`Item ${index + 1}`}
                >
                  {index + 1}
                </div>
              ))}
              {canvasItems.length > 3 && (
                <div className="scroll-indicator">
                  +{canvasItems.length - 3} more
                </div>
              )}
            </div>
          </div>

          {/* Canvas Workspace (95% right) */}
          <div className="canvas-workspace">
            {canvasItems.map(item => (
              <div
                key={item.canvasId}
                className="canvas-item"
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.height
                }}
              >
                <img src={item.image} alt={item.name} />
                <button 
                  className="remove-canvas-item"
                  onClick={() => removeCanvasItem(item.canvasId)}
                >
                  ×
                </button>
              </div>
            ))}
            {canvasItems.length === 0 && (
              <div className="canvas-placeholder">
                <p>Drag & Drop from closet or partner brands to recreate bookmarked look</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Closet & Brand Partners (40% width) */}
      <div className="items-library-section">
        {/* Your Closet */}
        <div className="library-subsection">
          <h4><i className="fas fa-tshirt"></i> Your Closet</h4>
          <div className="items-grid">
            {closetItems.map(item => (
              <div
                key={item.id}
                className="library-item"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
              >
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Brands */}
        <div className="library-subsection">
          <h4><i className="fas fa-store"></i> Partner Brands</h4>
          <div className="items-grid">
            {partnerBrands.map(item => (
              <div
                key={item.id}
                className="library-item partner-item"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
              >
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
                <small>{item.brand}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlidingCanvas
