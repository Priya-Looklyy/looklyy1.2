import React, { useState } from 'react'
import './CommunityShare.css'

const CommunityShare = ({ look, onShare, onClose }) => {
  const [selectedGroups, setSelectedGroups] = useState([])
  const [question, setQuestion] = useState('')
  const [sharing, setSharing] = useState(false)

  const groups = [
    { id: 'friends', name: 'Friends', icon: '👥' },
    { id: 'work', name: 'Work Circle', icon: '💼' },
    { id: 'casual', name: 'Casual Outings', icon: '☕' },
    { id: 'formal', name: 'Formal Events', icon: '🎩' },
    { id: 'fitness', name: 'Fitness Group', icon: '💪' },
    { id: 'community', name: 'Community', icon: '🌍' }
  ]

  const handleGroupToggle = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const handleShare = async () => {
    if (selectedGroups.length === 0) {
      alert('Please select at least one group to share with')
      return
    }

    setSharing(true)
    
    // Simulate API call
    setTimeout(() => {
      const shareData = {
        look,
        groups: selectedGroups,
        question: question.trim() || null,
        sharedAt: new Date().toISOString()
      }
      
      // Store in localStorage for demo
      const existingShares = JSON.parse(localStorage.getItem('looklyy_community_shares') || '[]')
      existingShares.push(shareData)
      localStorage.setItem('looklyy_community_shares', JSON.stringify(existingShares))
      
      if (onShare) {
        onShare(shareData)
      }
      
      setSharing(false)
      if (onClose) {
        onClose()
      }
    }, 500)
  }

  return (
    <div className="community-share-overlay" onClick={onClose}>
      <div className="community-share-card" onClick={(e) => e.stopPropagation()}>
        <button className="community-share-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="community-share-header">
          <h3 className="community-share-title">Share with Community</h3>
          <p className="community-share-subtitle">Get style advice from your circle</p>
        </div>

        <div className="community-share-content">
          {/* Look Preview */}
          {look && (
            <div className="share-look-preview">
              <img src={look.url} alt={look.alt || 'Look preview'} />
            </div>
          )}

          {/* Select Groups */}
          <div className="share-groups-section">
            <label className="share-section-label">Share with:</label>
            <div className="share-groups-grid">
              {groups.map(group => (
                <button
                  key={group.id}
                  className={`share-group-btn ${selectedGroups.includes(group.id) ? 'selected' : ''}`}
                  onClick={() => handleGroupToggle(group.id)}
                >
                  <span className="group-icon">{group.icon}</span>
                  <span className="group-name">{group.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ask a Question */}
          <div className="share-question-section">
            <label className="share-section-label">Ask for advice (optional):</label>
            <textarea
              className="share-question-input"
              placeholder="e.g., Does this suit a casual brunch? Can I replicate this with items I have?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows="3"
            />
          </div>
        </div>

        <div className="community-share-footer">
          <button 
            className="community-share-btn"
            onClick={handleShare}
            disabled={sharing || selectedGroups.length === 0}
          >
            {sharing ? 'Sharing...' : 'Share with Community'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommunityShare

