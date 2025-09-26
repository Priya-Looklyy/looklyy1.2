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
      if (token) {
        // If token exists, try to validate it
        try {
          // For simplicity, assume token is valid since we don't have token validation endpoint
          // In a real app, you'd validate with the backend
          setIsAuthenticated(true)
          setUser({ name: 'User', email: 'user@looklyy.com' }) // Mock user data
        } catch (err) {
          // Token invalid, clear storage
          localStorage.removeItem('looklyy_token')
          setIsAuthenticated(false)
          setUser(null)
        }
      }
      setIsLoading(false)
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
