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

  // Thumbnail scroll state
  const [thumbnailScrollOffset, setThumbnailScrollOffset] = useState(0)
  const maxVisibleThumbnails = 5

  // Thumbnail scroll functionality
  const scrollThumbnailsUp = () => {
    if (thumbnailScrollOffset > 0) {
      setThumbnailScrollOffset(prev => prev - 1)
    }
  }

  const scrollThumbnailsDown = () => {
    const maxOffset = Math.max(0, canvasItems.length - maxVisibleThumbnails)
    if (thumbnailScrollOffset < maxOffset) {
      setThumbnailScrollOffset(prev => prev + 1)
    }
  }

  // Get visible thumbnails
  const visibleThumbnails = canvasItems.slice(
    thumbnailScrollOffset, 
    thumbnailScrollOffset + maxVisibleThumbnails
  )

  // Thumbnail reorder functionality
  const handleThumbnailDragStart = (e, draggedIndex) => {
    e.dataTransfer.setData('text/plain', thumbnailScrollOffset + draggedIndex)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleThumbnailDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleThumbnailDrop = (e, dropIndex) => {
    e.preventDefault()
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'))
    const actualDropIndex = thumbnailScrollOffset + dropIndex
    
    if (draggedIndex === actualDropIndex) return

    // Reorder items array
    const newItems = [...canvasItems]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(actualDropIndex, 0, draggedItem)

    // Update z-index based on new order
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      zIndex: index + 1
    }))

    setCanvasItems(updatedItems)
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
            <button 
              className="control-btn" 
              data-tooltip="Save"
              onClick={() => {
                // Save board to Looklyy Boards
                console.log('Saving board to Looklyy Boards');
                // TODO: Implement save functionality
              }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M19 12v7H5v-7M12 3v9m-4-4l4 4 4-4"/>
              </svg>
            </button>
            <button 
              className="control-btn" 
              data-tooltip="Delete"
              onClick={clearCanvas}
            >
              <svg viewBox="0 0 24 24">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
              </svg>
            </button>
            {/* Thumbnail Reorder Section */}
            <div className="thumbnail-section">
              <button 
                className="scroll-btn up-arrow" 
                onClick={scrollThumbnailsUp}
                disabled={thumbnailScrollOffset === 0}
                title="Scroll Up"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z"/>
                </svg>
              </button>
              
              <div className="thumbnails-container">
                {visibleThumbnails.map((item, index) => (
                  <div
                    key={item.canvasId}
                    className="thumbnail-item"
                    draggable
                    onDragStart={(e) => handleThumbnailDragStart(e, index)}
                    onDragOver={handleThumbnailDragOver}
                    onDrop={(e) => handleThumbnailDrop(e, index)}
                    title={`Item ${thumbnailScrollOffset + index + 1}`}
                  >
                    <img src={item.image} alt={item.name} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Down Arrow at Bottom */}
            <button 
              className="scroll-btn down-arrow" 
              onClick={scrollThumbnailsDown}
              disabled={thumbnailScrollOffset >= canvasItems.length - maxVisibleThumbnails}
              title="Scroll Down"
            >
              <svg viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
          </div>

          {/* Canvas Workspace (95% right) */}
          <div className="canvas-workspace">
            {canvasItems.map((item, index) => (
              <div
                key={item.canvasId}
                className="canvas-item"
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.height,
                  zIndex: index + 1
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
