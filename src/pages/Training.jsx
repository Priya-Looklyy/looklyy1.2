import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import './Training.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

const Training = () => {
  const [images, setImages] = useState([])
  const [displayedImages, setDisplayedImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [trainingStats, setTrainingStats] = useState({ approved: 0, rejected: 0, duplicates: 0 })
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const observerTarget = useRef(null)
  
  const IMAGES_PER_PAGE = 50

  // Load all images from the database
  const loadImages = async () => {
    if (!supabase) {
      console.error('Supabase not configured')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      // Fetch ALL images from fashion_images_new (same as trending page)
      const { data, error } = await supabase
        .from('fashion_images_new')
        .select('*')
        .order('id', { ascending: false })
        .limit(500) // Get up to 500 images

      if (error) {
        console.error('Error fetching images:', error)
        return
      }

      console.log(`✅ Loaded ${data?.length || 0} images for training`)
      setImages(data || [])
      
      // Initialize first page
      setDisplayedImages(data?.slice(0, IMAGES_PER_PAGE) || [])
      setPage(0)
      setHasMore(data && data.length > IMAGES_PER_PAGE)
      
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load more images for infinite scroll
  const loadMoreImages = () => {
    if (!hasMore || isLoading) return

    const nextPage = page + 1
    const start = nextPage * IMAGES_PER_PAGE
    const end = start + IMAGES_PER_PAGE
    const newImages = images.slice(start, end)

    if (newImages.length > 0) {
      setDisplayedImages(prev => [...prev, ...newImages])
      setPage(nextPage)
      setHasMore(end < images.length)
    } else {
      setHasMore(false)
    }
  }

  // Handle training action (approve, reject, duplicate)
  const handleTrainingAction = async (image, action) => {
    if (!supabase) return

    try {
      const actionMap = {
        approve: { status: 'approved', feedback: 'approved', stat: 'approved' },
        reject: { status: 'rejected', feedback: 'rejected', stat: 'rejected' },
        duplicate: { status: 'rejected', feedback: 'duplicate', stat: 'duplicates' }
      }

      const { status, feedback, stat } = actionMap[action]

      // Update image status in database
      const { error } = await supabase
        .from('fashion_images_new')
        .update({
          training_status: status,
          training_feedback: feedback,
          training_timestamp: new Date().toISOString(),
          needs_training: false
        })
        .eq('id', image.id)

      if (!error) {
        // Update stats
        setTrainingStats(prev => ({
          ...prev,
          [stat]: prev[stat] + 1
        }))

        // Add visual feedback
        const imageElement = document.getElementById(`training-image-${image.id}`)
        if (imageElement) {
          imageElement.style.opacity = '0.3'
          imageElement.style.transform = 'scale(0.95)'
        }

        console.log(`✅ Image ${image.id} marked as ${action}`)
      } else {
        console.error('Error updating image:', error)
      }
    } catch (error) {
      console.error('Error handling training action:', error)
    }
  }

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreImages()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, isLoading, page])

  useEffect(() => {
    loadImages()
  }, [])

  if (isLoading && displayedImages.length === 0) {
    return (
      <div className="training-page">
        <div className="training-loading">
          <div className="loading-spinner"></div>
          <h2>Loading Training Images...</h2>
          <p>Fetching images from the crawler database</p>
        </div>
      </div>
    )
  }

  return (
    <div className="training-page">
      {/* Header */}
      <div className="training-header">
        <div className="training-header-content">
          <div className="training-title-section">
            <h1>🎯 Crawler Training Center</h1>
            <p>Refine the model by approving, rejecting, or marking duplicates - v2.0</p>
          </div>
          
          {/* Stats */}
          <div className="training-stats">
            <div className="stat-card stat-approved">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{trainingStats.approved}</div>
                <div className="stat-label">Approved</div>
              </div>
            </div>
            <div className="stat-card stat-rejected">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <div className="stat-value">{trainingStats.rejected}</div>
                <div className="stat-label">Rejected</div>
              </div>
            </div>
            <div className="stat-card stat-duplicates">
              <div className="stat-icon">🔁</div>
              <div className="stat-content">
                <div className="stat-value">{trainingStats.duplicates}</div>
                <div className="stat-label">Duplicates</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="training-container">
        {/* Debug Info */}
        <div style={{padding: '10px', background: '#f0f0f0', marginBottom: '20px', borderRadius: '8px'}}>
          <strong>Debug:</strong> Showing {displayedImages.length} of {images.length} images | 
          Has more: {hasMore ? 'Yes' : 'No'} | Page: {page + 1}
        </div>
        
        {displayedImages.length === 0 ? (
          <div className="training-empty">
            <div className="empty-icon">📭</div>
            <h2>No Images Available</h2>
            <p>Run the crawler to fetch images for training</p>
            <a href="/admin" className="btn-primary">Go to Admin</a>
          </div>
        ) : (
          <>
            <div className="training-grid">
              {displayedImages.map((image) => (
                <div 
                  key={image.id} 
                  id={`training-image-${image.id}`}
                  className="training-image-card"
                >
                  <div className="training-image-wrapper">
                    <img 
                      src={image.original_url} 
                      alt={image.title || 'Fashion image'}
                      className="training-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgVW5hdmFpbGFibGU8L3RleHQ+PC9zdmc+'
                      }}
                    />
                    
                    {/* Overlay Actions */}
                    <div className="training-overlay">
                      <button 
                        className="training-action training-action-approve"
                        onClick={() => handleTrainingAction(image, 'approve')}
                        title="Approve this image"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </button>
                      
                      <button 
                        className="training-action training-action-reject"
                        onClick={() => handleTrainingAction(image, 'reject')}
                        title="Reject this image"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                      
                      <button 
                        className="training-action training-action-duplicate"
                        onClick={() => handleTrainingAction(image, 'duplicate')}
                        title="Mark as duplicate"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10"></polyline>
                          <polyline points="1 20 1 14 7 14"></polyline>
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="training-image-info">
                    <h3 className="training-image-title">{image.title || 'Untitled'}</h3>
                    <p className="training-image-category">{image.category || 'fashion'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="scroll-trigger">
              {hasMore && (
                <div className="loading-more">
                  <div className="loading-spinner-small"></div>
                  <p>Loading more images...</p>
                  <button 
                    onClick={loadMoreImages}
                    className="btn-primary"
                    style={{marginTop: '20px'}}
                  >
                    Load More Images
                  </button>
                </div>
              )}
              {!hasMore && displayedImages.length > 0 && (
                <div className="end-message">
                  <p>✨ You've reached the end! Total images: {images.length}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Training
