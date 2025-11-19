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
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15), transparent 60%),
          radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.08), transparent 55%),
          linear-gradient(135deg, #1f0a5c 0%, #3b0c83 35%, #5d14b8 65%, #7c3aed 100%)
        `,
        fontFamily: "'Avenir Next', sans-serif",
        height: '100vh',
        width: '100vw',
        padding: '2rem',
        margin: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover'
      }}
    >
      {/* Login Panel - Perfectly Centered, Responsive */}
      <div 
        className="flex flex-col items-center login-panel"
        style={{
          width: '20%',
          height: '90vh',
          minWidth: '280px',
          maxWidth: '450px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '22px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          padding: '3rem 2.5rem',
          position: 'relative',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {/* LOOKLYY Logo - Top section */}
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            position: 'absolute',
            top: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)'
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
              letterSpacing: '0.1em',
              margin: 0,
              lineHeight: '1.1',
              whiteSpace: 'nowrap',
              textAlign: 'center'
            }}
          >
            LOOKLYY
          </h1>
        </div>

        {/* Login with Instagram Button */}
        <button
          onClick={handleInstagramAuth}
          disabled={loading}
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '9999px',
            height: '44px',
            paddingLeft: '22px',
            paddingRight: '22px',
            paddingTop: 0,
            paddingBottom: 0,
            minWidth: '200px',
            maxWidth: '200px',
            width: '200px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: "'Avenir Next', sans-serif",
            fontWeight: 400,
            fontSize: '14px',
            color: '#000000',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            opacity: loading ? 0.8 : 1,
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            flexShrink: 0,
            flexGrow: 0,
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)'
            }
          }}
          onFocus={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15)'
            }
          }}
          onBlur={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          {loading && authProvider === 'instagram' ? (
            <svg 
              className="animate-spin" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              style={{ 
                color: '#ffffff',
                width: '18px',
                height: '18px',
                margin: '0 auto'
              }}
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <span style={{ whiteSpace: 'nowrap' }}>Login with Instagram</span>
          )}
        </button>

        {/* Fine Print - Bottom of Panel */}
        <p 
          style={{
            fontFamily: "'Avenir Next', sans-serif",
            color: '#B5B5B5',
            fontWeight: 300,
            fontSize: '9px',
            lineHeight: '1.5',
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: 'calc(100% - 5rem)'
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

      <style>{`
        .login-panel {
          width: 20%;
        }
        @media (max-width: 768px) {
          .login-panel {
            width: 40% !important;
          }
        }
        @media (max-width: 480px) {
          .login-panel {
            width: 85% !important;
          }
        }
      `}</style>
    </div>
  )
}

export default AuthFlow