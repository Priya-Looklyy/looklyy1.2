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
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: '#ffffff',
        fontFamily: "'Avenir Next', sans-serif",
        height: '100vh',
        width: '100vw',
        padding: 0,
        margin: 0
      }}
    >
      {/* Main Content - Centered Like Instagram */}
      <div 
        className="flex flex-col items-center justify-center flex-1"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem'
        }}
      >
        {/* LOOKLYY Logo - Large and Centered, Similar to Instagram Logo Size */}
        <div 
          className="text-center mb-16"
          style={{
            marginBottom: '4rem'
          }}
        >
          <h1 
            style={{
              fontFamily: "'Nord', sans-serif",
              fontSize: '3.5rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.15em',
              margin: 0,
              lineHeight: '1.1'
            }}
          >
            LOOKLYY
          </h1>
          <p 
            style={{
              fontFamily: "'Avenir Next', 'Avenir Next Regular', 'Avenir Next Light', sans-serif",
              fontSize: '0.875rem',
              margin: '0.5rem 0 0 0',
              color: '#9ca3af',
              letterSpacing: '0.3px',
              textTransform: 'none',
              fontWeight: 300
            }}
          >
            Simplifying Fashion
          </p>
        </div>

        {/* Continue with Instagram Button - Proper Button Style */}
        <div style={{ width: '100%', marginBottom: '3rem' }}>
          <button
            onClick={handleInstagramAuth}
            disabled={loading}
            className="w-full"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.875rem 1.5rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: "'Avenir Next', sans-serif",
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(124, 58, 237, 0.3)'
              }
            }}
            onMouseDown={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'scale(0.98)'
              }
            }}
            onMouseUp={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'scale(1.02)'
              }
            }}
          >
            <div className="flex items-center justify-center gap-2.5">
              {loading && authProvider === 'instagram' ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Continue with Instagram</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Terms and Privacy - Above Meta Branding */}
        <p 
          className="text-center"
          style={{
            fontFamily: "'Avenir Next', sans-serif",
            color: 'rgba(107, 114, 128, 0.6)',
            fontWeight: 300,
            fontSize: '0.7rem',
            letterSpacing: '0.01em',
            lineHeight: '1.5',
            marginBottom: '1.5rem'
          }}
        >
          By continuing, you agree to Looklyy's{' '}
          <span style={{ textDecoration: 'underline', textUnderlineOffset: '1px', cursor: 'pointer' }}>Terms of Service</span> and{' '}
          <span style={{ textDecoration: 'underline', textUnderlineOffset: '1px', cursor: 'pointer' }}>Privacy Policy</span>
        </p>
      </div>

      {/* From Meta Branding - At Bottom, Mandatory */}
      <div 
        className="absolute bottom-8 left-0 right-0 text-center"
        style={{
          padding: '0 2rem'
        }}
      >
        <p 
          style={{
            fontFamily: "'Avenir Next', sans-serif",
            fontSize: '0.75rem',
            color: '#9ca3af',
            fontWeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem'
          }}
        >
          <span style={{ color: '#9ca3af' }}>from</span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 7.5c-1.1 0-2 0.9-2 2s0.9 2 2 2c0.6 0 1.1-0.3 1.4-0.7l1.1 1.1c-0.6 0.6-1.5 1-2.5 1-2.2 0-4-1.8-4-4s1.8-4 4-4c1 0 1.9 0.4 2.5 1l-1.1 1.1c-0.3-0.4-0.8-0.7-1.4-0.7zm5 0c-0.6 0-1.1 0.3-1.4 0.7l-1.1-1.1c0.6-0.6 1.5-1 2.5-1 2.2 0 4 1.8 4 4s-1.8 4-4 4c-1 0-1.9-0.4-2.5-1l1.1-1.1c0.3 0.4 0.8 0.7 1.4 0.7 1.1 0 2-0.9 2-2s-0.9-2-2-2z" fill="url(#metaGradient2)" stroke="url(#metaGradient2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="metaGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 500
            }}>
              Meta
            </span>
          </span>
        </p>
      </div>
    </div>
  )
}

export default AuthFlow