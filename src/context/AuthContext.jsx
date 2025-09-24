import React, { createContext, useContext, useState } from 'react'
import { signupUser, loginUser, logoutUser, storeToken, getToken } from '../services/authAPI'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

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
