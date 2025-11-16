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
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #e9d5ff 50%, #ddd6fe 75%, #c4b5fd 100%)',
        fontFamily: "'Avenir Next', sans-serif",
        height: '100vh',
        width: '100vw',
        padding: 0,
        margin: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch'
      }}
    >
      {/* Login Box Container - Full Screen Vertical on Desktop */}
      <div 
        className="flex flex-col items-center justify-center"
        style={{
          width: '20%',
          minWidth: '320px',
          maxWidth: '400px',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: 'none',
          borderRadius: '0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          padding: '3rem 2.5rem',
          position: 'relative',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {/* LOOKLYY Logo - Center Aligned, No Tagline */}
        <div 
          style={{
            marginBottom: '50px',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <h1 
            style={{
              fontFamily: "'Nord', sans-serif",
              fontSize: '2rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.15em',
              margin: '0 auto',
              lineHeight: '1.1',
              whiteSpace: 'nowrap',
              overflow: 'visible',
              textAlign: 'center'
            }}
          >
            LOOKLYY
          </h1>
        </div>

        {/* Simple Pill Button - Center Aligned, Typography Matches Tagline */}
        <button
          onClick={handleInstagramAuth}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
            border: 'none',
            borderRadius: '50px',
            padding: '1rem 1.5rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: "'Avenir Next', 'Avenir Next Regular', 'Avenir Next Light', sans-serif",
            fontWeight: 400,
            fontSize: '0.875rem',
            letterSpacing: '0.3px',
            textTransform: 'none',
            color: '#ffffff',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
            opacity: loading ? 0.7 : 1,
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            margin: '0 auto'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.4)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(124, 58, 237, 0.3)'
            }
          }}
          onMouseDown={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0) scale(0.98)'
            }
          }}
          onMouseUp={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          }}
          onFocus={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.3), 0 4px 12px rgba(124, 58, 237, 0.4)'
            }
          }}
          onBlur={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(124, 58, 237, 0.3)'
            }
          }}
        >
          {loading && authProvider === 'instagram' ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Connecting...</span>
            </>
          ) : (
            <span>Login with Instagram</span>
          )}
        </button>

        {/* Fine Print - Center Aligned */}
        <p 
          style={{
            fontFamily: "'Avenir Next', sans-serif",
            color: '#B5B5B5',
            fontWeight: 300,
            fontSize: '12px',
            lineHeight: '1.5',
            marginTop: '2rem',
            marginBottom: 0,
            textAlign: 'center',
            width: '100%'
          }}
        >
          By continuing, you agree to our{' '}
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            style={{ 
              color: '#B5B5B5',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#9ca3af'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#B5B5B5'}
          >
            Terms of Service
          </a>
          {' '}and{' '}
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            style={{ 
              color: '#B5B5B5',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#9ca3af'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#B5B5B5'}
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