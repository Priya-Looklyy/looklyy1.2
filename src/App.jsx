import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import TrendingSection from './components/TrendingSection'
import LooklyySuggests from './components/LooklyySuggests'
import Closet from './components/Closet'
import AuthFlow from './components/AuthFlow'
import Admin from './pages/Admin'
import Training from './pages/Training'
import { DemoApp } from './demo/DemoApp'
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
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check for demo mode in multiple ways:
    // 1. URL path: /demo
    // 2. URL param: ?demo=true
    // 3. localStorage: looklyy_demo_mode
    const currentPath = window.location.pathname
    const urlParams = new URLSearchParams(window.location.search)
    const demoParam = urlParams.get('demo')
    const storedDemoMode = localStorage.getItem('looklyy_demo_mode')
    
    if (currentPath === '/demo' || demoParam === 'true' || storedDemoMode === 'true') {
      setIsDemoMode(true)
      localStorage.setItem('looklyy_demo_mode', 'true')
      // Update URL to clean /demo path if not already there
      if (currentPath !== '/demo') {
        window.history.replaceState({}, '', '/demo')
      }
    }
  }, [])

  // If demo mode is enabled, render demo app
  if (isDemoMode) {
    return <DemoApp />
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  // Check for special routes
  const currentPath = window.location.pathname
  const isAdminRoute = currentPath === '/admin'
  const isTrainingRoute = currentPath === '/training'

  if (isAdminRoute) {
    return <Admin />
  }

  if (isTrainingRoute) {
    return <Training />
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
