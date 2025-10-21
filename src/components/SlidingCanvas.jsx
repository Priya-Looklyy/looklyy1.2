import React, { useState, useRef } from 'react'
import { removeBackgroundFromUrl } from '../utils/backgroundRemoval'
import './SlidingCanvas.css'

const SlidingCanvas = ({ pinnedLook, onClose }) => {
  const [canvasItems, setCanvasItems] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef(null)

  // Mock closet items with transparent backgrounds (cutout-ready)
  const closetItems = [
    { id: 1, name: 'White T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&auto=format&q=80', category: 'tops' },
    { id: 2, name: 'Blue Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop&auto=format&q=80', category: 'bottoms' },
    { id: 3, name: 'Black Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop&auto=format&q=80', category: 'outerwear' },
    { id: 4, name: 'Red Dress', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop&auto=format&q=80', category: 'dresses' },
    { id: 5, name: 'Sneakers', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop&auto=format&q=80', category: 'shoes' },
    { id: 6, name: 'Sunglasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop&auto=format&q=80', category: 'accessories' }
  ]

  const partnerBrands = [
    { id: 7, name: 'Designer Bag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop', category: 'accessories', brand: 'LuxeBrand' },
    { id: 8, name: 'Gold Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop', category: 'accessories', brand: 'TimeKeeper' },
    { id: 9, name: 'Silk Scarf', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100&h=100&fit=crop', category: 'accessories', brand: 'SilkCo' }
  ]

  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'copy'
    e.target.classList.add('dragging')
    console.log('🎨 Starting drag for cutout:', item.name)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging')
    setDraggedItem(null)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    if (!draggedItem || isProcessing) return

    setIsProcessing(true)
    console.log('🔄 Processing background removal for:', draggedItem.name)

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - canvasRect.left
    const y = e.clientY - canvasRect.top

    // Paper cutout size - larger for better visibility
    const itemWidth = 100
    const itemHeight = 100

    try {
      // Apply background removal to create paper cutout
      const processedImageUrl = await applyBackgroundRemoval(draggedItem.image, draggedItem.name)

      const newItem = {
        ...draggedItem,
        canvasId: Date.now(),
        x: Math.max(0, Math.min(x - itemWidth/2, canvasRect.width - itemWidth)),
        y: Math.max(0, Math.min(y - itemHeight/2, canvasRect.height - itemHeight)),
        width: itemWidth,
        height: itemHeight,
        image: processedImageUrl, // Use processed image with removed background
        originalImage: draggedItem.image // Keep original for reference
      }

      console.log('✅ Paper cutout added:', newItem.name, 'at position:', x, y)
      setCanvasItems(prev => [...prev, newItem])
    } catch (error) {
      console.log('❌ Failed to process image:', error)
    } finally {
      setDraggedItem(null)
      setIsProcessing(false)
    }
  }

  const removeCanvasItem = (canvasId) => {
    setCanvasItems(prev => prev.filter(item => item.canvasId !== canvasId))
  }

  // Process image through AI background removal (from proven implementation)
  const applyBackgroundRemoval = async (imageUrl, itemName) => {
    let processedImageUrl = imageUrl;
    console.log('🎯 Starting background removal for:', imageUrl);

    try {
      // Use improved backend service for background removal (with better accuracy)
      console.log('🚀 Processing image with enhanced backend service...');
      processedImageUrl = await removeBackgroundFromUrl(imageUrl);
      console.log('✅ Enhanced backend processing complete - PNG with transparency');
      
      // Try to crop to object boundaries (handle CORS errors gracefully)
      try {
        console.log('✂️ Frontend: Applying precision cropping...');
        const croppedDataUrl = await cropToObjectBoundaries(processedImageUrl);
        console.log('✅ Frontend: Precision cropping complete - tightly cropped object');
        return croppedDataUrl;
      } catch (cropError) {
        console.warn('⚠️ Cropping failed (likely CORS), using processed image:', cropError.message);
        return processedImageUrl; // Return the processed image without cropping
      }
      
    } catch (apiError) {
      console.error('❌ Background removal API failed:', apiError);
      console.log('⚠️ Using original image as fallback');
      return imageUrl;
    }
  }


  // Helper function to crop image to actual object boundaries
  const cropToObjectBoundaries = (dataUrl) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        
        // Set crossOrigin to handle CORS issues
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            // Create canvas to analyze the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Safely get image data with CORS handling
            let imageData;
            try {
              imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            } catch (corsError) {
              console.warn('⚠️ CORS issue detected, skipping cropping:', corsError.message);
              // Return original data URL if we can't access pixel data
              resolve(dataUrl);
              return;
            }
            
            const data = imageData.data;
            
            // Find the actual object boundaries (non-transparent pixels)
            let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
            let hasContent = false;
            let totalPixels = 0;
            let nonTransparentPixels = 0;
            
            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                const alpha = data[index + 3]; // Alpha channel
                totalPixels++;
                
                // Use higher threshold for better precision (ignore semi-transparent pixels)
                if (alpha > 128) { // Only count pixels that are more than 50% opaque
                  hasContent = true;
                  nonTransparentPixels++;
                  minX = Math.min(minX, x);
                  maxX = Math.max(maxX, x);
                  minY = Math.min(minY, y);
                  maxY = Math.max(maxY, y);
                }
              }
            }
            
            console.log('🔍 Cropping Debug:', {
              imageSize: `${canvas.width}x${canvas.height}`,
              totalPixels,
              nonTransparentPixels,
              hasContent,
              originalBounds: { minX, maxX, minY, maxY },
              objectSize: hasContent ? `${maxX - minX + 1}x${maxY - minY + 1}` : 'none'
            });
            
            if (!hasContent) {
              // No content found, return original
              resolve(dataUrl);
              return;
            }
            
            // No padding for maximum precision - crop exactly to object boundaries
            const padding = 0;
            minX = Math.max(0, minX - padding);
            maxX = Math.min(canvas.width - 1, maxX + padding);
            minY = Math.max(0, minY - padding);
            maxY = Math.min(canvas.height - 1, maxY + padding);
            
            // Calculate crop dimensions
            const cropWidth = maxX - minX + 1;
            const cropHeight = maxY - minY + 1;
            
            console.log('✂️ Final Crop Dimensions:', {
              cropWidth,
              cropHeight,
              cropArea: `${cropWidth}x${cropHeight}`,
              originalArea: `${canvas.width}x${canvas.height}`,
              reduction: `${Math.round((1 - (cropWidth * cropHeight) / (canvas.width * canvas.height)) * 100)}%`
            });
            
            // Create new canvas for cropped image
            const cropCanvas = document.createElement('canvas');
            const cropCtx = cropCanvas.getContext('2d');
            cropCanvas.width = cropWidth;
            cropCanvas.height = cropHeight;
            
            // Draw the cropped portion
            cropCtx.drawImage(
              img,
              minX, minY, cropWidth, cropHeight,
              0, 0, cropWidth, cropHeight
            );
          
            // Convert back to data URL
            const croppedDataUrl = cropCanvas.toDataURL('image/png');
            console.log('✂️ Frontend: Image cropped to object boundaries');
            resolve(croppedDataUrl);
            
          } catch (innerError) {
            console.warn('⚠️ Error during cropping process:', innerError);
            resolve(dataUrl);
          }
        };
        
        img.onerror = () => {
          console.warn('⚠️ Could not load image for cropping, returning original');
          resolve(dataUrl);
        };
        
        img.src = dataUrl;
        
      } catch (error) {
        console.warn('⚠️ Cropping failed, returning original:', error);
        resolve(dataUrl);
      }
    });
  }

  // Fallback removed - using proven API approach only

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
  const [draggedThumbnailIndex, setDraggedThumbnailIndex] = useState(null)

  const handleThumbnailDragStart = (e, draggedIndex) => {
    const actualIndex = thumbnailScrollOffset + draggedIndex
    e.dataTransfer.setData('text/plain', actualIndex.toString())
    e.dataTransfer.effectAllowed = 'move'
    setDraggedThumbnailIndex(actualIndex)
    console.log('🎯 Drag Start - Index:', actualIndex)
  }

  const handleThumbnailDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleThumbnailDrop = (e, dropIndex) => {
    e.preventDefault()
    e.stopPropagation()
    
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'))
    const actualDropIndex = thumbnailScrollOffset + dropIndex
    
    console.log('🎯 Drop - From:', draggedIndex, 'To:', actualDropIndex)
    console.log('🎯 Canvas Items Length:', canvasItems.length)
    
    if (draggedIndex === actualDropIndex) {
      console.log('⚠️ Same position, no reorder needed')
      setDraggedThumbnailIndex(null)
      return
    }

    if (draggedIndex < 0 || draggedIndex >= canvasItems.length || 
        actualDropIndex < 0 || actualDropIndex >= canvasItems.length) {
      console.log('❌ Invalid indices')
      setDraggedThumbnailIndex(null)
      return
    }

    // Reorder items array
    const newItems = [...canvasItems]
    const draggedItem = newItems[draggedIndex]
    
    console.log('🎯 Dragged Item:', draggedItem)
    
    // Remove from original position
    newItems.splice(draggedIndex, 1)
    // Insert at new position
    newItems.splice(actualDropIndex, 0, draggedItem)

    // Update z-index based on new order
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      zIndex: index + 1
    }))

    console.log('🎯 New Order:', updatedItems.map(item => item.name))
    setCanvasItems(updatedItems)
    setDraggedThumbnailIndex(null)
    console.log('✅ Reorder complete')
  }

  const handleThumbnailDragEnd = () => {
    setDraggedThumbnailIndex(null)
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
                // Save board to Boards
                console.log('Saving board to Boards');
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
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <div className="thumbnails-container">
                {visibleThumbnails.map((item, index) => {
                  const actualIndex = thumbnailScrollOffset + index
                  const isDragging = draggedThumbnailIndex === actualIndex
                  return (
                    <div
                      key={item.canvasId}
                      className={`thumbnail-item ${isDragging ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleThumbnailDragStart(e, index)}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        e.dataTransfer.dropEffect = 'move'
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleThumbnailDrop(e, index)
                      }}
                      onDragEnd={handleThumbnailDragEnd}
                      title={`Item ${actualIndex + 1}`}
                    >
                      <img src={item.image} alt={item.name} />
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Down Arrow at Bottom */}
            <button 
              className="scroll-btn down-arrow" 
              onClick={scrollThumbnailsDown}
              disabled={thumbnailScrollOffset >= canvasItems.length - maxVisibleThumbnails}
              title="Scroll Down"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 6l6 6-6 6"/>
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
            {canvasItems.length === 0 && !isProcessing && (
              <div className="canvas-placeholder">
                <p>Drag & Drop from closet or partner brands to recreate bookmarked look</p>
              </div>
            )}
            {isProcessing && (
              <div className="processing-indicator">
                <div className="processing-spinner"></div>
                <p>Removing background & creating paper cutout...</p>
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
                onDragEnd={handleDragEnd}
                title={`Drag to create paper cutout of ${item.name}`}
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
                onDragEnd={handleDragEnd}
                title={`Drag to create paper cutout of ${item.name} from ${item.brand}`}
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
