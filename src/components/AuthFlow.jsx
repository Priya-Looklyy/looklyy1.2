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
      {/* Welcome Header */}
      <div className="auth-welcome">
        <h1>WELCOME</h1>
      </div>

      {/* Form Container */}
      <div className="auth-form-container">
        <div className="auth-card">
          {currentView === 'login' ? (
            <Login onSwitchToSignup={switchToSignup} />
          ) : (
            <Signup onSwitchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthFlow