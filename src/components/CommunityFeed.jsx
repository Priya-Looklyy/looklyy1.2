import React, { useState, useEffect } from 'react'
import './CommunityFeed.css'

const CommunityFeed = ({ onSelectLook }) => {
  const [circleLikes, setCircleLikes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load circle likes - what their circle has liked on their homepage
    // In production, this would be an API call to get friends/community liked looks
    const loadCircleLikes = () => {
      // For demo: simulate circle likes from community shares
      const shares = JSON.parse(localStorage.getItem('looklyy_community_shares') || '[]')
      // Also get liked images from other users (simulated)
      const allLikedImages = JSON.parse(localStorage.getItem('looklyy_favorite_images') || '[]')
      
      // Combine and show as circle likes
      const circleData = [
        ...shares.map(share => ({ ...share.look, source: 'shared', sharedBy: 'Community' })),
        ...allLikedImages.slice(0, 10).map(img => ({ ...img, source: 'liked', likedBy: 'Friend' }))
      ]
      
      // Sort by most recent
      const sorted = circleData.sort((a, b) => 
        new Date(b.sharedAt || b.favoritedAt || 0) - new Date(a.sharedAt || a.favoritedAt || 0)
      )
      setCircleLikes(sorted)
      setLoading(false)
    }

    loadCircleLikes()
    
    // Listen for new shares
    const handleStorageChange = () => {
      loadCircleLikes()
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Also check periodically for same-tab updates
    const interval = setInterval(loadCircleLikes, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="community-feed-loading">
        <div className="loading-spinner"></div>
        <p>Loading circle likes...</p>
      </div>
    )
  }

  if (circleLikes.length === 0) {
    return (
      <div className="community-feed-empty">
        <div className="empty-icon">👥</div>
        <h3>No circle activity yet</h3>
        <p>Your circle's liked looks will appear here</p>
      </div>
    )
  }

  return (
    <div className="community-feed">
      {circleLikes.map((item, index) => (
        <div 
          key={index} 
          className="community-feed-item"
          onClick={() => onSelectLook && onSelectLook(item)}
        >
          <div className="feed-item-image">
            <img src={item.url} alt={item.alt || 'Circle liked look'} />
            <div className="feed-item-badges">
              <span className="feed-badge">{item.likedBy || item.sharedBy || 'Circle'}</span>
            </div>
          </div>
          {item.question && (
            <div className="feed-item-question">
              <p>{item.question}</p>
            </div>
          )}
          <div className="feed-item-meta">
            <span className="feed-time">
              {item.sharedAt || item.favoritedAt 
                ? new Date(item.sharedAt || item.favoritedAt).toLocaleDateString()
                : 'Recently'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommunityFeed

