import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const { signup, isLoading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signup(formData)
    
    if (result.success) {
      setFormData({ name: '', email: '', password: '' })
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
      <h2>Create Account</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <button type="submit" disabled={isLoading} className="auth-btn">
          {isLoading ? 'Creating Account...' : 'SIGN UP'}
        </button>
      </form>
    </div>
  )
}
