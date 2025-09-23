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
      <div className={`auth-card ${currentView === 'signup' ? 'right-panel-active' : ''}`}>
        {/* Sign In Container */}
        <div className="form-container sign-in-container">
          {currentView === 'login' ? (
            <Login onSwitchToSignup={switchToSignup} />
          ) : (
            <Signup onSwitchToLogin={switchToLogin} />
          )}
        </div>

        {/* Sign Up Container */}
        <div className="form-container sign-up-container">
          {currentView === 'signup' ? (
            <Signup onSwitchToLogin={switchToLogin} />
          ) : (
            <Login onSwitchToSignup={switchToSignup} />
          )}
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <button className="ghost" id="signIn" onClick={switchToLogin}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello!</h1>
              <button className="ghost" id="signUp" onClick={switchToSignup}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthFlow