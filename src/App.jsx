import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import HomePage from './components/HomePage'
import TrendingSection from './components/TrendingSection'
import LooklyySuggests from './components/LooklyySuggests'
import Closet from './components/Closet'
import AuthFlow from './components/AuthFlow'
import ProfileUpdate from './components/ProfileUpdate'
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
    console.log('🏠 Logo clicked - navigating to home')
    setCurrentSection('home') // Go to home page with sliders
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Ensure we're also clearing any hash that might interfere
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
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
        
        {/* Bottom Navigation - Mobile Only */}
        <BottomNav
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />
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
  const { isAuthenticated, isLoading, isProfileComplete, completeProfile } = useAuth()
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
    
    console.log('🔍 Demo mode check:', { currentPath, demoParam, storedDemoMode })
    
    // FORCE DEMO MODE FOR TESTING
    if (currentPath === '/demo' || demoParam === 'true' || storedDemoMode === 'true' || currentPath.includes('demo')) {
      console.log('✅ Demo mode activated!')
      setIsDemoMode(true)
      localStorage.setItem('looklyy_demo_mode', 'true')
      // Update URL to clean /demo path if not already there
      if (currentPath !== '/demo') {
        window.history.replaceState({}, '', '/demo')
      }
    } else {
      console.log('❌ Demo mode not activated')
    }
  }, [])

  // If demo mode is enabled, render regular app with demo data
  if (isDemoMode) {
    console.log('🎭 Demo mode enabled - using regular app with mock data')
    // Set demo flag in localStorage for components to use
    localStorage.setItem('looklyy_demo_mode', 'true')
  } else {
    console.log('🔴 Demo mode is FALSE, rendering regular app')
    localStorage.removeItem('looklyy_demo_mode')
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

  // Show auth flow if not authenticated
  if (!isAuthenticated) {
    return <AuthFlow />
  }

  // Show profile update if authenticated but profile not complete
  if (!isProfileComplete) {
    return <ProfileUpdate onComplete={completeProfile} />
  }

  // Show main app if authenticated and profile complete
  return <ProtectedApp />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
