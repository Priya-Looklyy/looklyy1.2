import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Debug logging
console.log('Looklyy app starting...')
console.log('Root element:', document.getElementById('root'))

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
