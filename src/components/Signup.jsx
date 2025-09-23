import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [validationErrors, setValidationErrors] = useState({})
  
  const { signup, isLoading, error, clearError } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation errors as user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    if (error) clearError()
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    const result = await signup(formData.name, formData.email, formData.password)
    if (!result.success) {
      // Error is handled by context
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      
      <div className="social-container">
        <a href="#" onClick={(e) => e.preventDefault()}>
          <i className="fab fa-google"></i>
        </a>
        <a href="#" onClick={(e) => e.preventDefault()}>
          <i className="fab fa-facebook-f"></i>
        </a>
      </div>
      
      <span>or use your email for registration</span>
      
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
        autoComplete="name"
      />
      {validationErrors.name && (
        <div className="field-error">{validationErrors.name}</div>
      )}
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        autoComplete="email"
      />
      {validationErrors.email && (
        <div className="field-error">{validationErrors.email}</div>
      )}
      
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
        autoComplete="new-password"
      />
      {validationErrors.password && (
        <div className="field-error">{validationErrors.password}</div>
      )}
      
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
        autoComplete="new-password"
      />
      {validationErrors.confirmPassword && (
        <div className="field-error">{validationErrors.confirmPassword}</div>
      )}
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Creating Account...
          </>
        ) : (
          'Sign Up'
        )}
      </button>
    </form>
  )
}

export default Signup