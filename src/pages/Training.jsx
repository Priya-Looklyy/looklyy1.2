import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import '../components/Navbar.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Debug connection
if (!supabase) {
  console.warn('🔧 Supabase not configured for Training interface')
  console.log('VITE_SUPABASE_URL:', supabaseUrl)
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING')
}

const Training = () => {
  const [pendingImages, setPendingImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [trainingStats, setTrainingStats] = useState({
    approved: 0,
    rejected: 0,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load pending images that need training feedback
  const loadPendingImages = async () => {
    if (!supabase) {
      console.error('Supabase not configured')
      return
    }

    try {
      setIsLoading(true)
      
      // Try different approaches to load images for training
      let { data: images, error } = await supabase
        .from('fashion_images_new')
        .select('*')
        .order('id', { ascending: false })
        .limit(20)

      if (!error && images && images.length === 0) {
        console.log('No images found in fashion_images_new table')
      } else if (error) {
        console.log('Error fetching images:', error)
        
        // Try alternative approach if needed
        try {
          const testQuery = await supabase
            .from('fashion_images_new')
            .select('count')
            .limit(0)
            
          if (testQuery.error) {
            console.error('Database query error:', testQuery.error)
          }
        } catch (err) {
          console.error('Database connection test failed:', err)
        }
      }

      if (images && images.length > 0) {
        setPendingImages(images)
        setCurrentIndex(0)
        console.log(`✅ Loaded ${images.length} images for training`)
      } else {
        console.log('⚠️ No images found for training')
        setPendingImages([])
      }
    } catch (error) {
      console.error('Error loading training images:', error)
      setPendingImages([])
    } finally {
      setIsLoading(false)
    }
  }

  // Submit training feedback
  const submitFeedback = async (image, isApproved, category, notes) => {
    if (!supabase) return

    try {
      // Update the image with training feedback
      const { error } = await supabase
        .from('fashion_images_new')
        .update({
          training_feedback: isApproved ? 'approved' : 'rejected',
          training_category: category,
          training_notes: notes,
          needs_training: false,
          training_timestamp: new Date().toISOString()
        })
        .eq('id', image.id)

      if (!error) {
        // Remove from pending images
        const updatedPending = pendingImages.filter(img => img.id !== image.id)
        setPendingImages(updatedPending)
        
        // Update stats
        setTrainingStats(prev => ({
          approved: isApproved ? prev.approved + 1 : prev.approved,
          rejected: !isApproved ? prev.rejected + 1 : prev.rejected,
          total: prev.total + 1
        }))

        // Move to next image
        const nextIndex = currentIndex >= updatedPending.length - 1 ? 0 : currentIndex + 1
        setCurrentIndex(nextIndex)
        
        console.log(`✅ Training feedback recorded: ${isApproved ? 'Approved' : 'Rejected'}`)
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  // Mark image as approved
  const approveImage = (image) => {
    submitFeedback(image, true, 'approved', 'Manual approval - good fashion image')
  }

  // Mark image as rejected
  const rejectImage = (image) => {
    submitFeedback(image, false, 'rejected', 'Manual rejection - inappropriate content')
  }

  // Use keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (pendingImages.length === 0) return

      const currentImage = pendingImages[currentIndex]
      if (!currentImage) return

      switch(e.key) {
        case 'a':
        case 'A':
          approveImage(currentImage)
          break
        case 'r':
        case 'R':
          rejectImage(currentImage)
          break
        case 'ArrowLeft':
          setCurrentIndex(prev => prev > 0 ? prev - 1 : pendingImages.length - 1)
          break
        case 'ArrowRight':
          setCurrentIndex(prev => prev < pendingImages.length - 1 ? prev + 1 : 0)
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [pendingImages, currentIndex])

  // Load training data on mount
  useEffect(() => {
    loadPendingImages()
  }, [])

  const currentImage = pendingImages[currentIndex]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading Training Images...</h2>
          <p className="text-gray-600 mt-2">Fetching images from database...</p>
          {!supabase && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 max-w-md mx-auto">
              ⚠️ Database connection issue detected.<br/>
              Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
            </div>
          )}
        </div>
      </div>
    )
  }

  if (pendingImages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">📋 No Images Found</h1>
          <p className="text-gray-600 mb-4">No images found for training feedback.</p>
          <p className="text-sm text-gray-500 mb-8">
            {!supabase ? 'Check database configuration.' : 'Try running the crawler first to get images.'}
          </p>
          
          <div className="space-x-4">
            <button 
              onClick={loadPendingImages}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              🔄 Refresh Training Queue
            </button>
            <button 
              onClick={loadPendingImages}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              📋 Load Recent Images
            </button>
          </div>
          
          {!supabase && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 max-w-md mx-auto">
              <strong>Database Issue:</strong><br/>
              VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY required for training.
              <br/><br/>
              <a href="/admin" className="text-blue-600 underline">Go to Admin to run crawler</a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🧠 Crawler Training Center</h1>
              <p className="text-gray-600">Teach the crawler which images are good or bad</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{currentIndex + 1} / {pendingImages.length}</div>
              <div className="text-sm text-gray-500">Images Remaining</div>
            </div>
          </div>

          {/* Training Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{trainingStats.approved}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{trainingStats.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{trainingStats.total}</div>
              <div className="text-sm text-gray-600">Total Trained</div>
            </div>
          </div>
        </div>

        {/* Training Interface */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 block">
            Current Image - <kbd className="bg-gray-100 px-2 py-1 rounded">A</kbd>pprove / <kbd className="bg-gray-100 px-2 py-1 rounded">R</kbd>eject
          </h2>
          
          {/* Debug Info */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
            <strong>Debug:</strong> Images loaded: {pendingImages.length}, Current index: {currentImageIndex}, 
            Current image: {currentImage ? 'Yes' : 'No'}
            {currentImage && (
              <div className="mt-1">
                <strong>Image URL:</strong> {currentImage.original_url}
              </div>
            )}
          </div>

          {currentImage && (
            <>
              {/* Current Image */}
              <div className="flex gap-6">
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <img 
                      src={currentImage.original_url} 
                      alt={currentImage.description || 'Training image'}
                      className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg mx-auto block"
                      onError={(e) => {
                        console.log('Image failed to load:', currentImage.original_url)
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'
                      }}
                      onLoad={() => console.log('Image loaded successfully:', currentImage.original_url)}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p><strong>URL:</strong> <span className="text-gray-600 text-sm break-all">{currentImage.original_url}</span></p>
                    <p><strong>Description:</strong> {currentImage.description || 'No description'}</p>
                    <p><strong>Category:</strong> {currentImage.category || 'Unknown'}</p>
                  </div>
                </div>

                {/* Decision Panel */}
                <div className="w-80">
                  <h3 className="font-bold text-gray-900 mb-4">Feedback Required</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => approveImage(currentImage)}
                        className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-center font-bold text-lg"
                      >
                        ✅ GOOD
                        <div className="text-sm font-normal mt-1">Press A</div>
                      </button>
                      
                      <button 
                        onClick={() => rejectImage(currentImage)}
                        className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition text-center font-bold text-lg"
                      >
                        ❌ BAD
                        <div className="text-sm font-normal mt-1">Press R</div>
                      </button>
                    </div>

                    {/* Navigation */}
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">
                        Navigate: <span className="font-mono bg-gray-100 px-2 py-1 rounded">←</span> <span className="font-mono bg-gray-100 px-2 py-1 rounded">→</span>
                      </div>
                    </div>

                    {/* Why sections for additional training data */}
                    <details className="border border-gray-200 rounded-lg p-3">
                      <summary className="font-bold cursor-pointer">🎯 Training Details (Optional)</summary>
                      <div className="mt-2 space-y-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Special Issue:</label>
                          <select className="w-full border rounded px-2 py-1 text-sm">
                            <option value="">Select if applicable</option>
                            <option value="face_shot">Contains Face/Portrait</option>
                            <option value="poster_campaign">Movie Poster/Campaign</option>
                            <option value="collage_montage">Collage/Montage</option>
                            <option value="wrong_content">Wrong Content Type</option>
                            <option value="quality_too_low">Poor Quality</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Notes:</label>
                          <textarea 
                            className="w-full border rounded px-2 py-1 text-sm" 
                            rows="2"
                            placeholder="Additional feedback..."
                          ></textarea>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Learnings Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🧠 Learning Insights</h2>
          <div className="text-gray-600 space-y-2">
            <p>Your feedback helps improve the crawler's filtering algorithm</p>
            <p>Each decision trains the system to better identify appropriate fashion content</p>
            <p><strong>Tips:</strong> Look for full-body fashion shots only, avoid faces, refresh samples for variety</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Training
