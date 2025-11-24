import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = ({ currentSection, onSectionChange, onLogoClick, onLogout }) => {
  const { user } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileRef = useRef(null)
  const navItems = [
    { id: 'suggests', label: 'Stylist' },
    { id: 'closet', label: 'Closet' },
    { id: 'trending', label: 'Circle' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setIsProfileMenuOpen(false)
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div 
          className="logo" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (onLogoClick) {
              onLogoClick()
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <h1>LOOKLYY</h1>
          <p className="tagline">Simplifying Fashion</p>
        </div>
      </div>
      
      <div className="nav-right">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${currentSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span>{item.label}</span>
          </button>
        ))}
        <div className="profile-wrapper" ref={profileRef}>
          <button
            className="profile-info"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
          >
            <div className="user-initials">
              {(user?.name || 'PS').slice(0, 2).toUpperCase()}
            </div>
          </button>
          {isProfileMenuOpen && (
            <div className="profile-menu" role="menu">
              <div className="profile-meta">
                <p className="profile-name">{user?.name || 'Looklyy Stylist'}</p>
                <p className="profile-email">{user?.email || 'stylist@looklyy.com'}</p>
              </div>
              <button className="profile-menu-item" onClick={handleLogout} role="menuitem">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
