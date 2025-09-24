// Simple Authentication API Service
const API_BASE_URL = '/api'

// Simple API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Error:', error)
    return { success: false, error: 'Network error' }
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

// Simple logout
export async function logoutUser() {
  localStorage.removeItem('looklyy_token')
  return { success: true, message: 'Logged out successfully' }
}

// Store token
export function storeToken(token) {
  localStorage.setItem('looklyy_token', token)
}

// Get token
export function getToken() {
  return localStorage.getItem('looklyy_token')
}
