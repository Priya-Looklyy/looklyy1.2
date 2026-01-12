import React, { useState, useEffect } from 'react'
import './ProfileUpdate.css'

const ProfileUpdate = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    ageGroup: '',
    bodyType: '',
    colorTone: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Autofill email if available from auth
  useEffect(() => {
    const token = localStorage.getItem('looklyy_token')
    // In a real app, you'd decode the token or fetch user data
    // For MVP, check if email was stored during signup/login
    const storedEmail = localStorage.getItem('looklyy_user_email')
    if (storedEmail) {
      setFormData(prev => ({ ...prev, email: storedEmail }))
    }
  }, [])

  const validateEmail = (email) => {
    if (!email) return true // Optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    if (!phone) return true // Optional
    // Basic validation: at least 10 digits, can include + for country code
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleCardSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user selects
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Section 1: At least one of email or phone required
    if (!formData.email && !formData.phone) {
      newErrors.contact = 'Please provide at least one way for us to contact you'
    }

    // Validate email format if provided
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate phone format if provided
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Section 2: All required
    if (!formData.ageGroup) {
      newErrors.ageGroup = 'Please select your age group'
    }

    if (!formData.bodyType) {
      newErrors.bodyType = 'Please select your body type'
    }

    if (!formData.colorTone) {
      newErrors.colorTone = 'Please select your color tone preference'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Store profile data
      const profileData = {
        ...formData,
        completedAt: new Date().toISOString()
      }
      localStorage.setItem('looklyy_profile', JSON.stringify(profileData))
      localStorage.setItem('looklyy_profile_complete', 'true')
      
      console.log('✅ Profile saved:', profileData)
      setIsSubmitting(false)
      
      // Call completion callback
      if (onComplete) {
        onComplete(profileData)
      }
    }, 500)
  }

  const isFormValid = () => {
    // Check if all required fields are filled
    const hasContact = formData.email || formData.phone
    const hasAllAttributes = formData.ageGroup && formData.bodyType && formData.colorTone
    
    // Validate formats
    const emailValid = !formData.email || validateEmail(formData.email)
    const phoneValid = !formData.phone || validatePhone(formData.phone)
    
    return hasContact && hasAllAttributes && emailValid && phoneValid
  }

  return (
    <div className="profile-update-container">
      <div className="profile-update-panel">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">Complete Your Profile</h1>
          <p className="profile-subtitle">Help us personalize your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Section 1: Personal Information */}
          <section className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Personal Information</h2>
              <span className="required-badge">Required</span>
            </div>
            <p className="section-helper">
              Provide at least one way for us to contact you
            </p>

            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`text-input ${errors.email || errors.contact ? 'input-error' : ''}`}
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="phone" className="input-label">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className={`text-input ${errors.phone || errors.contact ? 'input-error' : ''}`}
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            {errors.contact && (
              <div className="error-message section-error">{errors.contact}</div>
            )}
          </section>

          {/* Section 2: Basic Attributes */}
          <section className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Basic Attributes</h2>
              <span className="required-badge">Required</span>
            </div>

            {/* Age Group */}
            <div className="card-select-group">
              <label className="card-select-label">Age Group</label>
              <div className="card-grid">
                {['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'].map((age) => (
                  <button
                    key={age}
                    type="button"
                    className={`select-card ${formData.ageGroup === age ? 'selected' : ''} ${errors.ageGroup ? 'card-error' : ''}`}
                    onClick={() => handleCardSelect('ageGroup', age)}
                  >
                    <span className="card-text">{age}</span>
                  </button>
                ))}
              </div>
              {errors.ageGroup && (
                <span className="error-message">{errors.ageGroup}</span>
              )}
            </div>

            {/* Body Type */}
            <div className="card-select-group">
              <label className="card-select-label">Body Type</label>
              <p className="card-helper">
                Choose the option that feels closest — perfection isn't required
              </p>
              <div className="card-grid body-type-grid">
                {[
                  { id: 'apple', label: 'Apple', sketch: '🍎' },
                  { id: 'pear', label: 'Pear', sketch: '🍐' },
                  { id: 'hourglass', label: 'Hourglass', sketch: '⏳' },
                  { id: 'rectangle', label: 'Rectangle', sketch: '▭' },
                  { id: 'inverted-triangle', label: 'Inverted Triangle', sketch: '▽' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`select-card body-type-card ${formData.bodyType === type.id ? 'selected' : ''} ${errors.bodyType ? 'card-error' : ''}`}
                    onClick={() => handleCardSelect('bodyType', type.id)}
                  >
                    <div className="body-sketch">{type.sketch}</div>
                    <span className="card-text">{type.label}</span>
                  </button>
                ))}
              </div>
              {errors.bodyType && (
                <span className="error-message">{errors.bodyType}</span>
              )}
            </div>

            {/* Color Tone */}
            <div className="card-select-group">
              <label className="card-select-label">Color Tone Preference</label>
              <p className="card-helper">
                You can always update this later
              </p>
              <div className="card-grid color-tone-grid">
                {[
                  { id: 'warm', label: 'Warm tones', color: '#FF6B6B' },
                  { id: 'cool', label: 'Cool tones', color: '#4ECDC4' },
                  { id: 'neutral', label: 'Neutral', color: '#95A5A6' },
                  { id: 'not-sure', label: 'Not sure', color: '#BDC3C7' }
                ].map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    className={`select-card color-tone-card ${formData.colorTone === tone.id ? 'selected' : ''} ${errors.colorTone ? 'card-error' : ''}`}
                    onClick={() => handleCardSelect('colorTone', tone.id)}
                  >
                    <div 
                      className="color-indicator" 
                      style={{ backgroundColor: tone.color }}
                    />
                    <span className="card-text">{tone.label}</span>
                  </button>
                ))}
              </div>
              {errors.colorTone && (
                <span className="error-message">{errors.colorTone}</span>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className={`submit-button ${!isFormValid() || isSubmitting ? 'disabled' : ''}`}
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileUpdate
