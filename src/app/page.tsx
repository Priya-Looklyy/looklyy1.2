'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import WaitlistEmailStep from '@/components/WaitlistEmailStep';
import PhoneInput from '@/components/PhoneInput';
import WaitlistSuccess from '@/components/WaitlistSuccess';
import { submitWaitlist as submitWaitlistToDB } from '@/lib/supabase';

// Analytics tracking hook
function useAnalytics() {
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview');
    }
  }, []);

  const trackEvent = (eventName: string, props?: Record<string, string | number | boolean>) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, { props });
    }
  };

  return { trackEvent };
}

// Step state machine type
type StepState = 'email' | 'phone' | 'submitting' | 'success';

export default function Home() {
  const [email, setEmail] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [arrowRipple, setArrowRipple] = useState<'left' | 'right' | null>(null);
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false);
  const [waitlistCardIndex, setWaitlistCardIndex] = useState(0);
  const [stepState, setStepState] = useState<StepState>('email');
  const { trackEvent } = useAnalytics();

  // Auto-advance waitlist cards
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitlistCardIndex((prev) => (prev + 1) % 3);
    }, 4000); // Change card every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // Generate slider images array (using demo-images or fallback to single image)
  // Handle files that might not have .jpg extension (files 10 and 11)
  const sliderImagesArray = Array.from({ length: 27 }, (_, i) => {
    const num = i + 1;
    // Files 10 and 11 don't have .jpg extension
    if (num === 10 || num === 11) {
      return `/demo-images/${num}`;
    }
    return `/demo-images/${num}.jpg`;
  });

  // Get visible slides (center + 2-3 on each side = 5-7 total cards)
  const getVisibleSlides = useCallback(() => {
    const cardsPerSide = 3; // 3 cards on each side of center
    const slides = [];
    
    for (let i = -cardsPerSide; i <= cardsPerSide; i++) {
      const index = (currentSlideIndex + i + sliderImagesArray.length) % sliderImagesArray.length;
      slides.push({
        index,
        src: sliderImagesArray[index],
        position: i, // 0 is center, negative = left, positive = right
        caption: `Fashion Look ${index + 1}`,
      });
    }
    return slides;
  }, [currentSlideIndex, sliderImagesArray]);

  // Preload images for visible slides
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const visibleSlides = getVisibleSlides();
    const imagesToPreload = visibleSlides.map(slide => slide.src);
    
    imagesToPreload.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      // Preload in background, don't wait for it
    });
  }, [getVisibleSlides]);

  // Auto-advance slider - Disabled until images load properly
  useEffect(() => {
    // Only auto-advance if current image is loaded
    if (!currentImageLoaded) return;
    
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliderImagesArray.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, [currentImageLoaded, sliderImagesArray.length]);

  // Navigation handlers with animation states
  const goToNextSlide = () => {
    if (isSliding) return;
    setIsSliding(true);
    setArrowRipple('right');
    setCurrentSlideIndex((prev) => (prev + 1) % sliderImagesArray.length);
    setTimeout(() => {
      setIsSliding(false);
      setArrowRipple(null);
    }, 500); // Match transition duration
  };

  const goToPrevSlide = () => {
    if (isSliding) return;
    setIsSliding(true);
    setArrowRipple('left');
    setCurrentSlideIndex((prev) => (prev - 1 + sliderImagesArray.length) % sliderImagesArray.length);
    setTimeout(() => {
      setIsSliding(false);
      setArrowRipple(null);
    }, 500); // Match transition duration
  };

  // Polaroid Card Component - ALL cards use this same structure
  const PolaroidCard = ({ image, caption, isActive }: { image: string; caption: string; isActive: boolean }) => {
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState(image);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // Reset error state when image changes
    useEffect(() => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setImageError(false);
      setImageSrc(image);
      setIsLoading(true);
      setHasLoaded(false);

      // Set timeout: if image doesn't load in 10 seconds, try fallback
      timeoutRef.current = setTimeout(() => {
        if (!hasLoaded && imageSrc === image) {
          console.warn(`Image loading timeout: ${image}, trying fallback`);
          if (image !== '/single-homepage-image.jpg') {
            setImageSrc('/single-homepage-image.jpg');
            setIsLoading(true);
            setHasLoaded(false);
          } else {
            setImageError(true);
            setIsLoading(false);
          }
        }
      }, 10000); // 10 second timeout

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [image]);

    // Preload image when component mounts or image changes
    useEffect(() => {
      if (typeof window === 'undefined') return;
      
      const preloadImg = document.createElement('img');
      preloadImg.onload = () => {
        // Image is cached, mark as loaded
        if (preloadImg.src === imageSrc || preloadImg.src.endsWith(imageSrc)) {
          setIsLoading(false);
          setHasLoaded(true);
          if (isActive) {
            setCurrentImageLoaded(true);
          }
        }
      };
      preloadImg.onerror = () => {
        // Preload failed, but let the actual img tag handle the error
        if ((preloadImg.src === imageSrc || preloadImg.src.endsWith(imageSrc)) && imageSrc !== '/single-homepage-image.jpg') {
          // Try fallback
          setImageSrc('/single-homepage-image.jpg');
        }
      };
      preloadImg.src = imageSrc;

      return () => {
        preloadImg.onload = null;
        preloadImg.onerror = null;
      };
    }, [imageSrc, isActive]);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (imageSrc !== '/single-homepage-image.jpg') {
        // First error: try fallback image
        console.warn(`Image failed to load: ${imageSrc}, falling back to default`);
        setImageSrc('/single-homepage-image.jpg');
        setIsLoading(true);
        setHasLoaded(false);
      } else {
        // Fallback also failed: show error state
        console.error(`Fallback image also failed to load`);
        setImageError(true);
        setIsLoading(false);
        setHasLoaded(false);
      }
    };

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      // Clear timeout since image loaded successfully
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setIsLoading(false);
      setHasLoaded(true);
      
      // If this is the active image, mark it as loaded for auto-slide
      if (isActive) {
        setCurrentImageLoaded(true);
      }
    };

    return (
      <div className={`bg-white rounded-2xl shadow-2xl p-4 pb-10 w-[280px] sm:w-[320px] lg:w-[380px] transition-all duration-500 ${
        isActive ? 'hover:scale-105 cursor-pointer' : ''
      }`}>
        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 relative">
          {isLoading && !hasLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          )}
          {!imageError && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt={caption}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoading && !hasLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="eager"
              decoding="async"
              crossOrigin="anonymous"
              style={{
                display: isLoading && !hasLoaded ? 'none' : 'block',
              }}
            />
          )}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
              <div className="text-center p-4">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-500">Image unavailable</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          {caption}
        </div>
      </div>
    );
  };

  // Auto-close thank you modal after 5 seconds
  useEffect(() => {
    if (showThankYouModal) {
      const timer = setTimeout(() => {
        setShowThankYouModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showThankYouModal]);

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll >= 25 && maxScroll < 50) {
          trackEvent('scroll', { depth: '25%' });
        } else if (maxScroll >= 50 && maxScroll < 75) {
          trackEvent('scroll', { depth: '50%' });
        } else if (maxScroll >= 75 && maxScroll < 100) {
          trackEvent('scroll', { depth: '75%' });
        } else if (maxScroll >= 100) {
          trackEvent('scroll', { depth: '100%' });
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackEvent]);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      trackEvent('time_on_page', { seconds: timeOnPage });
    };
  }, [trackEvent]);

  const submitWaitlist = async (email: string, phone: string) => {
    // Prevent duplicate submissions
    if (stepState === 'submitting' || stepState === 'success') {
      return;
    }

    setError('');
    setStepState('submitting');

    const formStartTime = Date.now();

    // Track form start
    trackEvent('form_start');

    try {
      const result = await submitWaitlistToDB(email, phone || null);

      if (!result.success) {
        throw new Error(result.error || 'Something went wrong');
      }

      // Track successful registration
      const timeToRegister = Math.round((Date.now() - formStartTime) / 1000);
      trackEvent('registration', {
        time_to_register: timeToRegister,
        has_phone: !!phone,
      });

      setStepState('success');
      setShowThankYouModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register. Please try again.';
      setError(errorMessage);
      trackEvent('form_error', { error: errorMessage });
      setStepState('phone'); // Return to phone step on error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formStartTime = Date.now();

    // Track form start
    trackEvent('form_start');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Track successful registration
      const timeToRegister = Math.round((Date.now() - formStartTime) / 1000);
      trackEvent('registration', {
        time_to_register: timeToRegister,
        has_name: !!name,
      });

      setIsSubmitted(true);
      setShowThankYouModal(true); // Show thank you modal
      setEmail('');
      setName('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register. Please try again.';
      setError(errorMessage);
      trackEvent('form_error', { error: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCTAClick = (location: string) => {
    trackEvent('cta_click', { location });
  };

  return (
    <>
      <div 
        className="bg-white"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        {/* Main Container */}
        <div 
          className="w-full flex-1 flex flex-col"
          style={{
            maxWidth: '420px',
            width: '100%',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          {/* Navigation - Minimalist */}
          <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
            <div className="flex justify-between items-center h-14">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="text-xl font-light tracking-tight text-gray-900">Looklyy</span>
              </div>
              <span className="text-sm text-gray-500 font-light">Hello</span>
            </div>
          </nav>

        {/* Thank You Modal */}
        {showThankYouModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm mx-4 transform transition-all animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-base text-gray-900 font-light leading-relaxed">
                  Thank you for your interest in looklyy. Our team will reach out to you soon!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section - New Structure */}
        <div className="w-full overflow-x-hidden">
          <section className="w-full pt-14">
            {/* Headline Section */}
            <div className="px-6 pt-9 pb-8 lg:pt-14 lg:pb-12">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-light leading-tight text-gray-900 mb-8 lg:mb-12">
                  As you shop, what if you could see why some outfits work and others don&apos;t?
                </h1>
              </div>
            </div>

            {/* Image Sliders Section */}
            <div className="px-6 pb-12 lg:pb-16">
              <div className="max-w-7xl mx-auto">
                {/* Mobile Slider */}
                <div className="flex justify-center lg:hidden">
                  <div className="relative w-full flex items-center justify-center overflow-visible" style={{ minHeight: '400px', width: '100%' }}>
                    {getVisibleSlides().map((slide) => {
                      const isCenter = slide.position === 0;
                      const scale = isCenter ? 1 : 0.85;
                      const opacity = isCenter ? 1 : 0.5;
                      const zIndex = isCenter ? 30 : 10;
                      const translateX = slide.position === 0 ? 0 : slide.position * 20;
                      const rotation = isCenter ? 0 : slide.position > 0 ? 2 : -2;

                      return (
                        <div
                          key={`${slide.index}-${slide.position}`}
                          className="absolute flex justify-center transition-all duration-500 ease-in-out"
                          style={{
                            left: '50%',
                            transform: `translateX(calc(-50% + ${translateX}px)) scale(${scale}) rotate(${rotation}deg)`,
                            zIndex: zIndex,
                            opacity: opacity,
                            transformOrigin: 'center center',
                          }}
                        >
                          <PolaroidCard 
                            image={slide.src} 
                            caption={slide.caption}
                            isActive={isCenter}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop Slider */}
                <div className="hidden lg:flex lg:justify-center lg:relative lg:w-full">
                  <div className="relative w-full max-w-[520px]">
                    {/* Navigation Arrow - Left */}
                    <button
                      onClick={goToPrevSlide}
                      disabled={isSliding}
                      className={`group absolute top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm shadow-md hover:scale-110 transition-all duration-300 ease-in-out -left-6 ${
                        isSliding && arrowRipple === 'left' 
                          ? 'opacity-70 scale-95' 
                          : 'opacity-80 hover:opacity-100 active:scale-95'
                      } ${
                        arrowRipple === 'left' ? 'shadow-lg' : ''
                      }`}
                      aria-label="Previous slide"
                    >
                      <svg 
                        className={`w-5 h-5 transition-all duration-300 ease-in-out ${
                          arrowRipple === 'left' ? '-translate-x-0.5' : 'group-hover:-translate-x-0.5'
                        }`}
                        fill="none" 
                        stroke="#5a5147" 
                        strokeWidth={1.5}
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M15 19l-7-7 7-7" />
                      </svg>
                      {arrowRipple === 'left' && (
                        <span className="absolute inset-0 rounded-full bg-stone-400/20 arrow-ripple"></span>
                      )}
                    </button>

                    {/* Polaroid Cards Container - Desktop */}
                    <div className="relative w-full flex items-center justify-center overflow-visible" style={{ minHeight: '500px', width: '100%' }}>
                      {getVisibleSlides().map((slide) => {
                        const isCenter = slide.position === 0;
                        const scale = isCenter ? 1 : 0.9;
                        const opacity = isCenter ? 1 : 0.65;
                        const zIndex = isCenter ? 30 : 10;
                        const translateX = slide.position === 0 ? 0 : slide.position * 24;
                        const rotation = isCenter ? 0 : slide.position > 0 ? 1 : -1;

                        return (
                          <div
                            key={`${slide.index}-${slide.position}`}
                            className="absolute flex justify-center transition-all duration-500 ease-in-out"
                            style={{
                              left: '50%',
                              transform: `translateX(calc(-50% + ${translateX}px)) scale(${scale}) rotate(${rotation}deg)`,
                              zIndex: zIndex,
                              opacity: opacity,
                              transformOrigin: 'center center',
                            }}
                          >
                            <PolaroidCard 
                              image={slide.src} 
                              caption={slide.caption}
                              isActive={isCenter}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Navigation Arrow - Right */}
                    <button
                      onClick={goToNextSlide}
                      disabled={isSliding}
                      className={`group absolute top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm shadow-md hover:scale-110 transition-all duration-300 ease-in-out -right-6 ${
                        isSliding && arrowRipple === 'right' 
                          ? 'opacity-70 scale-95' 
                          : 'opacity-80 hover:opacity-100 active:scale-95'
                      } ${
                        arrowRipple === 'right' ? 'shadow-lg' : ''
                      }`}
                      aria-label="Next slide"
                    >
                      <svg 
                        className={`w-5 h-5 transition-all duration-300 ease-in-out ${
                          arrowRipple === 'right' ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'
                        }`}
                        fill="none" 
                        stroke="#5a5147" 
                        strokeWidth={1.5}
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                      {arrowRipple === 'right' && (
                        <span className="absolute inset-0 rounded-full bg-stone-400/20 arrow-ripple"></span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subheadline Section */}
            <div className="px-6 pb-12 lg:pb-16">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-base sm:text-lg lg:text-2xl font-light text-gray-700 leading-relaxed">
                  We are exploring the idea.
                  <br />
                  We want to know how you decide what to wear.
                </p>
              </div>
            </div>

            {/* Email CTA Section */}
            <div className="px-6 pb-12 lg:pb-16">
              <div className="max-w-2xl mx-auto mobile-content-column">
                {stepState === 'success' ? (
                  <WaitlistSuccess stepState={stepState} />
                ) : (
                  <>
                    <WaitlistEmailStep 
                      stepState={stepState} 
                      setStepState={setStepState}
                      onEmailSubmit={setWaitlistEmail}
                    />
                    <PhoneInput 
                      stepState={stepState} 
                      setStepState={setStepState}
                      email={waitlistEmail}
                      submitWaitlist={submitWaitlist}
                    />
                  </>
                )}
              </div>
            </div>

            {/* When You Join the Waitlist Section */}
            <div className="px-6 pt-12 pb-16 lg:pt-14 lg:pb-20">
              <div className="max-w-6xl mx-auto mobile-content-column">
                {/* Heading */}
                <h2 
                  className="section-title text-center"
                  style={{ 
                    marginTop: 'var(--space-xl)',
                    marginBottom: 'var(--space-md)'
                  }}
                >
                  When you join the waitlist
                </h2>
                
                {/* Cards Slider */}
                <div className="relative">
                  {/* Mobile: Single Card Display with Auto-swipe */}
                  <div className="lg:hidden relative overflow-hidden" style={{ marginBottom: 'var(--space-sm)' }}>
                    <div className="flex items-center justify-center relative" style={{ minHeight: '120px' }}>
                      {[
                        { text: 'We will talk about', text2: 'how you choose clothes' },
                        { text: 'You will see early ideas', text2: 'and react to them' },
                        { text: 'You can influence', text2: 'what gets built' }
                      ].map((card, index) => {
                        const isActive = index === waitlistCardIndex;
                        return (
                          <div
                            key={index}
                            className="bg-white rounded-[18px] border border-gray-100 transition-all duration-500 ease-in-out flex items-center justify-center text-center"
                            style={{ 
                              position: 'absolute',
                              left: '50%',
                              minHeight: '120px',
                              padding: 'var(--space-md)',
                              width: '260px',
                              maxWidth: '260px',
                              transform: isActive ? 'translateX(-50%) scale(1)' : 'translateX(-50%) translateX(1000px) scale(0.9)',
                              opacity: isActive ? 1 : 0,
                              zIndex: isActive ? 10 : 1,
                              boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.08), 0 8px 24px -8px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02)',
                              pointerEvents: isActive ? 'auto' : 'none',
                            }}
                          >
                            <p className="body-large text-gray-800" style={{ fontSize: '16px', lineHeight: '1.5', maxWidth: '260px' }}>
                              {card.text}
                              <br />
                              {card.text2}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    {/* Mobile Dots Indicator */}
                    <div 
                      className="flex justify-center gap-2 relative z-20"
                      style={{ marginBottom: 'var(--space-xl)' }}
                    >
                      {[0, 1, 2].map((index) => (
                        <button
                          key={index}
                          onClick={() => setWaitlistCardIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === waitlistCardIndex
                              ? 'bg-purple-600 w-8'
                              : 'bg-gray-300'
                          }`}
                          aria-label={`Go to card ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Desktop: Slider with Auto-swipe */}
                  <div className="hidden lg:block relative px-12 mb-8">
                    {/* Cards Container */}
                    <div className="flex items-center justify-center gap-6 overflow-hidden relative" style={{ minHeight: '200px' }}>
                      {[
                        { text: 'We will talk about', text2: 'how you choose clothes' },
                        { text: 'You will see early ideas', text2: 'and react to them' },
                        { text: 'You can influence', text2: 'what gets built' }
                      ].map((card, index) => {
                        const isActive = index === waitlistCardIndex;

                        return (
                          <div
                            key={index}
                            className="bg-white rounded-3xl p-8 w-[240px] flex-shrink-0 border border-gray-100 transition-all duration-500 ease-in-out cursor-pointer hover:scale-[1.02]"
                            style={{
                              position: 'absolute',
                              left: '50%',
                              transform: isActive ? 'translateX(-50%) scale(1)' : 'translateX(-50%) translateX(1000px) scale(0.9)',
                              opacity: isActive ? 1 : 0,
                              zIndex: isActive ? 10 : 1,
                              boxShadow: isActive 
                                ? '0 25px 70px -12px rgba(0, 0, 0, 0.12), 0 12px 32px -8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03), 0 0 0 0px rgba(147, 51, 234, 0.1)'
                                : '0 15px 45px -10px rgba(0, 0, 0, 0.08), 0 6px 18px -6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02)',
                              pointerEvents: isActive ? 'auto' : 'none',
                            }}
                            onClick={() => setWaitlistCardIndex(index)}
                          >
                            <p className="text-base font-light text-gray-800 leading-relaxed tracking-wide text-center">
                              {card.text}
                              <br />
                              {card.text2}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8 relative z-20">
                      {[0, 1, 2].map((index) => (
                        <button
                          key={index}
                          onClick={() => setWaitlistCardIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === waitlistCardIndex
                              ? 'bg-purple-600 w-8'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to card ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p 
                  className="body-large text-center italic"
                  style={{ marginTop: 'var(--space-xl)' }}
                >
                  Just a small conversation.
                </p>
              </div>
            </div>

            {/* Some outfits feel right Section */}
            <div 
              className="px-6 pb-16 lg:pb-20 bg-gray-50 pt-14 lg:pt-16 mobile-content-column"
              style={{ marginTop: 'var(--space-xxl)' }}
            >
              <div className="max-w-3xl mx-auto text-center">
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 leading-relaxed">
                    Some outfits feel right, others don&apos;t.
                  </p>
                  <p 
                    className="text-lg sm:text-xl lg:text-2xl font-light text-gray-700 leading-relaxed"
                    style={{ marginTop: 'var(--space-md)' }}
                  >
                    If this sounds familiar, we should talk!
                  </p>
                </div>
                
                {/* CTA */}
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-4 items-center justify-center"
                  style={{ marginTop: 'var(--space-lg)' }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                    className="w-full sm:flex-1 border-b-2 border-gray-300 pb-2 outline-none focus:border-purple-600 transition-colors placeholder:text-gray-400 px-0 text-center sm:text-left"
                    onClick={() => handleCTAClick('second_email')}
                    style={{ marginBottom: 'var(--space-lg)' }}
                  />
                  <button
                    type="submit"
                    onClick={() => handleCTAClick('second_button')}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    style={{ marginBottom: 'var(--space-xl)' }}
                  >
                    {isSubmitting ? 'Joining...' : 'Join the early list'}
                  </button>
                </form>
              </div>
            </div>

            {/* Prefer Writing Section */}
            <div 
              className="px-6 py-12 lg:py-16 border-t border-gray-200 mobile-content-column"
              style={{ marginTop: 'var(--space-xxl)' }}
            >
              <div className="max-w-3xl mx-auto text-center">
                <p 
                  className="body-large text-gray-700"
                  style={{ marginBottom: 'var(--space-sm)' }}
                >
                  Prefer writing instead?
                </p>
                <a 
                  href="mailto:hello@looklyy.com" 
                  className="body-large text-purple-600 hover:text-purple-700 transition-colors"
                >
                  hello@looklyy.com
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-light">
              2025@looklyy, Privacy Rights Reserved
            </p>
          </div>
        </footer>
        </div>
      </div>
    </>
  );
}
