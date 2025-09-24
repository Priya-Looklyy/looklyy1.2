import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Debug logging
console.log('Looklyy app starting...')
console.log('Root element:', document.getElementById('root'))

// Debug API configuration - FORCE CACHE BUST v5
console.log('🚨🚨🚨 DEBUG LOGS SHOULD BE VISIBLE NOW 🚨🚨🚨')
console.log('🔧 DEBUG - Current origin:', window.location.origin)
console.log('🔧 DEBUG - Current hostname:', window.location.hostname)
console.log('🔧 DEBUG - VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('🔧 DEBUG - Final API_BASE_URL would be:', import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`)
console.log('🚨🚨🚨 END DEBUG LOGS 🚨🚨🚨')

try {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('Looklyy app rendered successfully!')
} catch (error) {
  console.error('Error rendering Looklyy app:', error)
}
