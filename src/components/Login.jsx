import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const Login = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const { login, isLoading, error, clearError } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      return
    }
    
    const result = await login(formData.email, formData.password)
    if (!result.success) {
      // Error is handled by context
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign in</h1>
      
      <div className="social-container">
        <a href="#" onClick={(e) => e.preventDefault()}>
          <i className="fab fa-github"></i>
        </a>
        <a href="#" onClick={(e) => e.preventDefault()}>
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a href="#" onClick={(e) => e.preventDefault()}>
          <i className="fab fa-google"></i>
        </a>
      </div>
      
      <span>or use your account</span>
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        autoComplete="email"
      />
      
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
        autoComplete="current-password"
      />
      
      <a href="#" onClick={(e) => e.preventDefault()}>Forgot your password?</a>
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      <button type="submit" disabled={isLoading || !formData.email || !formData.password}>
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}

export default Login