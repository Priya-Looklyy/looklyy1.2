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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Demo Banner */}
        <div className="mb-6 bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-center">
          <p className="text-purple-800 font-semibold text-sm">
            🎭 DEMO MODE - Click any social button to continue
          </p>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Looklyy
          </h1>
          <p className="text-gray-600 mt-2">Simplifying Fashion</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Welcome to Looklyy
          </h2>
          <p className="text-gray-600 text-center mb-8 text-sm">
            Sign in with your social account to continue
          </p>

          {/* Social Auth Buttons */}
          <div className="space-y-4">
            {/* Instagram Button */}
            <button
              onClick={handleInstagramAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading && authProvider === 'instagram' ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Continue with Instagram</span>
                </>
              )}
            </button>

            {/* Facebook Button */}
            <button
              onClick={handleFacebookAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3.5 rounded-xl font-semibold hover:bg-[#166FE5] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading && authProvider === 'facebook' ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Continue with Facebook</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          By continuing, you agree to Looklyy's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
