import React, { useState, useEffect } from 'react'
import { DemoProvider, useDemoMode } from './DemoProvider'
import { DemoAuthFlow } from './pages/DemoAuthFlow'
import { DemoTrending } from './pages/DemoTrending'
import { DemoWardrobe } from './pages/DemoWardrobe'
import { DemoTraining } from './pages/DemoTraining'
import { DemoAdmin } from './pages/DemoAdmin'

type DemoPage = 'trending' | 'wardrobe' | 'training' | 'admin'

const DemoNavigation: React.FC<{ currentPage: DemoPage; onNavigate: (page: DemoPage) => void }> = ({ currentPage, onNavigate }) => {
  const { userProfile, wardrobeImages, setDemoMode } = useDemoMode()

  const navItems = [
    { id: 'trending' as DemoPage, icon: '🔥', label: 'Trending' },
    { id: 'wardrobe' as DemoPage, icon: '❤️', label: 'Wardrobe', badge: wardrobeImages.length },
    { id: 'training' as DemoPage, icon: '🎯', label: 'Training' },
    { id: 'admin' as DemoPage, icon: '⚙️', label: 'Admin' }
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Looklyy
            </h1>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
              DEMO
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full"
            />
            <button
              onClick={() => {
                setDemoMode(false)
                localStorage.removeItem('looklyy_demo_authenticated')
                localStorage.removeItem('looklyy_demo_mode')
                window.location.href = '/'
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Exit Demo
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

const DemoAppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState<DemoPage>('trending')

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem('looklyy_demo_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }

    // Check URL hash for page routing
    const hash = window.location.hash.replace('#', '')
    if (hash && ['trending', 'wardrobe', 'training', 'admin'].includes(hash)) {
      setCurrentPage(hash as DemoPage)
    }

    // Listen for navigation events
    const handleNavigate = (e: CustomEvent) => {
      setCurrentPage('trending')
    }
    window.addEventListener('navigate-trending' as any, handleNavigate)
    
    return () => {
      window.removeEventListener('navigate-trending' as any, handleNavigate)
    }
  }, [])

  const handleNavigate = (page: DemoPage) => {
    setCurrentPage(page)
    window.location.hash = page
  }

  if (!isAuthenticated) {
    return <DemoAuthFlow onAuthComplete={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #e9d5ff 50%, #ddd6fe 75%, #c4b5fd 100%)' }}>
      <DemoNavigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === 'trending' && <DemoTrending />}
      {currentPage === 'wardrobe' && <DemoWardrobe />}
      {currentPage === 'training' && <DemoTraining />}
      {currentPage === 'admin' && <DemoAdmin />}
    </div>
  )
}

export const DemoApp: React.FC = () => {
  return (
    <DemoProvider>
      <DemoAppContent />
    </DemoProvider>
  )
}
