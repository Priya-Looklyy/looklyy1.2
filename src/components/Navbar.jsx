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
            src={user?.avatar} 
            alt={user?.name}
            className="profile-avatar"
          />
          <span className="profile-name">Hi, {user?.name}</span>
        </div>
        <div className="logout-icon" onClick={onLogout} title="Logout">
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
