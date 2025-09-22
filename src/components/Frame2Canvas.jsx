import React, { useState, useRef } from 'react'
import './Frame2Canvas.css'

const Frame2Canvas = ({ pinnedLook, onClose }) => {
  const [canvasItems, setCanvasItems] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const canvasRef = useRef(null)

  // Mock closet items - will be replaced with real data
  const closetItems = [
    { id: 1, name: 'White T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop', category: 'tops' },
    { id: 2, name: 'Blue Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&h=150&fit=crop', category: 'bottoms' },
    { id: 3, name: 'Black Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop', category: 'outerwear' },
    { id: 4, name: 'Red Dress', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&h=150&fit=crop', category: 'dresses' },
    { id: 5, name: 'Sneakers', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&h=150&fit=crop', category: 'shoes' },
    { id: 6, name: 'Sunglasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&h=150&fit=crop', category: 'accessories' }
  ]

  const partnerBrands = [
    { id: 7, name: 'Designer Bag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop', category: 'accessories', brand: 'LuxeBrand' },
    { id: 8, name: 'Gold Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop', category: 'accessories', brand: 'TimeKeeper' },
    { id: 9, name: 'Silk Scarf', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=150&h=150&fit=crop', category: 'accessories', brand: 'SilkCo' }
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
      x: x - 25, // Center the item
      y: y - 25,
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

  const handleBackgroundRemoval = async (canvasId) => {
    const item = canvasItems.find(item => item.canvasId === canvasId)
    if (!item) return

    try {
      // Import the background removal utility
      const { removeBackgroundFromUrl } = await import('../utils/backgroundRemoval')
      
      const processedImageUrl = await removeBackgroundFromUrl(item.image)
      
      setCanvasItems(prev => prev.map(canvasItem => 
        canvasItem.canvasId === canvasId 
          ? { ...canvasItem, image: processedImageUrl, hasTransparentBg: true }
          : canvasItem
      ))
    } catch (error) {
      console.error('Background removal failed:', error)
    }
  }

  return (
    <div className="frame2-overlay">
      <div className="frame2-container">
        {/* Header */}
        <div className="frame2-header">
          <h2>Style Canvas</h2>
          <div className="header-actions">
            <button className="clear-btn" onClick={clearCanvas}>
              <i className="fas fa-eraser"></i> Clear Canvas
            </button>
            <button className="close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="frame2-content">
          {/* Left: Pinned Look */}
          <div className="pinned-look-section">
            <h3>Pinned Look</h3>
            <div className="pinned-look">
              <img 
                src={pinnedLook.currentImage.url} 
                alt={pinnedLook.currentImage.alt}
                className="pinned-image"
              />
              <div className="pinned-info">
                <h4>{pinnedLook.slider.title}</h4>
                <p>{pinnedLook.slider.description}</p>
                <span className="trend-tag">{pinnedLook.slider.tag}</span>
              </div>
            </div>
          </div>

          {/* Right: Working Canvas */}
          <div className="canvas-section">
            <div className="canvas-header">
              <h3>Working Canvas</h3>
              <span className="canvas-hint">Drag items from your closet to recreate the look</span>
            </div>
            
            <div 
              className="working-canvas"
              ref={canvasRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
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
                  <div className="item-controls">
                    <button 
                      className="bg-remove-btn"
                      onClick={() => handleBackgroundRemoval(item.canvasId)}
                      title="Remove Background"
                    >
                      <i className="fas fa-cut"></i>
                    </button>
                    <button 
                      className="remove-item"
                      onClick={() => removeCanvasItem(item.canvasId)}
                      title="Remove Item"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {canvasItems.length === 0 && (
                <div className="canvas-placeholder">
                  <i className="fas fa-palette"></i>
                  <p>Drop items here to create your look</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Item Library */}
        <div className="item-library">
          <div className="library-section">
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

          <div className="library-section">
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
    </div>
  )
}

export default Frame2Canvas
