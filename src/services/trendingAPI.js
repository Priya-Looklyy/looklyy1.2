// Looklyy Trending API Service - Connects to Fashion Crawler Backend

import API_CONFIG from '../config/api'

class TrendingAPIService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.endpoints = API_CONFIG.ENDPOINTS;
    this.timeout = API_CONFIG.TIMEOUTS.DEFAULT;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get latest trending looks for Pinterest-style page
  async getLatestTrends(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.category) params.append('category', filters.category);
    if (filters.season) params.append('season', filters.season);
    if (filters.min_score) params.append('min_score', filters.min_score);

    const queryString = params.toString();
    const endpoint = `${this.endpoints.TRENDING_LATEST}${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.apiCall(endpoint);
    // Return the data array from the API response
    return response.data || response;
  }

  // Get featured looks for home page sliders (keep separate from trending page)
  async getFeaturedLooks(limit = 25) {
    const response = await this.apiCall(`${this.endpoints.TRENDING_FEATURED}?limit=${limit}`);
    // Return the data array from the API response
    return response.data || response;
  }

  // Search trending looks
  async searchTrends(query, filters = {}) {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters.category) params.append('category', filters.category);
    if (filters.limit) params.append('limit', filters.limit);

    return await this.apiCall(`${this.endpoints.TRENDING_SEARCH}?${params.toString()}`);
  }

  // Get available categories
  async getCategories() {
    return await this.apiCall(this.endpoints.TRENDING_CATEGORIES);
  }

  // Get trends by source site
  async getTrendsBySource(sourceSite, limit = 20) {
    return await this.apiCall(`${this.endpoints.TRENDING_BY_SOURCE}/${sourceSite}?limit=${limit}`);
  }

  // Get crawler statistics
  async getCrawlerStats() {
    return await this.apiCall(this.endpoints.CRAWLER_STATS);
  }

  // Convert crawler API response to format expected by TrendingCard component
  transformTrendingLook(apiLook) {
    return {
      id: `api-${apiLook.id}`,
      sliderId: apiLook.id,
      imageId: apiLook.id,
      image: {
        id: apiLook.id,
        url: apiLook.primary_image_url,
        alt: apiLook.image_alt_text || apiLook.title
      },
      slider: {
        id: apiLook.id,
        title: apiLook.title,
        description: apiLook.description || '',
        tag: apiLook.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        source: apiLook.source_site,
        trend_score: apiLook.trend_score,
        engagement_score: apiLook.engagement_score,
        crawled_at: apiLook.crawled_at,
        is_featured: apiLook.is_featured
      },
      imageIndex: 0,
      // Additional crawler-specific data
      category: apiLook.category,
      tags: apiLook.tags || [],
      source_url: apiLook.source_url,
      trend_score: apiLook.trend_score,
      crawled_at: new Date(apiLook.crawled_at)
    };
  }

  // Fallback to dummy data if API fails
  async getFallbackData() {
    console.warn('Using fallback dummy data - crawler API unavailable');
    
    // Import dummy data as fallback
    try {
      const { getAllSliders } = await import('../data/fashionDatabase');
      const allSliders = getAllSliders();
      
      const fallbackCards = [];
      allSliders.forEach(slider => {
        slider.images.forEach((image, index) => {
          fallbackCards.push({
            id: `fallback-${slider.id}-${image.id}`,
            sliderId: slider.id,
            imageId: image.id,
            image: image,
            slider: slider,
            imageIndex: index,
            trend_score: Math.random() * 0.5 + 0.5, // Random score 0.5-1.0
            crawled_at: new Date()
          });
        });
      });
      
      return fallbackCards;
    } catch (error) {
      console.error('Fallback data also failed:', error);
      return [];
    }
  }
}

// Create singleton instance
const trendingAPI = new TrendingAPIService();

export default trendingAPI;
