import React, { useState } from 'react'

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

  const handleFacebookAuth = async () => {
    setLoading(true)
    setAuthProvider('facebook')
    
    // TODO: Implement Facebook OAuth
    // For now, simulate authentication by storing a token
    setTimeout(() => {
      console.log('👤 Facebook authentication initiated')
      // Store a mock token to simulate successful auth
      localStorage.setItem('looklyy_auth_token', 'facebook_mock_token_' + Date.now())
      // Reload to trigger auth check
      window.location.reload()
    }, 1000)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #e9d5ff 50%, #ddd6fe 75%, #c4b5fd 100%)',
        fontFamily: "'Avenir Next', sans-serif"
      }}
    >
      <div className="w-full max-w-lg">
        {/* Logo - Editorial Style */}
        <div className="text-center mb-16">
          <h1 
            className="text-6xl font-bold mb-3"
            style={{
              fontFamily: "'Nord', sans-serif",
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.15em',
              fontWeight: 800
            }}
          >
            LOOKLYY
          </h1>
          <p 
            className="text-sm tracking-wider uppercase"
            style={{
              fontFamily: "'Avenir Next', sans-serif",
              color: '#9ca3af',
              fontWeight: 300,
              letterSpacing: '0.3em',
              marginTop: '0.5rem'
            }}
          >
            Simplifying Fashion
          </p>
        </div>

        {/* Auth Section - Minimalist Editorial Layout */}
        <div className="mb-20">
          {/* Welcome Text - Magazine Style */}
          <div className="text-center mb-12">
            <h2 
              className="text-2xl mb-3"
              style={{
                fontFamily: "'Nord', sans-serif",
                color: '#1f2937',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}
            >
              Welcome
            </h2>
            <p 
              className="text-sm"
              style={{
                fontFamily: "'Avenir Next', sans-serif",
                color: '#6b7280',
                fontWeight: 300,
                letterSpacing: '0.05em',
                lineHeight: '1.8'
              }}
            >
              Sign in to continue your fashion journey
            </p>
          </div>

          {/* Social Auth Buttons - Elegant Minimalist */}
          <div className="space-y-3">
            {/* Instagram Button */}
            <button
              onClick={handleInstagramAuth}
              disabled={loading}
              className="w-full group relative overflow-hidden"
              style={{
                background: 'transparent',
                border: '1px solid rgba(147, 51, 234, 0.2)',
                borderRadius: '0',
                padding: '1.25rem 2rem',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: "'Avenir Next', sans-serif",
                fontWeight: 300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                color: '#1f2937'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.4)'
                  e.currentTarget.style.color = '#7c3aed'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.2)'
                  e.currentTarget.style.color = '#1f2937'
                }
              }}
            >
              <div className="flex items-center justify-center gap-4">
                {loading && authProvider === 'instagram' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connecting</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ transition: 'all 0.3s ease' }}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Continue with Instagram</span>
                  </>
                )}
              </div>
            </button>

            {/* Facebook Button */}
            <button
              onClick={handleFacebookAuth}
              disabled={loading}
              className="w-full group relative overflow-hidden"
              style={{
                background: 'transparent',
                border: '1px solid rgba(147, 51, 234, 0.2)',
                borderRadius: '0',
                padding: '1.25rem 2rem',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: "'Avenir Next', sans-serif",
                fontWeight: 300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                color: '#1f2937'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.4)'
                  e.currentTarget.style.color = '#7c3aed'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.2)'
                  e.currentTarget.style.color = '#1f2937'
                }
              }}
            >
              <div className="flex items-center justify-center gap-4">
                {loading && authProvider === 'facebook' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connecting</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ transition: 'all 0.3s ease' }}>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Continue with Facebook</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Footer - Minimalist */}
        <p 
          className="text-center text-xs"
          style={{
            fontFamily: "'Avenir Next', sans-serif",
            color: 'rgba(107, 114, 128, 0.6)',
            fontWeight: 300,
            letterSpacing: '0.05em',
            lineHeight: '1.6'
          }}
        >
          By continuing, you agree to Looklyy's<br />
          <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Terms of Service</span> and <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}

export default AuthFlow