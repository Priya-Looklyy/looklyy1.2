import React, { useState, useEffect, useRef } from 'react'
import './BottomNav.css'

const BottomNav = ({ currentSection, onSectionChange }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [touchStartY, setTouchStartY] = useState(0)
  const hideTimeoutRef = useRef(null)
  const navRef = useRef(null)

  const navItems = [
    { id: 'trending', label: 'Circle', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )},
    { id: 'suggests', label: 'Stylist', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )},
    { id: 'closet', label: 'Closet', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
        <path d="M8 6v4"/>
        <path d="M16 6v4"/>
        <path d="M8 14v4"/>
        <path d="M16 14v4"/>
      </svg>
    )}
  ]

  // Show nav on interaction
  const showNav = () => {
    setIsVisible(true)
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    // Auto-hide after 3 seconds of inactivity
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 3000)
  }

  // Handle touch start for swipe up detection
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY)
  }

  // Handle touch move - detect swipe up from bottom
  const handleTouchMove = (e) => {
    if (!touchStartY) return
    
    const touchY = e.touches[0].clientY
    const deltaY = touchStartY - touchY
    const windowHeight = window.innerHeight
    
    // If swiping up from bottom 20% of screen
    if (touchStartY > windowHeight * 0.8 && deltaY > 30) {
      showNav()
    }
  }

  // Handle touch end
  const handleTouchEnd = () => {
    setTouchStartY(0)
  }

  // Show nav on any interaction
  useEffect(() => {
    const handleInteraction = () => {
      showNav()
    }

    // Show nav on tap/click anywhere
    document.addEventListener('touchstart', handleInteraction, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    
    // Also show on mouse interaction for hybrid devices
    document.addEventListener('mousedown', handleInteraction)
    
    // Show nav initially, then hide after 3 seconds
    showNav()

    return () => {
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mousedown', handleInteraction)
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  // Keep nav visible when interacting with it
  const handleNavInteraction = () => {
    showNav()
  }

  return (
    <nav 
      ref={navRef}
      className={`bottom-nav ${isVisible ? 'visible' : 'hidden'}`}
      onTouchStart={handleNavInteraction}
      onMouseEnter={handleNavInteraction}
    >
      {navItems.map(item => (
        <button
          key={item.id}
          className={`bottom-nav-item ${currentSection === item.id ? 'active' : ''}`}
          onClick={() => {
            onSectionChange(item.id)
            showNav() // Keep visible after tap
          }}
          aria-label={item.label}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav

