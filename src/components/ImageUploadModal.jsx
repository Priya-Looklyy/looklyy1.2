import React, { useState, useRef } from 'react'
import { getAllSliders, updateSliderImages } from '../data/fashionDatabase'
import './ImageUploadModal.css'

const ImageUploadModal = ({ isOpen, onClose, onImagesUpdated }) => {
  const [uploadedImages, setUploadedImages] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const sliders = getAllSliders()

  // Handle file selection
  const handleFileSelect = (files) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
    )

    if (imageFiles.length === 0) {
      alert('Please select only image files (JPEG, PNG, GIF, WebP)')
      return
    }

    if (imageFiles.length > 25) {
      alert('Please select no more than 25 images')
      return
    }

    // Convert files to preview URLs and organize by slider
    const newImages = imageFiles.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      url: URL.createObjectURL(file),
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      size: file.size,
      type: file.type
    }))

    setUploadedImages(newImages)
  }

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  // Handle file input change
  const handleInputChange = (e) => {
    const files = e.target.files
    handleFileSelect(files)
  }

  // Distribute images across sliders (5 images per slider)
  const distributeImagesAcrossSliders = () => {
    const imagesPerSlider = 5
    const sliderKeys = ['slider1', 'slider2', 'slider3', 'slider4', 'slider5']
    
    sliderKeys.forEach((sliderKey, sliderIndex) => {
      const startIndex = sliderIndex * imagesPerSlider
      const endIndex = startIndex + imagesPerSlider
      const sliderImages = uploadedImages.slice(startIndex, endIndex)
      
      if (sliderImages.length > 0) {
        // Convert to the format expected by the database
        const formattedImages = sliderImages.map((img, index) => ({
          id: startIndex + index + 1,
          url: img.url, // This will be the object URL from file
          alt: `${sliders[sliderIndex].title} ${index + 1}`,
          file: img.file // Keep reference to file for actual upload
        }))
        
        updateSliderImages(sliderIndex + 1, formattedImages)
      }
    })
  }

  // Handle upload
  const handleUpload = async () => {
    if (uploadedImages.length === 0) {
      alert('Please select images to upload')
      return
    }

    if (uploadedImages.length !== 25) {
      const confirmUpload = confirm(`You have selected ${uploadedImages.length} images. The system expects 25 images (5 per slider). Do you want to continue?`)
      if (!confirmUpload) return
    }

    setUploading(true)

    try {
      // For now, we'll just update the local database
      // In a real implementation, you'd upload to a server here
      distributeImagesAcrossSliders()
      
      // Call the callback to refresh the homepage
      onImagesUpdated()
      onClose()
      
      alert(`Successfully updated ${uploadedImages.length} images across 5 sliders!`)
      
      // Clean up object URLs
      uploadedImages.forEach(img => URL.revokeObjectURL(img.url))
      setUploadedImages([])
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Remove an image from the upload list
  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    URL.revokeObjectURL(uploadedImages[index].url) // Clean up object URL
    setUploadedImages(newImages)
  }

  // Clear all images
  const clearAllImages = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.url))
    setUploadedImages([])
  }

  if (!isOpen) return null

  return (
    <div className="image-upload-modal-overlay">
      <div className="image-upload-modal">
        <div className="modal-header">
          <h2>Upload Homepage Fashion Images</h2>
          <p>Upload up to 25 images for the homepage sliders (5 images per slider)</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Upload Area */}
          <div 
            className={`upload-area ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-content">
              <div className="upload-icon">📷</div>
              <h3>Drag & Drop Images Here</h3>
              <p>or click to select files</p>
              <p className="upload-hint">Supports: JPEG, PNG, GIF, WebP (Max 25 images)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Image Preview Grid */}
          {uploadedImages.length > 0 && (
            <div className="images-preview">
              <div className="preview-header">
                <h3>Selected Images ({uploadedImages.length}/25)</h3>
                <div className="preview-actions">
                  <button className="clear-btn" onClick={clearAllImages}>
                    Clear All
                  </button>
                  <button 
                    className="upload-btn" 
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Images'}
                  </button>
                </div>
              </div>
              
              <div className="images-grid">
                {uploadedImages.map((img, index) => (
                  <div key={img.id} className="image-preview-item">
                    <div className="slider-label">
                      Slider {Math.floor(index / 5) + 1}
                    </div>
                    <img src={img.url} alt={img.name} />
                    <div className="image-info">
                      <div className="image-name">{img.name}</div>
                      <div className="image-size">
                        {(img.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Show empty slots if less than 25 images */}
              {uploadedImages.length < 25 && (
                <div className="empty-slots">
                  {Array.from({ length: 25 - uploadedImages.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="empty-slot">
                      <div className="empty-slot-icon">+</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          {uploadedImages.length > 0 && (
            <button 
              className="confirm-btn" 
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : `Upload ${uploadedImages.length} Images`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUploadModal
