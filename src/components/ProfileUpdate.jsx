import React, { useState, useEffect } from 'react'
import './ProfileUpdate.css'

const ProfileUpdate = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    topSize: '',
    bottomSize: '',
    age: '',
    bodyType: '',
    colorTone: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showColorToneHelp, setShowColorToneHelp] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-dismiss color tone help after 6 seconds
  useEffect(() => {
    if (showColorToneHelp) {
      const timer = setTimeout(() => {
        setShowColorToneHelp(false)
      }, 6000) // 6 seconds

      return () => clearTimeout(timer)
    }
  }, [showColorToneHelp])

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
    if (!formData.topSize) {
      newErrors.topSize = 'Please select your top size'
    }

    if (!formData.bottomSize) {
      newErrors.bottomSize = 'Please select your bottom size'
    }

    if (!formData.age) {
      newErrors.age = 'Please select your age'
    }

    if (!formData.bodyType) {
      newErrors.bodyType = 'Please select your body type'
    }

    if (!formData.colorTone) {
      newErrors.colorTone = 'Please select your color tone'
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
    const hasAllAttributes = formData.topSize && formData.bottomSize && formData.age && formData.bodyType && formData.colorTone
    
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
          <h1 className="profile-title">Help us personalize your experience</h1>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Section 1: Contact Information */}
          <section className="profile-section">
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

          {/* Section 2: Your Specifics */}
          <section className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Your Specifics <span className="required-asterisk">*</span></h2>
            </div>

            {/* Size Selection - Top Sizes */}
            <div className="card-select-group">
              <label className="card-select-label">Top Sizes <span className="required-asterisk">*</span></label>
              <div className="card-grid">
                {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`select-card ${formData.topSize === size ? 'selected' : ''} ${errors.topSize ? 'card-error' : ''}`}
                    onClick={() => handleCardSelect('topSize', size)}
                  >
                    <span className="card-text">{size}</span>
                  </button>
                ))}
              </div>
              {errors.topSize && (
                <span className="error-message">{errors.topSize}</span>
              )}
            </div>

            {/* Size Selection - Bottom Sizes */}
            <div className="card-select-group">
              <label className="card-select-label">Bottom Sizes <span className="required-asterisk">*</span></label>
              <div className="card-grid">
                {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`select-card ${formData.bottomSize === size ? 'selected' : ''} ${errors.bottomSize ? 'card-error' : ''}`}
                    onClick={() => handleCardSelect('bottomSize', size)}
                  >
                    <span className="card-text">{size}</span>
                  </button>
                ))}
              </div>
              {errors.bottomSize && (
                <span className="error-message">{errors.bottomSize}</span>
              )}
            </div>

            {/* Age */}
            <div className="card-select-group">
              <label className="card-select-label">Age <span className="required-asterisk">*</span></label>
              <div className="card-grid">
                {['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'].map((age) => (
                  <button
                    key={age}
                    type="button"
                    className={`select-card ${formData.age === age ? 'selected' : ''} ${errors.age ? 'card-error' : ''}`}
                    onClick={() => handleCardSelect('age', age)}
                  >
                    <span className="card-text">{age}</span>
                  </button>
                ))}
              </div>
              {errors.age && (
                <span className="error-message">{errors.age}</span>
              )}
            </div>

            {/* Body Type */}
            <div className="card-select-group">
              <label className="card-select-label">Choose body type <span className="required-asterisk">*</span></label>
              <div className="card-grid body-type-grid">
                {[
                  { 
                    id: 'apple', 
                    label: 'Apple',
                    svg: (
                      <svg className="body-type-illustration" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                        {/* Body outline */}
                        <path d="M100 20 Q90 30 85 50 Q80 70 85 100 Q90 130 95 150 Q100 170 100 200 Q100 230 95 250 Q90 270 85 280 Q80 290 100 290 Q120 290 115 280 Q110 270 105 250 Q100 230 100 200 Q100 170 105 150 Q110 130 115 100 Q120 70 115 50 Q110 30 100 20 Z" 
                              fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Arms */}
                        <path d="M85 50 Q70 60 65 80" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M115 50 Q130 60 135 80" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Legs */}
                        <path d="M100 280 Q95 300 90 300" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M100 280 Q105 300 110 300" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Apple shape overlay */}
                        <ellipse cx="100" cy="150" rx="45" ry="70" fill="rgba(251, 182, 206, 0.3)" stroke="rgba(251, 182, 206, 0.5)" strokeWidth="1"/>
                      </svg>
                    )
                  },
                  { 
                    id: 'pear', 
                    label: 'Pear',
                    svg: (
                      <svg className="body-type-illustration" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                        {/* Body outline - pear shape with narrower shoulders and wider hips */}
                        <path d="M100 20 Q90 25 85 40 Q80 55 82 75 Q84 95 88 110 Q92 125 95 140 Q98 155 100 170 Q100 185 100 200 Q100 215 100 230 Q100 245 98 260 Q96 275 92 285 Q88 295 85 300 Q100 300 115 300 Q112 295 108 285 Q104 275 102 260 Q100 245 100 230 Q100 215 100 200 Q100 185 100 170 Q102 155 105 140 Q108 125 112 110 Q116 95 118 75 Q120 55 115 40 Q110 25 100 20 Z" 
                              fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Head */}
                        <circle cx="100" cy="20" r="8" fill="none" stroke="#1f2937" strokeWidth="2.5"/>
                        {/* Arms - narrower */}
                        <path d="M85 40 Q70 50 60 70" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
                        <path d="M115 40 Q130 50 140 70" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
                        {/* Legs */}
                        <path d="M100 300 Q95 315 88 325" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
                        <path d="M100 300 Q105 315 112 325" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
                        {/* Pear shape overlay - inverted triangle, more pronounced */}
                        <path d="M100 180 L65 280 L135 280 Z" fill="rgba(251, 182, 206, 0.35)" stroke="rgba(251, 182, 206, 0.6)" strokeWidth="1.5"/>
                      </svg>
                    )
                  },
                  { 
                    id: 'hourglass', 
                    label: 'Hourglass',
                    svg: (
                      <svg className="body-type-illustration" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                        {/* Body outline */}
                        <path d="M100 20 Q90 30 85 50 Q80 70 85 100 Q90 120 95 140 Q100 160 100 200 Q100 240 95 260 Q90 280 85 290 Q80 300 100 300 Q120 300 115 290 Q110 280 105 260 Q100 240 100 200 Q100 160 105 140 Q110 120 115 100 Q120 70 115 50 Q110 30 100 20 Z" 
                              fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Arms */}
                        <path d="M85 50 Q70 60 65 80" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M115 50 Q130 60 135 80" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Legs */}
                        <path d="M100 300 Q95 320 90 320" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M100 300 Q105 320 110 320" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Hourglass shape overlay */}
                        <path d="M100 80 L130 140 L100 200 L70 140 Z" fill="rgba(251, 182, 206, 0.3)" stroke="rgba(251, 182, 206, 0.5)" strokeWidth="1"/>
                      </svg>
                    )
                  },
                  { 
                    id: 'rectangle', 
                    label: 'Rectangle',
                    svg: (
                      <svg className="body-type-illustration" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                        {/* Body outline - straighter sides */}
                        <path d="M100 20 Q90 30 85 50 Q80 70 85 100 Q85 130 85 150 Q85 170 85 200 Q85 230 85 250 Q85 270 85 280 Q85 290 100 290 Q115 290 115 280 Q115 270 115 250 Q115 230 115 200 Q115 170 115 150 Q115 130 115 100 Q120 70 115 50 Q110 30 100 20 Z" 
                              fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Arms */}
                        <path d="M85 50 Q70 60 65 80" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M115 50 Q130 60 135 80" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Legs */}
                        <path d="M100 290 Q95 310 90 310" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M100 290 Q105 310 110 310" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Rectangle shape overlay */}
                        <rect x="75" y="80" width="50" height="200" fill="rgba(251, 182, 206, 0.3)" stroke="rgba(251, 182, 206, 0.5)" strokeWidth="1" rx="5"/>
                      </svg>
                    )
                  },
                  { 
                    id: 'inverted-triangle', 
                    label: 'Inverted Triangle',
                    svg: (
                      <svg className="body-type-illustration" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                        {/* Body outline - wider shoulders */}
                        <path d="M100 20 Q90 30 85 50 Q80 70 90 100 Q100 130 110 150 Q120 170 120 200 Q120 230 115 250 Q110 270 105 280 Q100 290 100 300 Q100 310 95 300 Q90 290 85 280 Q80 270 75 250 Q70 230 70 200 Q70 170 80 150 Q90 130 100 100 Q110 70 115 50 Q110 30 100 20 Z" 
                              fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Arms - wider */}
                        <path d="M85 50 Q70 60 60 80" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M115 50 Q130 60 140 80" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Legs */}
                        <path d="M100 300 Q95 320 90 320" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M100 300 Q105 320 110 320" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                        {/* Inverted triangle overlay */}
                        <path d="M100 80 L130 200 L70 200 Z" fill="rgba(251, 182, 206, 0.3)" stroke="rgba(251, 182, 206, 0.5)" strokeWidth="1"/>
                      </svg>
                    )
                  }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`select-card body-type-card ${formData.bodyType === type.id ? 'selected' : ''} ${errors.bodyType ? 'card-error' : ''}`}
                    onClick={() => handleCardSelect('bodyType', type.id)}
                  >
                    <div className="body-sketch">{type.svg}</div>
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
              <div className="label-with-help">
                <label className="card-select-label">Choose your colour tone <span className="required-asterisk">*</span></label>
                <div className={`help-wrapper ${showColorToneHelp ? 'show-help' : ''}`}>
                  <button
                    type="button"
                    className="help-icon-button"
                    onClick={() => {
                      // Toggle on mobile
                      if (isMobile) {
                        setShowColorToneHelp(!showColorToneHelp)
                      }
                    }}
                    aria-label="Learn about color tones"
                  >
                    <svg className="help-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="17" r="1" fill="currentColor"/>
                    </svg>
                  </button>
                  <div 
                    className="help-overlay" 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowColorToneHelp(false)
                    }}
                  />
                  <div 
                    className={`color-tone-help-tooltip ${showColorToneHelp ? 'visible' : ''}`}
                    onClick={(e) => {
                      // Prevent clicks inside tooltip from closing it
                      e.stopPropagation()
                    }}
                    onMouseEnter={() => {
                      // Keep open on hover for desktop
                      if (!isMobile) {
                        // Don't auto-close if user is hovering
                      }
                    }}
                    onMouseLeave={() => {
                      // Hide on mouse leave for desktop
                      if (!isMobile) {
                        setShowColorToneHelp(false)
                      }
                    }}
                  >
                        <div className="tooltip-header">
                          <h3 className="tooltip-title">How to Choose Your Color Tone</h3>
                          <button
                            type="button"
                            className="tooltip-close"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setShowColorToneHelp(false)
                            }}
                            aria-label="Close"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                        <div className="tooltip-content">
                          <div className="tone-explanation">
                            <div className="tone-item">
                              <div className="tone-color-indicator" style={{ backgroundColor: '#FF6B6B' }}></div>
                              <div>
                                <strong>Warm Tones</strong>
                                <p>Your skin has golden, peachy, or yellow undertones. You look best in colors like coral, peach, gold, warm reds, and olive greens.</p>
                              </div>
                            </div>
                            <div className="tone-item">
                              <div className="tone-color-indicator" style={{ backgroundColor: '#4ECDC4' }}></div>
                              <div>
                                <strong>Cool Tones</strong>
                                <p>Your skin has pink, red, or blue undertones. You look best in colors like blue, purple, emerald green, and cool pinks.</p>
                              </div>
                            </div>
                            <div className="tone-item">
                              <div className="tone-color-indicator" style={{ backgroundColor: '#95A5A6' }}></div>
                              <div>
                                <strong>Neutral</strong>
                                <p>Your skin has a balance of warm and cool undertones. You can wear a wide range of colors from both warm and cool palettes.</p>
                              </div>
                            </div>
                          </div>
                          <div className="tone-tip">
                            <p><strong>Quick Test:</strong> Look at the veins on your wrist. Blue/purple veins suggest cool tones, green veins suggest warm tones, and a mix suggests neutral.</p>
                          </div>
                          <p className="tone-note">Don't worry if you're unsure — you can always update this later!</p>
                        </div>
                      </div>
                </div>
              </div>
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
