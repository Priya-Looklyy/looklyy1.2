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
      // Store a mock token to simulate successful auth
      localStorage.setItem('looklyy_auth_token', 'instagram_mock_token_' + Date.now())
      // Reload to trigger auth check
      window.location.reload()
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

        {/* Login with Instagram Button */}
        <button
          className={`login-button ${loading ? 'loading' : ''}`}
          onClick={handleInstagramAuth}
          disabled={loading}
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
            <span>Login with Instagram</span>
          )}
        </button>

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
