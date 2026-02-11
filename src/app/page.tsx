'use client';

import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import Image from 'next/image';

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

export default function Home() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [arrowRipple, setArrowRipple] = useState<'left' | 'right' | null>(null);
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false);
  const { trackEvent } = useAnalytics();

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

    // Reset error state when image changes
    useEffect(() => {
      setImageError(false);
      setImageSrc(image);
      setIsLoading(true);
      setHasLoaded(false);
    }, [image]);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
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
      }
    };

    const handleImageLoad = () => {
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
              src={imageSrc}
              alt={caption}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoading && !hasLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="eager"
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

  // Get visible slides (center + 2-3 on each side = 5-7 total cards)
  const getVisibleSlides = () => {
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
      <div className="min-h-screen bg-white">
        {/* Navigation - Minimalist */}
        <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex justify-between items-center h-14">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="text-xl font-light tracking-tight text-gray-900">Looklyy</span>
              </div>
              <span className="text-sm text-gray-500 font-light">Hello</span>
            </div>
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

        {/* Hero Section - Mobile First Rebuild */}
        <div className="w-full overflow-x-hidden">
          <section className="w-full pt-14">
            <div className="px-6 pt-10 pb-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:max-w-7xl lg:mx-auto lg:px-8 lg:min-h-screen">
              
              {/* Mobile: Headline First */}
              <div className="lg:max-w-[480px]">
                {/* Headline - Exactly 2 lines, non-negotiable */}
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-light leading-tight max-w-[340px] lg:max-w-[480px] text-gray-900">
                  What if you could learn to style
                  <br />
                  as you shop?
                </h1>

                {/* Mobile: Slider - Image First Priority */}
                <div className="mt-8 flex justify-center lg:hidden">
                  <div className="relative w-full flex items-center justify-center overflow-visible" style={{ minHeight: '400px', width: '100%' }}>
                    {getVisibleSlides().map((slide) => {
                      const isCenter = slide.position === 0;
                      const absPosition = Math.abs(slide.position);
                      
                      // Mobile: Show only center card, or show side cards with better visibility
                      const scale = isCenter ? 1 : 0.85;
                      const opacity = isCenter ? 1 : 0.5; // Slightly more visible
                      const zIndex = isCenter ? 30 : 10;
                      const translateX = slide.position === 0 ? 0 : slide.position * 20; // Smaller offset for mobile
                      const rotation = isCenter ? 0 : slide.position > 0 ? 2 : -2; // Slightly more rotation for visibility

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

                {/* Description - Mobile */}
                <p className="mt-6 text-gray-500 max-w-[340px] lg:max-w-none lg:text-lg lg:text-gray-600 lg:leading-relaxed lg:font-light">
                  Learn every day how to dress better using small, low-risk additions.
                </p>

                {/* Email CTA - Mobile */}
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-4 max-w-[340px] lg:max-w-none lg:flex lg:flex-row lg:gap-3 lg:space-y-0"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                    className="w-full border-b-2 border-gray-300 pb-2 outline-none focus:border-purple-600 transition-colors placeholder:text-gray-400 lg:flex-1 lg:px-5 lg:py-3 lg:text-sm"
                    onClick={() => handleCTAClick('hero_email')}
                  />
                  <button
                    type="submit"
                    onClick={() => handleCTAClick('hero_button')}
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed lg:flex-none lg:px-6 lg:py-3 lg:uppercase lg:text-xs lg:font-medium lg:tracking-wide"
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </form>

                {/* Trust indicator */}
                <p className="mt-4 text-xs text-gray-400 uppercase tracking-wider lg:pt-1">
                  No spam. Unsubscribe anytime.
                </p>
              </div>

              {/* What You'll Get Section - Moved here */}
              <div className="mt-16 lg:mt-24 w-full">
                <div className="max-w-7xl mx-auto">
                  {/* Section Header */}
                  <div className="mb-12 lg:mb-20 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight mb-4 lg:mb-6">
                      What you&apos;ll get access to
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-600 font-light max-w-2xl mx-auto">
                      Early access to Looklyy includes exclusive features designed to transform how you approach personal styling.
                    </p>
                  </div>

                </div>
              </div>

              {/* Desktop: Slider Column - Right Side */}
              <div className="hidden lg:flex lg:justify-end lg:relative lg:w-full">
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
                      const absPosition = Math.abs(slide.position);
                      
                      const scale = isCenter ? 1 : 0.9;
                      const opacity = isCenter ? 1 : 0.65; // Slightly more visible
                      const zIndex = isCenter ? 30 : 10;
                      const translateX = slide.position === 0 ? 0 : slide.position * 24; // translate-x-6 = 24px
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
          </section>
        </div>
      </div>
    </>
  );
}
