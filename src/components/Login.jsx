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
    <div className="auth-form">
      <h2>Sign in</h2>
      
      <div className="social-login">
        <button className="social-btn google">G</button>
        <button className="social-btn facebook">f</button>
      </div>
      
      <p className="divider">or use your account</p>
      
      <form onSubmit={handleSubmit}>
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
        
        <button type="submit" disabled={isLoading} className="auth-btn">
          {isLoading ? 'Signing in...' : 'SIGN IN'}
        </button>
      </form>
    </div>
  )
}
