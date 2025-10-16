import React, { useState } from 'react'
import { mockCrawlerStats, mockTrainingStats, mockReviewSession } from '../data/mockImages'

export const DemoAdmin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('crawler')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'demo' || password === 'looklyy-admin-2024') {
      setIsAuthenticated(true)
      setMessage('')
    } else {
      setMessage('Invalid password (hint: use "demo")')
    }
  }

  const handleCrawlerAction = (action: string) => {
    setLoading(true)
    setMessage(`${action}...`)
    
    setTimeout(() => {
      setLoading(false)
      if (action === '🚀 Running Crawler') {
        setMessage(`✅ Crawler completed! Found ${mockCrawlerStats.images_stored} images from ${mockCrawlerStats.pages_crawled} pages`)
      } else if (action === '🧠 Applying Training') {
        setMessage(`✅ Training applied! Removed ${mockTrainingStats.rejected + mockTrainingStats.duplicates} images, kept ${mockTrainingStats.approved} approved`)
      } else {
        setMessage(`✅ ${action} completed successfully`)
      }
    }, 2000)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-center">
            <p className="text-purple-800 font-semibold text-sm">
              🎭 DEMO ADMIN - Use password: "demo"
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Dashboard</h1>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {message && (
                <p className="text-red-600 text-sm">{message}</p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #e9d5ff 50%, #ddd6fe 75%, #c4b5fd 100%)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage crawler, training, and system settings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'crawler', icon: '🚀', label: 'Crawler Control' },
              { id: 'training', icon: '🎯', label: 'Training Stats' },
              { id: 'stats', icon: '📊', label: 'System Stats' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'crawler' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Crawler Control</h2>
              
              {message && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                  {message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleCrawlerAction('🚀 Running Crawler')}
                  disabled={loading}
                  className="px-6 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  🚀 Run Crawler Now
                </button>

                <button
                  onClick={() => handleCrawlerAction('🧠 Applying Training')}
                  disabled={loading}
                  className="px-6 py-4 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  🧠 Apply Training
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{mockCrawlerStats.total_images}</div>
                  <div className="text-sm text-gray-600">Total Images</div>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="text-3xl font-bold text-pink-600">{mockCrawlerStats.pages_crawled}</div>
                  <div className="text-sm text-gray-600">Pages Crawled</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{mockCrawlerStats.images_stored}</div>
                  <div className="text-sm text-gray-600">Images Stored</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{mockCrawlerStats.success_rate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Training Statistics</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{mockTrainingStats.total_reviewed}</div>
                  <div className="text-sm text-gray-600">Total Reviewed</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{mockTrainingStats.approved}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{mockTrainingStats.rejected}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{mockTrainingStats.duplicates}</div>
                  <div className="text-sm text-gray-600">Duplicates</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{mockTrainingStats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Current Training Session</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session ID:</span>
                    <span className="font-medium">{mockReviewSession.session_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">{mockReviewSession.images_reviewed} / {mockReviewSession.total_images}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize text-green-600">{mockReviewSession.status}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">System Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>API Response Time</span>
                      <span className="font-bold text-green-600">120ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database Queries</span>
                      <span className="font-bold">1,245</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache Hit Rate</span>
                      <span className="font-bold text-green-600">94%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">System Health</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Database</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Healthy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Crawler</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
