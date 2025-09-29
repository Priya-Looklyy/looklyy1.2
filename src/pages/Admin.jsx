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

        {/* Crawler Control Panel */}
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
      </div>
    </div>
  )
}

export default Admin
