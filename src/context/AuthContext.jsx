import React, { createContext, useContext, useState, useEffect } from 'react'
import { signupUser, loginUser, logoutUser, storeToken, getToken } from '../services/authAPI'

// Generate a shuffle seed whenever user authentication state changes
function generateShuffleSeed() {
  return Date.now() + Math.random()
}

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Start as loading to check auth state
  const [error, setError] = useState(null)
  const [imageShuffleSeed, setImageShuffleSeed] = useState(generateShuffleSeed())

  // Check authentication on mount/app refresh
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getToken()
      console.log('🔍 Check auth on refresh - token exists:', !!token)
      
      if (token && token.trim() !== '') {
        // If token exists, assume the user is authenticated and keep them on the app
        setIsAuthenticated(true)
        setUser({ name: 'User', email: 'user@looklyy.com' }) // Mock user data for now
        setIsLoading(false)
        console.log('✅ User authenticated from stored token on refresh')
      } else {
        // No token, so user needs to login
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)
        console.log('❌ No auth token - showing login page')
      }
    }
    
    checkAuthStatus()
  }, [])

  const signup = async (userData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await signupUser(userData)
      
      if (response.success) {
        setUser(response.user)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = 'Network error - please try again'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await loginUser(email, password)
      
      if (response.success) {
        setUser(response.user)
        setIsAuthenticated(true)
        setImageShuffleSeed(generateShuffleSeed()) // BACK TO: Reshuffle images on login
        if (response.token) {
          storeToken(response.token)
          console.log('🔄 Storing auth token:', response.token)
        } else {
          console.warn('⚠️ No token returned from login API')
        }
        return { success: true }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = 'Network error - please try again'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    imageShuffleSeed,
    signup,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
