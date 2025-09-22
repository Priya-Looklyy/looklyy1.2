// API Configuration for Looklyy

// Environment-based API URL configuration
const getAPIBaseURL = () => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'
  
  if (isDevelopment) {
    // Development: Use local crawler API
    return 'http://localhost:8000'
  } else {
    // Production: Use Vercel API endpoints
    return import.meta.env.VITE_API_BASE_URL || 'https://looklyy.com/api'
  }
}

export const API_CONFIG = {
  BASE_URL: getAPIBaseURL(),
  ENDPOINTS: {
    TRENDING_LATEST: '/trends/latest',
    TRENDING_FEATURED: '/trends/featured',
    TRENDING_SEARCH: '/trends/search',
    TRENDING_CATEGORIES: '/trends/categories',
    TRENDING_BY_SOURCE: '/trends/by-source',
    CRAWLER_STATS: '/crawler/stats',
    CRAWLER_TRIGGER: '/admin/crawl'
  },
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    LONG: 30000     // 30 seconds for crawl operations
  }
}

export default API_CONFIG
