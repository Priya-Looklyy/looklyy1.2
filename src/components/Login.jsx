import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const Login = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  
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
    <>
      <h2 className="auth-title">Login</h2>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="auth-button"
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Signing In...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Create an account?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToSignup}
          >
            SignUp
          </button>
        </p>
      </div>

      <div className="demo-credentials">
        <p className="demo-text">Demo: Use any email and password to sign in</p>
      </div>
    </>
  )
}

export default Login