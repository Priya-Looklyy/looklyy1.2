import React, { createContext, useContext, useReducer } from 'react'

const LookContext = createContext()

// Action types
const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE'
const TOGGLE_PIN = 'TOGGLE_PIN'
const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

// Initial state
const initialState = {
  favorites: [],
  pins: [],
  notifications: []
}

// Reducer
function lookReducer(state, action) {
  switch (action.type) {
    case TOGGLE_FAVORITE:
      const isFavorited = state.favorites.includes(action.payload)
      return {
        ...state,
        favorites: isFavorited
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      }
    
    case TOGGLE_PIN:
      const isPinned = state.pins.includes(action.payload)
      return {
        ...state,
        pins: isPinned
          ? state.pins.filter(id => id !== action.payload)
          : [...state.pins, action.payload]
      }
    
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          message: action.payload,
          timestamp: new Date()
        }]
      }
    
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    default:
      return state
  }
}

// Provider component
export function LookProvider({ children }) {
  const [state, dispatch] = useReducer(lookReducer, initialState)

  const toggleFavorite = (lookId) => {
    dispatch({ type: TOGGLE_FAVORITE, payload: lookId })
  }

  const togglePin = (lookId) => {
    dispatch({ type: TOGGLE_PIN, payload: lookId })
  }

  const showNotification = (message) => {
    const id = Date.now()
    dispatch({ type: ADD_NOTIFICATION, payload: message })
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      dispatch({ type: REMOVE_NOTIFICATION, payload: id })
    }, 3000)
  }

  const isFavorited = (lookId) => state.favorites.includes(lookId)
  const isPinned = (lookId) => state.pins.includes(lookId)

  const value = {
    ...state,
    toggleFavorite,
    togglePin,
    showNotification,
    isFavorited,
    isPinned
  }

  return (
    <LookContext.Provider value={value}>
      {children}
    </LookContext.Provider>
  )
}

// Custom hook
export function useLook() {
  const context = useContext(LookContext)
  if (!context) {
    throw new Error('useLook must be used within a LookProvider')
  }
  return context
}
