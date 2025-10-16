import React from 'react'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = ({ currentSection, onSectionChange, onLogoClick, onLogout }) => {
  const { user } = useAuth()
  const navItems = [
    { id: 'trending', label: 'Trending' },
    { id: 'suggests', label: 'Looklyy Suggests' },
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
      
      <div className="nav-center">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${currentSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="nav-right">
        <div className="profile-info">
          <img 
            src={user?.avatar || '/default-avatar.png'} 
            alt={user?.name || 'User'}
            className="profile-avatar"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNENUQxRUIiLz4KPHN2Zz4=';
            }}
          />
          <span className="profile-name">Hi, {user?.name || 'User'}</span>
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
