import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import TrendingSection from './components/TrendingSection'
import LooklyySuggests from './components/LooklyySuggests'
import Closet from './components/Closet'
import AuthFlow from './components/AuthFlow'
import { LookProvider } from './context/LookContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

// Protected App Component
function ProtectedApp() {
  const [currentSection, setCurrentSection] = useState('home') // Start with home page
  const { logout } = useAuth()

  const handleSectionChange = (section) => {
    setCurrentSection(section)
  }

  const goHome = () => {
    setCurrentSection('home') // Go to home page with sliders
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <LookProvider>
      <div className="app">
        <Navbar
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
          onLogoClick={goHome}
          onLogout={handleLogout}
        />
        
        <main className="main-content">
          {currentSection === 'home' && <HomePage />}
          {currentSection === 'trending' && <TrendingSection />}
          {currentSection === 'suggests' && <LooklyySuggests />}
          {currentSection === 'closet' && <Closet />}
        </main>
      </div>
    </LookProvider>
  )
}

// Loading Component
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1 className="loading-logo">LOOKLYY</h1>
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading your fashion experience...</p>
      </div>
    </div>
  )
}

// Main App Component with Auth Logic
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return isAuthenticated ? <ProtectedApp /> : <AuthFlow />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
