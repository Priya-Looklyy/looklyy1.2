import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authenticateUser, createUser, getCurrentUser, logoutUser } from '../services/userService'

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
    const checkAuth = () => {
      const currentUser = getCurrentUser()
      if (currentUser) {
        dispatch({ type: LOGIN_SUCCESS, payload: currentUser })
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const result = authenticateUser(email, password)
      if (result.success) {
        dispatch({ type: LOGIN_SUCCESS, payload: result.user })
        return { success: true }
      } else {
        dispatch({ type: SET_ERROR, payload: result.error })
        return { success: false, error: result.error }
      }
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const signup = async (name, email, password) => {
    dispatch({ type: SET_LOADING, payload: true })
    dispatch({ type: CLEAR_ERROR })

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      const result = createUser({ name, email, password })
      if (result.success) {
        dispatch({ type: LOGIN_SUCCESS, payload: result.user })
        return { success: true }
      } else {
        dispatch({ type: SET_ERROR, payload: result.error })
        return { success: false, error: result.error }
      }
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    logoutUser()
    dispatch({ type: LOGOUT })
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
