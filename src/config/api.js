// API Configuration for Looklyy

// Environment-based API URL configuration
const getAPIBaseURL = () => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'
  
  if (isDevelopment) {
    // Development: Use local crawler API
    return 'http://localhost:8000'
  } else {
    // Production: Use working Vercel API endpoints
    return import.meta.env.VITE_API_BASE_URL || 'https://looklyy04.vercel.app'
  }
}

export const API_CONFIG = {
  BASE_URL: 'https://looklyy04.vercel.app', // Force correct baseURL
  ENDPOINTS: {
    TRENDING_LATEST: '/api/trends/latest',
    TRENDING_FEATURED: '/api/trends/featured',
    TRENDING_SEARCH: '/api/trends/search',
    TRENDING_CATEGORIES: '/api/trends/categories',
    HEALTH: '/api/health'
  },
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    LONG: 30000     // 30 seconds for crawl operations
  }
}

export default API_CONFIG
