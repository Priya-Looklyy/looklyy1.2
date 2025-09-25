import React, { useState, useEffect } from 'react'
import TrendingCard from './TrendingCard'
import trendingAPI from '../services/trendingAPI'
import './TrendingSection.css'

const TrendingSection = () => {
  const [categorizedData, setCategorizedData] = useState({
    trending: [],
    categories: {
      trends: [],
      runway: [],
      'street-style': [],
      'celebrity-style': [],
      designers: []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Load trending looks from crawler API
  useEffect(() => {
    const loadTrendingLooks = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch trending looks from crawler API
        console.log('🔄 Fetching categorized trending looks from API...')
        const response = await trendingAPI.getLatestTrends({ limit: 100 })
        console.log('📊 API Response:', response)
        
        console.log('🔍 Full API Response:', response)
        console.log('🔍 Response.data:', response.data)
        console.log('🔍 Response.data.trending:', response.data?.trending)
        
        if (response.data && response.data.trending) {
          // Transform categorized data
          const transformedData = {
            trending: response.data.trending.map(look => 
              trendingAPI.transformTrendingLook(look)
            ),
            categories: {
              trends: response.data.categories.trends.map(look => 
                trendingAPI.transformTrendingLook(look)
              ),
              runway: response.data.categories.runway.map(look => 
                trendingAPI.transformTrendingLook(look)
              ),
              'street-style': response.data.categories['street-style'].map(look => 
                trendingAPI.transformTrendingLook(look)
              ),
              'celebrity-style': response.data.categories['celebrity-style'].map(look => 
                trendingAPI.transformTrendingLook(look)
              ),
              designers: response.data.categories.designers.map(look => 
                trendingAPI.transformTrendingLook(look)
              )
            }
          }
          
          setCategorizedData(transformedData)
          console.log(`✅ Loaded categorized trending looks from crawler`)
          console.log('🎨 Trending:', transformedData.trending.length)
          console.log('📂 Categories:', Object.keys(transformedData.categories))
        } else if (response.data && Array.isArray(response.data)) {
          // Fallback: if API returns old format (array), convert to new format
          console.log('🔄 Converting old API format to new categorized format')
          const transformedData = {
            trending: response.data.slice(0, 10).map(look => 
              trendingAPI.transformTrendingLook(look)
            ),
            categories: {
              trends: response.data.filter(look => look.category === 'trends').slice(0, 15).map(look => 
                trendingAPI.transformTrendingLook(look)
              ),
              runway: response.data.filter(look => look.category === 'runway').slice(0, 15).map(look => 
                trendingAPI.transformTrendingLook(look)
              ),
              'street-style': response.data.filter(look => look.category === 'street-style').slice(0, 15).map(look => 
                trendingAPI.transformTrendingLook(look)
              ),
              'celebrity-style': response.data.filter(look => look.category === 'celebrity-style').slice(0, 15).map(look => 
                trendingAPI.transformTrendingLook(look)
              ),
              designers: response.data.filter(look => look.category === 'designers').slice(0, 15).map(look => 
                trendingAPI.transformTrendingLook(look)
              )
            }
          }
          
          setCategorizedData(transformedData)
          console.log(`✅ Converted old format to categorized data`)
          console.log('🎨 Trending:', transformedData.trending.length)
          console.log('📂 Categories:', Object.keys(transformedData.categories))
        } else {
          console.log('❌ No data in response, showing empty state')
          throw new Error('No data available')
        }
        
      } catch (apiError) {
        console.warn('Crawler API failed:', apiError)
        setError('Unable to load trending looks')
        setCategorizedData({
          trending: [],
          categories: {
            trends: [],
            runway: [],
            'street-style': [],
            'celebrity-style': [],
            designers: []
          }
        })
      } finally {
        setLoading(false)
      }
    }

    loadTrendingLooks()
  }, []) // Load once on component mount

  // Helper function to group cards into rows of 5
  const groupCardsIntoRows = (cards) => {
    const rows = []
    for (let i = 0; i < cards.length; i += 5) {
      rows.push(cards.slice(i, i + 5))
    }
    return rows
  }

  // Helper function to format category names
  const formatCategoryName = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (loading) {
    return (
      <div className="trending-section">
        <div className="trending-loading">
          <div className="loading-spinner"></div>
          <p>Loading trending looks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="trending-section">
        <div className="trending-error">
          <p>⚠️ {error}</p>
          <p>🔧 Check browser console for debugging info</p>
        </div>
      </div>
    )
  }

  // Show message if no data at all
  const totalImages = categorizedData.trending.length + 
    Object.values(categorizedData.categories).reduce((sum, cat) => sum + cat.length, 0)
  
  if (totalImages === 0) {
    return (
      <div className="trending-section">
        <div className="trending-empty">
          <h2>📸 No Trending Looks Available</h2>
          <p>The crawler hasn't collected any fashion images yet.</p>
          <p>🔧 Check browser console for debugging info</p>
        </div>
      </div>
    )
  }

  return (
    <div className="trending-section">
      <div className="trending-scroll-container">
        <div className="trending-grid-container">
          
          {/* Trending Section - Top 10 Most Trending */}
          {categorizedData.trending.length > 0 && (
            <div className="category-section">
              <h2 className="category-title">🔥 Most Trending</h2>
              {groupCardsIntoRows(categorizedData.trending).map((row, rowIndex) => (
                <div key={`trending-${rowIndex}`} className="trending-row">
                  {row.map((card) => (
                    <TrendingCard
                      key={card.id}
                      card={card}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Category Sections */}
          {Object.entries(categorizedData.categories).map(([categoryKey, cards]) => {
            if (cards.length === 0) return null
            
            return (
              <div key={categoryKey} className="category-section">
                <h2 className="category-title">✨ {formatCategoryName(categoryKey)}</h2>
                {groupCardsIntoRows(cards).map((row, rowIndex) => (
                  <div key={`${categoryKey}-${rowIndex}`} className="trending-row">
                    {row.map((card) => (
                      <TrendingCard
                        key={card.id}
                        card={card}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}

export default TrendingSection