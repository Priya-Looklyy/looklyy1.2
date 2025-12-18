import React, { useState, useEffect } from 'react'
import './CommunityFeed.css'

const CommunityFeed = ({ onSelectLook }) => {
  const [communityShares, setCommunityShares] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load community shares from localStorage (in production, this would be an API call)
    const loadCommunityShares = () => {
      const shares = JSON.parse(localStorage.getItem('looklyy_community_shares') || '[]')
      // Sort by most recent
      const sortedShares = shares.sort((a, b) => 
        new Date(b.sharedAt) - new Date(a.sharedAt)
      )
      setCommunityShares(sortedShares)
      setLoading(false)
    }

    loadCommunityShares()
    
    // Listen for new shares
    const handleStorageChange = () => {
      loadCommunityShares()
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Also check periodically for same-tab updates
    const interval = setInterval(loadCommunityShares, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="community-feed-loading">
        <div className="loading-spinner"></div>
        <p>Loading community feed...</p>
      </div>
    )
  }

  if (communityShares.length === 0) {
    return (
      <div className="community-feed-empty">
        <div className="empty-icon">👥</div>
        <h3>No community shares yet</h3>
        <p>Share a look to get started and see community feedback</p>
      </div>
    )
  }

  return (
    <div className="community-feed">
      {communityShares.map((share, index) => (
        <div 
          key={index} 
          className="community-feed-item"
          onClick={() => onSelectLook && onSelectLook(share.look)}
        >
          <div className="feed-item-image">
            <img src={share.look.url} alt={share.look.alt || 'Community look'} />
            <div className="feed-item-badges">
              {share.groups.map(groupId => (
                <span key={groupId} className="feed-badge">{groupId}</span>
              ))}
            </div>
          </div>
          {share.question && (
            <div className="feed-item-question">
              <p>{share.question}</p>
            </div>
          )}
          <div className="feed-item-meta">
            <span className="feed-time">{new Date(share.sharedAt).toLocaleDateString()}</span>
            <button className="feed-advice-btn">Give Advice</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommunityFeed

