// Authentication API Service for Looklyy App
// Optimized for minimal API usage (100 calls/day limit)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.looklyy.com/api'

// Cache for user data to reduce API calls
let userCache = null
let cacheTimestamp = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper function to make API requests with minimal logging
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
    console.log('🔍 API Request:', { url, method: config.method, body: config.body })
    const response = await fetch(url, config)
    
    console.log('📡 API Response:', { status: response.status, statusText: response.statusText })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', { status: response.status, errorText })
      return { success: false, error: `Server error: ${response.status} - ${errorText}` }
    }
    
    const data = await response.json()
    console.log('✅ API Success:', data)
    return { success: true, ...data }
  } catch (error) {
    console.error('💥 API Exception:', error)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { success: false, error: 'Network error - please check your connection' }
    }
    return { success: false, error: error.message || 'Network error' }
  }
}

// Sign up a new user - WORKING SUPABASE VERSION
export async function signupUser(userData) {
  return await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

// Login user - WORKING SUPABASE VERSION  
export async function loginUser(email, password) {
  return await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

// Get current user - CACHED VERSION to reduce API calls
export async function getCurrentUser() {
  const token = localStorage.getItem('looklyy_token')
  if (!token) {
    return { success: false, error: 'No token found' }
  }

  // Check cache first to avoid API calls
  const now = Date.now()
  if (userCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return { success: true, user: userCache }
  }

  // Only make API call if cache is expired or empty
  const result = await apiRequest('/auth/me')
  if (result.success && result.user) {
    userCache = result.user
    cacheTimestamp = now
  } else {
    // If API call fails, try to decode token for basic user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const fallbackUser = {
        id: payload.id,
        email: payload.email,
        name: payload.email.split('@')[0], // Use email prefix as name
        avatar: null,
        preferences: { theme: 'purple', notifications: true }
      }
      userCache = fallbackUser
      cacheTimestamp = now
      return { success: true, user: fallbackUser }
    } catch (error) {
      return { success: false, error: 'Invalid token' }
    }
  }
  return result
}

// Logout user - OPTIMIZED VERSION
export async function logoutUser() {
  // Clear cache immediately
  userCache = null
  cacheTimestamp = null
  
  // Remove token from localStorage
  localStorage.removeItem('looklyy_token')
  
  // Don't make API call for logout to save API usage
  return { success: true, message: 'Logged out successfully' }
}

// Store token in localStorage and clear cache
export function storeToken(token) {
  localStorage.setItem('looklyy_token', token)
  // Clear cache when new token is stored
  userCache = null
  cacheTimestamp = null
}

// Remove token from localStorage and clear cache
export function removeToken() {
  localStorage.removeItem('looklyy_token')
  userCache = null
  cacheTimestamp = null
}

// Get token from localStorage
export function getToken() {
  return localStorage.getItem('looklyy_token')
}

// Clear user cache (useful for testing or forced refresh)
export function clearUserCache() {
  userCache = null
  cacheTimestamp = null
}
