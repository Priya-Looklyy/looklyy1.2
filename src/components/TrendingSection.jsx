import React, { useState, useEffect } from 'react'
import TrendingCard from './TrendingCard'
import NotificationCenter from './NotificationCenter'
import Frame2Canvas from './Frame2Canvas'
import { useLook } from '../context/LookContext'
import trendingAPI from '../services/trendingAPI'
import './TrendingSection.css'

const TrendingSection = () => {
  const [pinnedLook, setPinnedLook] = useState(null)
  const [showFrame2, setShowFrame2] = useState(false)
  const [sortBy, setSortBy] = useState('trending') // 'trending', 'favorites', 'newest'
  const [allCards, setAllCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { favorites } = useLook()
  
  // Load trending looks from crawler API
  useEffect(() => {
    const loadTrendingLooks = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch trending looks from crawler API
        console.log('🔄 Fetching trending looks from API...')
        const trendingLooks = await trendingAPI.getLatestTrends({ limit: 100 })
        console.log('📊 API Response:', trendingLooks)
        
        // Transform API data to component format
        const transformedCards = trendingLooks.map(look => 
          trendingAPI.transformTrendingLook(look)
        )
        
        setAllCards(transformedCards)
        console.log(`✅ Loaded ${transformedCards.length} trending looks from crawler`)
        console.log('🎨 First few cards:', transformedCards.slice(0, 3))
        
      } catch (apiError) {
        console.warn('Crawler API failed, using fallback data:', apiError)
        // Remove the error message - just use fallback data silently
        
        try {
          // Use fallback dummy data if API fails
          const fallbackCards = await trendingAPI.getFallbackData()
          setAllCards(fallbackCards)
        } catch (fallbackError) {
          console.error('Both API and fallback failed:', fallbackError)
          setError('Unable to load trending looks')
          setAllCards([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadTrendingLooks()
  }, []) // Load once on component mount
  
  // Sort cards based on selected criteria
  const getSortedCards = () => {
    const cards = [...allCards]
    
    switch (sortBy) {
      case 'favorites':
        return cards.sort((a, b) => {
          const aFavorited = favorites.includes(a.sliderId)
          const bFavorited = favorites.includes(b.sliderId)
          
          if (aFavorited && !bFavorited) return -1
          if (!aFavorited && bFavorited) return 1
          return 0
        })
      case 'newest':
        return cards.sort((a, b) => {
          const aDate = new Date(a.crawled_at || a.slider?.crawled_at || 0)
          const bDate = new Date(b.crawled_at || b.slider?.crawled_at || 0)
          return bDate - aDate // Newest first
        })
      case 'trending':
      default:
        // Sort by trend score, but keep favorited items at top
        return cards.sort((a, b) => {
          const aFavorited = favorites.includes(a.sliderId)
          const bFavorited = favorites.includes(b.sliderId)
          
          if (aFavorited && !bFavorited) return -1
          if (!aFavorited && bFavorited) return 1
          
          // If both favorited or both not favorited, sort by trend score
          const aScore = a.trend_score || a.slider?.trend_score || 0
          const bScore = b.trend_score || b.slider?.trend_score || 0
          return bScore - aScore // Higher trend score first
        })
    }
  }

  const handlePinLook = (card) => {
    setPinnedLook({
      slider: card.slider,
      currentImage: card.image
    })
    setShowFrame2(true)
  }

  const closeFrame2 = () => {
    setShowFrame2(false)
    setPinnedLook(null)
  }

  const sortedCards = getSortedCards()

  return (
    <div className="trending-section">
      {/* Trending Page Header */}
      <div className="trending-header">
        <h2 className="trending-title">Trending Fashion Looks</h2>
        <p className="trending-subtitle">
          Discover curated fashion inspirations from Harper's Bazaar, Elle, and Vogue
        </p>
        {error && (
          <div className="api-status-warning">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="trending-loading">
          <div className="loading-spinner"></div>
          <p>Loading latest trending looks...</p>
        </div>
      ) : (
        <>
          {/* Sort Controls */}
          <div className="sort-controls">
            <div className="sort-options">
              <button 
                className={`sort-btn ${sortBy === 'trending' ? 'active' : ''}`}
                onClick={() => setSortBy('trending')}
              >
                <i className="fas fa-fire"></i> Trending
              </button>
              <button 
                className={`sort-btn ${sortBy === 'favorites' ? 'active' : ''}`}
                onClick={() => setSortBy('favorites')}
              >
                <i className="fas fa-heart"></i> Favorites First
              </button>
              <button 
                className={`sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
                onClick={() => setSortBy('newest')}
              >
                <i className="fas fa-clock"></i> Newest
              </button>
            </div>
            
            <div className="results-count">
              {sortedCards.length} looks found
            </div>
          </div>

          {/* Pinterest-style Cards Grid */}
          <div className="trending-grid">
            {sortedCards.length > 0 ? (
              sortedCards.map(card => (
                <TrendingCard 
                  key={card.id} 
                  card={card}
                  onPinLook={handlePinLook}
                />
              ))
            ) : (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>No trending looks found</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {showFrame2 && (
        <Frame2Canvas 
          pinnedLook={pinnedLook}
          onClose={closeFrame2}
        />
      )}
      
      <NotificationCenter />
    </div>
  )
}

export default TrendingSection
