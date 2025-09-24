import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { signupUser, loginUser, getCurrentUser, logoutUser, storeToken, removeToken, getToken } from '../services/authAPI'

const AuthContext = createContext()

// Action types
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT = 'LOGOUT'
const SET_LOADING = 'SET_LOADING'
const SET_ERROR = 'SET_ERROR'
const CLEAR_ERROR = 'CLEAR_ERROR'

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken()
      if (token) {
        try {
          const response = await getCurrentUser()
          if (response.success) {
            dispatch({ type: LOGIN_SUCCESS, payload: response.user })
          } else {
            removeToken()
            dispatch({ type: SET_LOADING, payload: false })
          }
        } catch (error) {
          removeToken()
          dispatch({ type: SET_LOADING, payload: false })
        }
      } else {
        dispatch({ type: SET_LOADING, payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    dispatch({ type: SET_LOADING, payload: true })
    dispatch({ type: CLEAR_ERROR })

    try {
      console.log('🚀 Starting login for:', { email })
      const response = await loginUser(email, password)
      console.log('📋 Login response:', response)
      
      if (response.success) {
        console.log('✅ Login successful, storing token and user data')
        storeToken(response.token)
        dispatch({ type: LOGIN_SUCCESS, payload: response.user })
        return { success: true }
      } else {
        console.error('❌ Login failed:', response.error)
        dispatch({ type: SET_ERROR, payload: response.error })
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('💥 Login exception:', error)
      dispatch({ type: SET_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const signup = async (name, email, password) => {
    dispatch({ type: SET_LOADING, payload: true })
    dispatch({ type: CLEAR_ERROR })

    try {
      console.log('🚀 Starting signup for:', { name, email })
      const response = await signupUser({ name, email, password })
      console.log('📋 Signup response:', response)
      
      if (response.success) {
        console.log('✅ Signup successful, storing token and user data')
        storeToken(response.token)
        dispatch({ type: LOGIN_SUCCESS, payload: response.user })
        return { success: true }
      } else {
        console.error('❌ Signup failed:', response.error)
        dispatch({ type: SET_ERROR, payload: response.error })
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('💥 Signup exception:', error)
      dispatch({ type: SET_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      removeToken()
      dispatch({ type: LOGOUT })
    }
  }

  const clearError = () => {
    dispatch({ type: CLEAR_ERROR })
  }

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
