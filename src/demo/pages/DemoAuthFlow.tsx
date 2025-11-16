import React, { useState } from 'react'
import { useDemoMode } from '../DemoProvider'

interface DemoAuthFlowProps {
  onAuthComplete: () => void
}

export const DemoAuthFlow: React.FC<DemoAuthFlowProps> = ({ onAuthComplete }) => {
  const [loading, setLoading] = useState(false)
  const [authProvider, setAuthProvider] = useState<string | null>(null)

  const handleInstagramAuth = () => {
    setLoading(true)
    setAuthProvider('instagram')
    
    // Simulate Instagram authentication delay
    setTimeout(() => {
      console.log('🎭 Demo Instagram authentication successful')
      localStorage.setItem('looklyy_demo_authenticated', 'true')
      setLoading(false)
      onAuthComplete()
    }, 1000)
  }

  const handleFacebookAuth = () => {
    setLoading(true)
    setAuthProvider('facebook')
    
    // Simulate Facebook authentication delay
    setTimeout(() => {
      console.log('🎭 Demo Facebook authentication successful')
      localStorage.setItem('looklyy_demo_authenticated', 'true')
      setLoading(false)
      onAuthComplete()
    }, 1000)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #e9d5ff 50%, #ddd6fe 75%, #c4b5fd 100%)',
        fontFamily: "'Avenir Next', sans-serif",
        height: '100vh',
        width: '100vw',
        padding: '2rem'
      }}
    >
      {/* Demo Banner - Subtle at Top */}
      <div className="absolute top-4 left-0 right-0 text-center">
        <p 
          className="text-xs uppercase tracking-widest"
          style={{
            color: 'rgba(147, 51, 234, 0.4)',
            fontFamily: "'Nord', sans-serif",
            fontWeight: 400,
            letterSpacing: '0.2em'
          }}
        >
          Demo Mode
        </p>
      </div>

      {/* Login Box Container */}
      <div 
        className="flex flex-col items-center"
        style={{
          width: '20%',
          minWidth: '320px',
          maxWidth: '400px',
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          padding: '3rem 2.5rem',
          position: 'relative'
        }}
      >
        {/* LOOKLYY Logo - Centered, No Tagline */}
        <div 
          className="text-center"
          style={{
            marginBottom: '50px'
          }}
        >
          <h1 
            style={{
              fontFamily: "'Nord', sans-serif",
              fontSize: '2.5rem',
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
        </div>

        {/* Login with Instagram Button */}
        <button
          onClick={handleInstagramAuth}
          disabled={loading}
          className="w-full"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '1rem 1.5rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: "'Avenir Next', sans-serif",
            fontWeight: 600,
            fontSize: '1rem',
            color: '#ffffff',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
            opacity: loading ? 0.7 : 1,
            outline: 'none'
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
          <div className="flex items-center justify-center gap-3">
            {loading && authProvider === 'instagram' ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Login with Instagram</span>
              </>
            )}
          </div>
        </button>

        {/* Fine Print */}
        <p 
          className="text-center"
          style={{
            fontFamily: "'Avenir Next', sans-serif",
            color: '#B5B5B5',
            fontWeight: 300,
            fontSize: '12px',
            lineHeight: '1.5',
            marginTop: '2rem',
            marginBottom: 0
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
