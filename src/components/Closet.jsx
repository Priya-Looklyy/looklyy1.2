import React, { useState, useRef } from 'react'
import './Closet.css'
import { removeBackgroundFromUrl } from '../utils/backgroundRemoval'

const Closet = () => {
  // Frame 2 state management
  const [closetFrame2Active, setClosetFrame2Active] = useState(false)
  const [selectedClosetImage, setSelectedClosetImage] = useState(null)
  const [closetCanvasItems, setClosetCanvasItems] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [draggedCanvasItem, setDraggedCanvasItem] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)
  
  // Tabs state management
  const [activeTab, setActiveTab] = useState('Tops')
  const [visibleItems, setVisibleItems] = useState(5) // Start with 5 items (1 full row), load more on scroll
  const [isLoading, setIsLoading] = useState(false)
  
  // Modal state management
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  
  // Auto-dissolve timer
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeModal(false)
    }, 5000) // 5 seconds
    
    return () => clearTimeout(timer)
  }, [])
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

  // Drag and Drop functionality for working canvas
  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'copy'
    e.target.classList.add('dragging')
    console.log('🎨 Starting drag for cutout:', item.name)
    console.log('📦 Dragged item data:', item)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    console.log('🎯 Drag over canvas workspace')
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging')
    setDraggedItem(null)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    console.log('🎯 Drop event triggered')
    console.log('📦 Dragged item:', draggedItem)
    console.log('⚙️ Is processing:', isProcessing)
    
    if (!draggedItem || isProcessing) {
      console.log('❌ Drop cancelled - no dragged item or processing')
      return
    }

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
      setClosetCanvasItems(prev => [...prev, newItem])
    } catch (error) {
      console.log('❌ Failed to process image:', error)
    } finally {
      setDraggedItem(null)
      setIsProcessing(false)
    }
  }

  const removeCanvasItem = (canvasId) => {
    setClosetCanvasItems(prev => prev.filter(item => item.canvasId !== canvasId))
  }

  const saveChanges = () => {
    if (closetCanvasItems.length === 0) {
      alert('No items on canvas to save')
      return
    }
    
    // Save the changes (in a real app, this would update the database)
    console.log('💾 Saving changes for look:', selectedClosetImage?.day)
    console.log('📦 Saved items:', closetCanvasItems)
    
    // Show success message
    alert(`Changes saved for ${selectedClosetImage?.day}! The look has been updated.`)
    
    // In a real app, this would update the closet page data
    // For now, we'll just log the success
  }

  const clearAllItems = () => {
    setClosetCanvasItems([])
  }

  const undoLastItem = () => {
    setClosetCanvasItems(prev => prev.slice(0, -1))
  }

  // Canvas item repositioning handlers
  const handleCanvasItemDragStart = (e, item) => {
    e.preventDefault()
    setDraggedCanvasItem(item)
    
    const rect = e.currentTarget.getBoundingClientRect()
    const canvasRect = canvasRef.current.getBoundingClientRect()
    
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    
    e.currentTarget.style.opacity = '0.7'
    e.currentTarget.style.cursor = 'grabbing'
    console.log('🎯 Starting reposition of canvas item:', item.name)
  }

  const handleCanvasItemDrag = (e) => {
    if (!draggedCanvasItem) return
    
    e.preventDefault()
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const workspaceRect = canvasRef.current.querySelector('.canvas-workspace').getBoundingClientRect()
    
    const newX = e.clientX - workspaceRect.left - dragOffset.x
    const newY = e.clientY - workspaceRect.top - dragOffset.y
    
    // Constrain to canvas workspace boundaries
    const constrainedX = Math.max(0, Math.min(newX, workspaceRect.width - draggedCanvasItem.width))
    const constrainedY = Math.max(0, Math.min(newY, workspaceRect.height - draggedCanvasItem.height))
    
    setClosetCanvasItems(prev => prev.map(item => 
      item.canvasId === draggedCanvasItem.canvasId 
        ? { ...item, x: constrainedX, y: constrainedY }
        : item
    ))
  }

  const handleCanvasItemDragEnd = (e) => {
    if (draggedCanvasItem) {
      e.currentTarget.style.opacity = '1'
      e.currentTarget.style.cursor = 'move'
      console.log('✅ Finished repositioning canvas item:', draggedCanvasItem.name)
    }
    setDraggedCanvasItem(null)
    setDragOffset({ x: 0, y: 0 })
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
        img.crossOrigin = 'anonymous'; // Handle CORS
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const { data, width, height } = imageData;
            
            let minX = width, minY = height, maxX = 0, maxY = 0;
            let hasContent = false;
            
            // Find object boundaries with higher alpha threshold for better precision
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const alpha = data[(y * width + x) * 4 + 3];
                if (alpha > 128) { // Higher threshold for better precision
                  hasContent = true;
                  minX = Math.min(minX, x);
                  minY = Math.min(minY, y);
                  maxX = Math.max(maxX, x);
                  maxY = Math.max(maxY, y);
                }
              }
            }
            
            if (!hasContent) {
              reject(new Error('No content found in image'));
              return;
            }
            
            // Crop with zero padding for tighter cutouts
            const padding = 0; // Zero padding for maximum precision
            const cropX = Math.max(0, minX - padding);
            const cropY = Math.max(0, minY - padding);
            const cropWidth = Math.min(width - cropX, maxX - minX + 1 + padding * 2);
            const cropHeight = Math.min(height - cropY, maxY - minY + 1 + padding * 2);
            
            const croppedCanvas = document.createElement('canvas');
            const croppedCtx = croppedCanvas.getContext('2d');
            croppedCanvas.width = cropWidth;
            croppedCanvas.height = cropHeight;
            
            croppedCtx.drawImage(
              canvas,
              cropX, cropY, cropWidth, cropHeight,
              0, 0, cropWidth, cropHeight
            );
            
            resolve(croppedCanvas.toDataURL('image/png'));
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = dataUrl;
      } catch (error) {
        reject(error);
      }
    });
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
    
    // Get relevant closet items for the selected look (demo data for now)
    const relevantClosetItems = [
      { id: 'frame2-1', name: 'White Blouse', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop', ownedSince: 'Nov 2023', wornCount: 5 },
      { id: 'frame2-2', name: 'Black Shirt', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop', ownedSince: 'Oct 2023', wornCount: 8 },
      { id: 'frame2-3', name: 'Blue Top', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop', ownedSince: 'Sep 2023', wornCount: 3 },
      { id: 'frame2-4', name: 'Red Blouse', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop', ownedSince: 'Aug 2023', wornCount: 6 },
      { id: 'frame2-5', name: 'Green Top', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop', ownedSince: 'Jul 2023', wornCount: 4 },
      { id: 'frame2-6', name: 'Pink Pants', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop', ownedSince: 'Jun 2023', wornCount: 7 },
      { id: 'frame2-7', name: 'Denim Jacket', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop', ownedSince: 'May 2023', wornCount: 9 },
      { id: 'frame2-8', name: 'White Tee', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop', ownedSince: 'Apr 2023', wornCount: 12 },
      { id: 'frame2-9', name: 'Black Pants', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop', ownedSince: 'Mar 2023', wornCount: 6 }
    ]
    
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
                 <div 
                   className="closet-working-canvas"
                   ref={canvasRef}
                 >
                   {/* Canvas Controls (15% left) */}
                   <div className="canvas-controls">
                     <button 
                       className="control-btn" 
                       data-tooltip="Save Changes"
                       onClick={saveChanges}
                     >
                       <svg viewBox="0 0 24 24">
                         <path d="M19 12v7H5v-7M12 3v9m-3-3l3 3 3-3"/>
                       </svg>
                     </button>
                     <button 
                       className="control-btn" 
                       data-tooltip="Clear All"
                       onClick={clearAllItems}
                     >
                       <svg viewBox="0 0 24 24">
                         <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                       </svg>
                     </button>
                     <button 
                       className="control-btn" 
                       data-tooltip="Undo"
                       onClick={undoLastItem}
                     >
                       <svg viewBox="0 0 24 24">
                         <path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                       </svg>
                     </button>
                   </div>
                   
                   {/* Canvas Workspace (85% right) */}
                   <div 
                     className="canvas-workspace"
                     onDragOver={handleDragOver}
                     onDrop={handleDrop}
                     onMouseMove={handleCanvasItemDrag}
                     onMouseUp={handleCanvasItemDragEnd}
                   >
                     {closetCanvasItems.map(item => (
                       <div 
                         key={item.canvasId} 
                         className="canvas-item"
                         style={{
                           left: `${item.x}px`,
                           top: `${item.y}px`,
                           width: `${item.width}px`,
                           height: `${item.height}px`
                         }}
                         onMouseDown={(e) => handleCanvasItemDragStart(e, item)}
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
                     {closetCanvasItems.length === 0 && !isProcessing && (
                       <div className="canvas-placeholder">
                         <p>Drag & Drop from closet items to recreate your look</p>
                       </div>
                     )}
                     {isProcessing && (
                       <div className="processing-indicator">
                         <div className="processing-spinner"></div>
                         <p>Processing background removal...</p>
                       </div>
                     )}
                   </div>
                 </div>

          {/* Closet Items - Right (50%) */}
          <div className="closet-items-panel">
            <div className="closet-items-header">
              <h3>Closet</h3>
              <button 
                className="back-button"
                onClick={() => setClosetFrame2Active(false)}
                title="Back to normal view"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
            </div>
            <div className="closet-items-grid">
              {relevantClosetItems.map(item => (
                <div 
                  key={item.id} 
                  className="closet-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                >
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
            <div className="welcome-modal-content">
              <p className="welcome-modal-text">
                Your smart personalised looks for the week
              </p>
              <div className="welcome-modal-features">
                <div className="feature-item-single">
                  <div className="feature-icons">
                    <svg viewBox="0 0 24 24" className="heart-icon">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>Love looks</span>
                  </div>
                  <span className="feature-separator">•</span>
                  <div className="feature-icons">
                    <svg viewBox="0 0 24 24" className="change-icon">
                      <path d="M1 4v6h6"/>
                      <path d="M23 20v-6h-6"/>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                    </svg>
                    <span>Change looks</span>
                  </div>
                </div>
              </div>
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
