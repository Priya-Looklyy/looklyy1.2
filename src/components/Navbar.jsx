import React from 'react'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = ({ currentSection, onSectionChange, onLogoClick, onLogout }) => {
  const { user } = useAuth()
  const navItems = [
    { id: 'trending', label: 'Trending' },
    { id: 'suggests', label: 'Boards' },
    { id: 'closet', label: 'Closet' }
  ]

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo" onClick={onLogoClick}>
          <h1>LOOKLYY</h1>
          <p className="tagline">Simplifying fashion for you</p>
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
        <div className="profile-info">
          <div className="user-initials">PS</div>
        </div>
        <div className="logout-icon" onClick={onLogout} title="Logout">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
