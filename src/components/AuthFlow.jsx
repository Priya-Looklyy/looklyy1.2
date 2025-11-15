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
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{
        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #e9d5ff 50%, #ddd6fe 75%, #c4b5fd 100%)',
        fontFamily: "'Avenir Next', sans-serif"
      }}
    >
      {/* White Transparent Container - 30% width, responsive */}
      <div 
        className="w-full"
        style={{
          maxWidth: '30%',
          minWidth: '320px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(147, 51, 234, 0.1)',
          padding: '3rem 2.5rem',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Logo and Tagline - Tightly Packed Like Homepage */}
        <div className="text-center mb-10">
          <h1 
            style={{
              fontFamily: "'Nord', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.15em',
              margin: 0
            }}
          >
            LOOKLYY
          </h1>
          <p 
            style={{
              fontFamily: "'Avenir Next', 'Avenir Next Regular', 'Avenir Next Light', sans-serif",
              fontSize: '0.75rem',
              margin: '-5px 0 0 0',
              color: '#9ca3af',
              letterSpacing: '0.3px',
              textTransform: 'none',
              fontWeight: 300
            }}
          >
            Simplifying Fashion
          </p>
        </div>

        {/* Instagram Button - Refined */}
        <div className="mb-8">
          <button
            onClick={handleInstagramAuth}
            disabled={loading}
            className="w-full group relative overflow-hidden"
            style={{
              background: 'transparent',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              borderRadius: '0',
              padding: '1rem 1.5rem',
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
            <div className="flex items-center justify-center gap-3">
              {loading && authProvider === 'instagram' ? (
                <>
                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting</span>
                </>
              ) : (
                <>
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" style={{ transition: 'all 0.3s ease' }}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Continue with Instagram</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Footer - Fineprint */}
        <p 
          className="text-center"
          style={{
            fontFamily: "'Avenir Next', sans-serif",
            color: 'rgba(107, 114, 128, 0.5)',
            fontWeight: 300,
            fontSize: '0.65rem',
            letterSpacing: '0.02em',
            lineHeight: '1.5'
          }}
        >
          By continuing, you agree to Looklyy's{' '}
          <span style={{ textDecoration: 'underline', textUnderlineOffset: '1px' }}>Terms of Service</span> and{' '}
          <span style={{ textDecoration: 'underline', textUnderlineOffset: '1px' }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}

export default AuthFlow