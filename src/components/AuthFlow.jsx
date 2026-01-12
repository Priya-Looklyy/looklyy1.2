import React, { useState } from 'react'
import './AuthFlow.css'

const AuthFlow = () => {
  const [loading, setLoading] = useState(false)
  const [authProvider, setAuthProvider] = useState(null)

  const handleInstagramAuth = async () => {
    setLoading(true)
    setAuthProvider('instagram')
    
    // TODO: Implement Instagram OAuth
    // For now, simulate authentication by storing a token
    setTimeout(() => {
      console.log('📸 Instagram authentication initiated')
      // Store a mock token using the correct key that AuthContext expects
      const mockToken = 'instagram_mock_token_' + Date.now()
      localStorage.setItem('looklyy_token', mockToken)
      console.log('✅ Token stored:', mockToken)
      // Small delay to ensure token is stored, then reload to trigger auth check
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }, 1000)
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setAuthProvider('google')
    
    // TODO: Implement Google OAuth
    // For now, simulate authentication by storing a token
    setTimeout(() => {
      console.log('🔵 Google authentication initiated')
      // Store a mock token using the correct key that AuthContext expects
      const mockToken = 'google_mock_token_' + Date.now()
      localStorage.setItem('looklyy_token', mockToken)
      console.log('✅ Token stored:', mockToken)
      // Small delay to ensure token is stored, then reload to trigger auth check
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }, 1000)
  }

  return (
    <div className="auth-flow-container">
      {/* Login Panel */}
      <div className="login-panel">
        {/* LOOKLYY Logo - Top section */}
        <div className="logo-container">
          <h1 className="logo-text">LOOKLYY</h1>
        </div>

        {/* Login Buttons Container */}
        <div className="login-buttons-container">
          {/* Login with Instagram Button */}
          <button
            className={`login-button ${loading && authProvider === 'instagram' ? 'loading' : ''}`}
            onClick={handleInstagramAuth}
            disabled={loading && authProvider === 'instagram'}
            aria-label="Login with Instagram"
          >
            {loading && authProvider === 'instagram' ? (
              <svg 
                className="spinner" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                {/* Instagram Icon */}
                <svg 
                  className="login-icon" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
                    fill="#E4405F"
                  />
                </svg>
                <span>Login with Instagram</span>
              </>
            )}
          </button>

          {/* Login with Google Button */}
          <button
            className={`login-button ${loading && authProvider === 'google' ? 'loading' : ''}`}
            onClick={handleGoogleAuth}
            disabled={loading && authProvider === 'google'}
            aria-label="Login with Google"
          >
            {loading && authProvider === 'google' ? (
              <svg 
                className="spinner" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                {/* Google Icon */}
                <svg 
                  className="login-icon" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                    fill="#4285F4"
                  />
                  <path 
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                    fill="#34A853"
                  />
                  <path 
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                    fill="#FBBC05"
                  />
                  <path 
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                    fill="#EA4335"
                  />
                </svg>
                <span>Login with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Fine Print - Bottom of Panel */}
        <p className="fine-print">
          By continuing, you agree to our{' '}
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="fine-print-link"
          >
            Terms of Service
          </a>
          {' '}and{' '}
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="fine-print-link"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default AuthFlow
