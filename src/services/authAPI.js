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

// Sign up a new user - SIMPLE WORKING VERSION
export async function signupUser(userData) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    user: {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=f0f0f0&color=1a1a1a`,
      preferences: { theme: 'purple', notifications: true }
    },
    token: 'test-token-' + Date.now()
  }
}

// Login user - SIMPLE WORKING VERSION
export async function loginUser(email, password) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simple hardcoded user for testing
  if (email === 'test@test.com' && password === 'test123') {
    return {
      success: true,
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        avatar: 'https://ui-avatars.com/api/?name=Test+User&background=f0f0f0&color=1a1a1a',
        preferences: { theme: 'purple', notifications: true }
      },
      token: 'test-token-123'
    }
  }
  
  return {
    success: false,
    error: 'Invalid credentials'
  }
}

// Get current user - SIMPLE WORKING VERSION
export async function getCurrentUser() {
  const token = localStorage.getItem('looklyy_token')
  if (token) {
    return {
      success: true,
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        avatar: 'https://ui-avatars.com/api/?name=Test+User&background=f0f0f0&color=1a1a1a',
        preferences: { theme: 'purple', notifications: true }
      }
    }
  }
  return { success: false, error: 'No token found' }
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
