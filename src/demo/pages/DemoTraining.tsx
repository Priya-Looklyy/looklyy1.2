import React, { useState } from 'react'
import { useDemoMode } from '../DemoProvider'

export const DemoTraining: React.FC = () => {
  const { trainingImages, submitTrainingFeedback } = useDemoMode()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stats, setStats] = useState({ approved: 0, rejected: 0, duplicates: 0 })
  const [removing, setRemoving] = useState(false)

  const currentImage = trainingImages[currentIndex]

  const handleAction = (action: 'approve' | 'reject' | 'duplicate') => {
    if (!currentImage || removing) return

    setRemoving(true)
    
    // Update stats
    setStats(prev => ({
      ...prev,
      [action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'duplicates']: prev[action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'duplicates'] + 1
    }))

    // Submit feedback
    submitTrainingFeedback(currentImage.id, action)

    // Move to next image after animation
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setRemoving(false)
    }, 500)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'a' || e.key === 'A') handleAction('approve')
    if (e.key === 'r' || e.key === 'R') handleAction('reject')
    if (e.key === 'd' || e.key === 'D') handleAction('duplicate')
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex])

  if (currentIndex >= trainingImages.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Training Complete!</h2>
          <p className="text-gray-600 mb-6">
            You've reviewed all available images
          </p>
          
          {/* Stats Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Session Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-xs text-gray-600">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-xs text-gray-600">Rejected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.duplicates}</div>
                <div className="text-xs text-gray-600">Duplicates</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentIndex(0)
              setStats({ approved: 0, rejected: 0, duplicates: 0 })
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Start New Training Session
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Training Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Review images to train the AI • {currentIndex + 1} of {trainingImages.length}
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.approved}</div>
              <div className="text-xs text-gray-600">✓</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.rejected}</div>
              <div className="text-xs text-gray-600">✗</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.duplicates}</div>
              <div className="text-xs text-gray-600">⊗</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / trainingImages.length) * 100}%` }}
          />
        </div>

        {/* Main Training Card */}
        {currentImage && (
          <div 
            className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${removing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          >
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Image */}
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={currentImage.original_url}
                  alt={currentImage.title}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: '600px' }}
                />
              </div>

              {/* Details & Actions */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentImage.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {currentImage.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                      {currentImage.category.replace('-', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium capitalize">
                      {currentImage.subcategory?.replace('-', ' ') || 'Trending'}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      {Math.round(currentImage.trendScore * 100)}% Trend Score
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleAction('approve')}
                    className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve (Press A)
                  </button>

                  <button
                    onClick={() => handleAction('reject')}
                    className="w-full px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject (Press R)
                  </button>

                  <button
                    onClick={() => handleAction('duplicate')}
                    className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Mark as Duplicate (Press D)
                  </button>
                </div>

                {/* Keyboard Shortcuts Help */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                  <strong>Keyboard Shortcuts:</strong> A = Approve, R = Reject, D = Duplicate
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
