import React, { createContext, useContext, useReducer, useEffect } from 'react'

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
      const savedUser = localStorage.getItem('looklyy_user')
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          dispatch({ type: LOGIN_SUCCESS, payload: user })
        } catch (error) {
          localStorage.removeItem('looklyy_user')
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication - in real app, this would be an API call
      if (email && password) {
        const user = {
          id: Date.now(),
          email,
          name: email.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=f0f0f0&color=1a1a1a`,
          joinedDate: new Date().toISOString()
        }
        
        localStorage.setItem('looklyy_user', JSON.stringify(user))
        dispatch({ type: LOGIN_SUCCESS, payload: user })
        return { success: true }
      } else {
        throw new Error('Invalid credentials')
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Mock signup - in real app, this would be an API call
      if (name && email && password) {
        const user = {
          id: Date.now(),
          email,
          name,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=f0f0f0&color=1a1a1a`,
          joinedDate: new Date().toISOString()
        }
        
        localStorage.setItem('looklyy_user', JSON.stringify(user))
        dispatch({ type: LOGIN_SUCCESS, payload: user })
        return { success: true }
      } else {
        throw new Error('Please fill in all fields')
      }
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('looklyy_user')
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
