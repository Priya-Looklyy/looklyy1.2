import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { login, isLoading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if we're in demo mode
    const isDemoMode = localStorage.getItem('looklyy_demo_mode') === 'true'
    
    if (isDemoMode) {
      // Demo mode - simulate successful login
      console.log('🎭 Demo login successful')
      localStorage.setItem('looklyy_demo_authenticated', 'true')
      // Trigger a page reload to activate demo mode
      window.location.reload()
      return
    }
    
    // Regular login
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      setFormData({ email: '', password: '' })
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      <a href="#" className="forgot-password">Forgot your password?</a>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'SIGN IN'}
      </button>
    </form>
  )
}
