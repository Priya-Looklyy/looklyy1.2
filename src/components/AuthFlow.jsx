import React, { useState } from 'react'
import Login from './Login'
import Signup from './Signup'
import './Auth.css'

const AuthFlow = () => {
  const [currentView, setCurrentView] = useState('login') // 'login' or 'signup'

  const switchToSignup = () => setCurrentView('signup')
  const switchToLogin = () => setCurrentView('login')

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Half - Logo and Background */}
        <div className="auth-left">
          <div className="auth-logo-container">
            <div className="auth-logo">
              <span className="logo-l">L</span>
              <div className="logo-oo">
                <div className="logo-o">
                  <div className="logo-dot"></div>
                </div>
                <div className="logo-o">
                  <div className="logo-dot"></div>
                </div>
              </div>
              <span className="logo-klyy">klyy</span>
            </div>
          </div>
        </div>

        {/* Right Half - Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            {currentView === 'login' ? (
              <Login onSwitchToSignup={switchToSignup} />
            ) : (
              <Signup onSwitchToLogin={switchToLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthFlow
