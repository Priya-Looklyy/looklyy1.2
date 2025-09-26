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
          <p className="tagline">Simplifying Fashion For You!</p>
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
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0 1 18 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.46 1.27-4.64 3.19-5.9L6.96 4.96A8.967 8.967 0 0 0 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
          </svg>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
