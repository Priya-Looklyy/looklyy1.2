import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [crawlStatus, setCrawlStatus] = useState(null)
  const [crawlHistory, setCrawlHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  // Training state
  const [activeTab, setActiveTab] = useState('crawler') // 'crawler', 'training', 'preview'
  const [trainingQueue, setTrainingQueue] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [trainingStats, setTrainingStats] = useState({ approved: 0, rejected: 0, total: 0 })
  const [threshold, setThreshold] = useState(0.35)
  const [previewData, setPreviewData] = useState({ wouldShow: 0, wouldHide: 0, total: 0 })
  const [rules, setRules] = useState(null)

  // Simple password authentication
  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'looklyy-admin-2024') {
      setIsAuthenticated(true)
      setMessage('')
    } else {
      setMessage('Invalid password')
    }
  }

  // Fetch crawl status and history
  const fetchCrawlData = async () => {
    if (!supabase) return

    try {
      // Get latest crawl results from fashion_images_new table instead
      const { data: images, error } = await supabase
        .from('fashion_images_new')
        .select('*')
        .order('id', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching recent images:', error)
        return
      }

      // Convert images to crawl history format
      const crawlHistory = images && images.length > 0 ? [{
        id: 'latest',
        crawl_date: new Date().toISOString(),
        images_found: images.length,
        images_stored: images.length,
        status: 'completed'
      }] : []
      
      setCrawlHistory(crawlHistory)
      
      // Set current status from latest data
      if (images && images.length > 0) {
        setCrawlStatus({
          id: 'latest',
          crawl_date: new Date().toISOString(),
          images_found: images.length,
          images_stored: images.length,
          status: 'completed'
        })
      }
    } catch (error) {
      console.error('Error fetching crawl data:', error)
    }
  }

  // Training functions
  const fetchTrainingQueue = async () => {
    try {
      const response = await fetch('/api/training/queue')
      const data = await response.json()
      if (data.success) {
        setTrainingQueue(data.images || [])
        setCurrentImageIndex(0)
      }
    } catch (error) {
      console.error('Error fetching training queue:', error)
    }
  }

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/training/compile-rules', { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        setRules(data.rules)
      }
    } catch (error) {
      console.error('Error fetching rules:', error)
    }
  }

  const submitTrainingFeedback = async (imageId, approved, reason = '') => {
    try {
      const response = await fetch('/api/training/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, approved, reason })
      })
      const data = await response.json()
      
      if (data.success) {
        // Update stats
        setTrainingStats(prev => ({
          approved: approved ? prev.approved + 1 : prev.approved,
          rejected: !approved ? prev.rejected + 1 : prev.rejected,
          total: prev.total + 1
        }))
        
        // Remove from queue
        setTrainingQueue(prev => prev.filter(img => img.id !== imageId))
        
        // Move to next image
        setCurrentImageIndex(prev => Math.min(prev, trainingQueue.length - 2))
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  const calculatePreview = async () => {
    if (!supabase) return
    
    try {
      const { data: images, error } = await supabase
        .from('fashion_images_new')
        .select('score, training_status')
        .not('score', 'is', null)
        .limit(1000)

      if (error) return

      const wouldShow = images.filter(img => 
        img.training_status === 'approved' || (img.score && img.score >= threshold)
      ).length
      
      const wouldHide = images.length - wouldShow
      
      setPreviewData({ wouldShow, wouldHide, total: images.length })
    } catch (error) {
      console.error('Error calculating preview:', error)
    }
  }

  // Manual crawl trigger
  const triggerCrawl = async () => {
    setIsLoading(true)
    setMessage('Starting manual crawl...')
    
    try {
      const response = await fetch('/api/crawler/harper-bazaar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage(`✅ Crawl completed: ${result.results.total_images_found} images found, ${result.results.images_stored} stored`)
        fetchCrawlData() // Refresh data
      } else {
        setMessage(`❌ Crawl failed: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Setup database
  const setupDatabase = async () => {
    setIsLoading(true)
    setMessage('Setting up database...')
    
    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage('✅ Database setup completed')
      } else {
        setMessage(`❌ Setup failed: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchCrawlData()
      // Refresh data every 30 seconds
      const interval = setInterval(fetchCrawlData, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Training effects
  useEffect(() => {
    if (isAuthenticated && activeTab === 'training') {
      fetchTrainingQueue()
      fetchRules()
    }
  }, [isAuthenticated, activeTab])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'preview') {
      calculatePreview()
    }
  }, [isAuthenticated, activeTab, threshold])

  // Keyboard shortcuts for training
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (activeTab !== 'training' || trainingQueue.length === 0) return

      const currentImage = trainingQueue[currentImageIndex]
      if (!currentImage) return

      switch(e.key.toLowerCase()) {
        case 'a':
          e.preventDefault()
          submitTrainingFeedback(currentImage.id, true, 'approved')
          break
        case 'r':
          e.preventDefault()
          submitTrainingFeedback(currentImage.id, false, 'rejected')
          break
        case 'arrowleft':
          e.preventDefault()
          setCurrentImageIndex(prev => Math.max(0, prev - 1))
          break
        case 'arrowright':
          e.preventDefault()
          setCurrentImageIndex(prev => Math.min(trainingQueue.length - 1, prev + 1))
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [activeTab, trainingQueue, currentImageIndex])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold text-center mb-6">Looklyy Admin</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
            {message && (
              <p className="mt-2 text-sm text-red-600 text-center">{message}</p>
            )}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Looklyy Admin Dashboard</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          
          {message && (
            <div className={`p-4 rounded-md mb-4 ${
              message.includes('✅') ? 'bg-green-100 text-green-800' : 
              message.includes('❌') ? 'bg-red-100 text-red-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('crawler')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'crawler' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🚀 Crawler Control
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'training' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎯 Training Queue
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'preview' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👁️ Preview & Rules
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'crawler' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Crawler Control</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={triggerCrawl}
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Running...' : '🚀 Run Crawler Now'}
            </button>
            
            <button
              onClick={setupDatabase}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Setting up...' : '🔧 Setup Database'}
            </button>
            
            <button
              onClick={fetchCrawlData}
              className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700"
            >
              🔄 Refresh Data
            </button>
          </div>

          {/* Current Status */}
          {crawlStatus && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Latest Crawl Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-semibold ${
                    crawlStatus.status === 'success' ? 'text-green-600' :
                    crawlStatus.status === 'partial' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {crawlStatus.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Images Found</p>
                  <p className="font-semibold text-blue-600">{crawlStatus.images_found}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Images Stored</p>
                  <p className="font-semibold text-green-600">{crawlStatus.images_stored}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Crawl</p>
                  <p className="font-semibold text-gray-600">
                    {new Date(crawlStatus.crawl_date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Crawl History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Crawl History</h2>
          
          {crawlHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No crawl history available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Images Found
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Images Stored
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Errors
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {crawlHistory.map((log, index) => (
                    <tr key={log.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.crawl_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.status === 'success' ? 'bg-green-100 text-green-800' :
                          log.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.images_found}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.images_stored}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.errors ? log.errors.length : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Training Queue</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Approved: <span className="text-green-600 font-semibold">{trainingStats.approved}</span>
                </span>
                <span className="text-sm text-gray-600">
                  Rejected: <span className="text-red-600 font-semibold">{trainingStats.rejected}</span>
                </span>
                <span className="text-sm text-gray-600">
                  Total: <span className="text-blue-600 font-semibold">{trainingStats.total}</span>
                </span>
              </div>
            </div>

            {trainingQueue.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Images in Training Queue</h3>
                <p className="text-gray-600 mb-4">Run the crawler to generate images for training</p>
                <button
                  onClick={() => setActiveTab('crawler')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                >
                  Go to Crawler
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Display */}
                <div className="bg-gray-50 rounded-lg p-4">
                  {trainingQueue[currentImageIndex] && (
                    <>
                      <img 
                        src={trainingQueue[currentImageIndex].original_url} 
                        alt={trainingQueue[currentImageIndex].title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg'
                        }}
                      />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">{trainingQueue[currentImageIndex].title}</h3>
                        <p className="text-sm text-gray-600">{trainingQueue[currentImageIndex].description}</p>
                        <p className="text-sm text-gray-500">Category: {trainingQueue[currentImageIndex].category}</p>
                        {trainingQueue[currentImageIndex].score && (
                          <p className="text-sm text-gray-500">
                            Score: <span className={`font-semibold ${
                              trainingQueue[currentImageIndex].score >= 0.35 ? 'text-green-600' :
                              trainingQueue[currentImageIndex].score >= 0.15 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {trainingQueue[currentImageIndex].score.toFixed(2)}
                            </span>
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Training Controls */}
                <div className="space-y-4">
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Training Actions</h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => submitTrainingFeedback(trainingQueue[currentImageIndex]?.id, true, 'approved')}
                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition flex items-center justify-center space-x-2"
                      >
                        <span>✅</span>
                        <span>GOOD (A)</span>
                      </button>
                      <button
                        onClick={() => submitTrainingFeedback(trainingQueue[currentImageIndex]?.id, false, 'rejected')}
                        className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition flex items-center justify-center space-x-2"
                      >
                        <span>❌</span>
                        <span>BAD (R)</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Navigation</h4>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                        disabled={currentImageIndex === 0}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
                      >
                        ← Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        {currentImageIndex + 1} of {trainingQueue.length}
                      </span>
                      <button
                        onClick={() => setCurrentImageIndex(Math.min(trainingQueue.length - 1, currentImageIndex + 1))}
                        disabled={currentImageIndex === trainingQueue.length - 1}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
                      >
                        Next →
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Keyboard Shortcuts</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><kbd className="bg-blue-100 px-2 py-1 rounded">A</kbd> - Approve image</p>
                      <p><kbd className="bg-blue-100 px-2 py-1 rounded">R</kbd> - Reject image</p>
                      <p><kbd className="bg-blue-100 px-2 py-1 rounded">←</kbd> - Previous image</p>
                      <p><kbd className="bg-blue-100 px-2 py-1 rounded">→</kbd> - Next image</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Preview Controls */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview & Rules</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Threshold Control</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Score Threshold: {threshold.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={threshold}
                        onChange={(e) => setThreshold(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.00 (Show All)</span>
                        <span>1.00 (Strict)</span>
                      </div>
                    </div>
                    <button
                      onClick={calculatePreview}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                    >
                      🔄 Refresh Preview
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Preview Results</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Would Show:</span>
                      <span className="text-green-600 font-semibold text-lg">{previewData.wouldShow}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Would Hide:</span>
                      <span className="text-red-600 font-semibold text-lg">{previewData.wouldHide}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Images:</span>
                      <span className="text-blue-600 font-semibold text-lg">{previewData.total}</span>
                    </div>
                    {previewData.total > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(previewData.wouldShow / previewData.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {((previewData.wouldShow / previewData.total) * 100).toFixed(1)}% would be shown
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Rules Information */}
            {rules && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Current Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Positive Signals</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {rules.lists?.positiveKeywords?.map((keyword, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>{keyword}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Negative Signals</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {rules.lists?.negativeKeywords?.slice(0, 8).map((keyword, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <span>{keyword}</span>
                        </li>
                      ))}
                      {rules.lists?.negativeKeywords?.length > 8 && (
                        <li className="text-gray-500 text-xs">... and {rules.lists.negativeKeywords.length - 8} more</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Rule Version:</strong> {rules.version} | 
                    <strong> Last Updated:</strong> {new Date(rules.version).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
