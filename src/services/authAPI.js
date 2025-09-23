// Authentication API Service for Looklyy App
// Handles all authentication-related API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://looklyy.com/api'

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  // Add auth token if available
  const token = localStorage.getItem('looklyy_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    console.log('Making API request to:', url)
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API response error:', response.status, errorText)
      return { success: false, error: `Server error: ${response.status}` }
    }
    
    const data = await response.json()
    console.log('API response success:', data)
    return { success: true, ...data }
  } catch (error) {
    console.error('API request failed:', error)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { success: false, error: 'Network error - please check your connection' }
    }
    return { success: false, error: error.message || 'Network error' }
  }
}

// Sign up a new user
export async function signupUser(userData) {
  return await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

// Login user
export async function loginUser(email, password) {
  return await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

// Get current user
export async function getCurrentUser() {
  return await apiRequest('/auth/me')
}

// Logout user
export async function logoutUser() {
  return await apiRequest('/auth/logout', {
    method: 'POST'
  })
}

// Store token in localStorage
export function storeToken(token) {
  localStorage.setItem('looklyy_token', token)
}

// Remove token from localStorage
export function removeToken() {
  localStorage.removeItem('looklyy_token')
}

// Get token from localStorage
export function getToken() {
  return localStorage.getItem('looklyy_token')
}
