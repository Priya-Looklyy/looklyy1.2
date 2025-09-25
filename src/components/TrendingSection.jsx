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
    <div className="trending-section" data-version="2.0">
      {/* Loading State */}
      {loading ? (
        <div className="trending-loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          {/* Home Page Style Grid - 5 images per row */}
          <div className="trending-home-grid">
            {groupedCards.map((row, rowIndex) => (
              <div key={rowIndex} className="trending-row" data-row={rowIndex}>
                {row.map(card => (
                  <TrendingCard 
                    key={card.id} 
                    card={card}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Right Corner Slider Navigation */}
          <div className="trending-nav-slider">
            <div className="nav-slider-track">
              {allCards.map((card, index) => (
                <div 
                  key={card.id} 
                  className="nav-slider-dot"
                  onClick={() => {
                    const targetRow = Math.floor(index / 5)
                    const targetElement = document.querySelector(`[data-row="${targetRow}"]`)
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  <img 
                    src={card.image.url} 
                    alt={card.image.alt}
                    className="nav-slider-thumb"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* No Frame2 or notifications - clean display only */}
    </div>
  )
}

export default TrendingSection