import React, { useState, useEffect } from 'react'
import TrendingCard from './TrendingCard'
import trendingAPI from '../services/trendingAPI'
import './TrendingSection.css'

const TrendingSection = () => {
  const [allCards, setAllCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
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

  // No pin functionality - clean image display only

  // Group cards into rows of 5
  const groupedCards = []
  for (let i = 0; i < allCards.length; i += 5) {
    groupedCards.push(allCards.slice(i, i + 5))
  }

  return (
    <div className="trending-section">
      {/* Loading State */}
      {loading ? (
        <div className="trending-loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="trending-scroll-container">
          {/* 5 images per row with vertical scroll */}
          <div className="trending-grid-container">
            {groupedCards.map((row, rowIndex) => (
              <div key={rowIndex} className="trending-row">
                {row.map(card => (
                  <TrendingCard 
                    key={card.id} 
                    card={card}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TrendingSection