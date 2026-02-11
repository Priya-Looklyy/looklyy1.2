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

  // Auto-advance slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliderImagesArray.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, [sliderImagesArray.length]);

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
          <img
            src={imageSrc}
            alt={caption}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoading && !hasLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageError ? 'none' : 'block' }}
          />
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

        {/* Visual Break - Full Width Image */}
        <section className="py-0 px-0 mb-32">
          <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden">
            <Image
              src="/single-homepage-image.jpg"
              alt="Fashion Editorial Break"
              fill
              className="object-cover grayscale-[0.3]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent"></div>
          </div>
        </section>

        {/* Problem & Solution Section - Editorial Grid */}
        <section className="py-32 px-6 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Section Header - Editorial Style */}
            <div className="mb-24 text-center">
              <div className="inline-block mb-6">
                <div className="w-16 h-0.5 bg-purple-600 mx-auto"></div>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight mb-8">
                You see a look you love.
                <br />
                <span className="font-normal italic text-purple-700">Now what?</span>
              </h2>
            </div>

            {/* Editorial Two-Column Layout */}
            <div className="grid lg:grid-cols-2 gap-20 items-start">
              {/* Left Column - Text */}
              <div className="space-y-8">
                <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-light">
                  Most of us bookmark fashion inspiration, then forget about it. Or worse—we try to recreate it but can&apos;t find the right pieces, even though they&apos;re already in our closet.
                </p>
                <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-light">
                  Looklyy solves this by connecting inspiration to your actual wardrobe. No more guessing if you have the right pieces. No more buying duplicates of what you already own.
                </p>
              </div>

              {/* Right Column - Visual Feature List */}
              <div className="space-y-8">
                <div className="flex items-start gap-6 pb-8 border-b border-gray-200">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 border-2 border-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2 uppercase tracking-wide">See a look you love</h3>
                    <p className="text-gray-600 font-light">Browse trending fashion inspiration</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 pb-8 border-b border-gray-200">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 border-2 border-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2 uppercase tracking-wide">Match to your wardrobe</h3>
                    <p className="text-gray-600 font-light">AI finds similar pieces you already own</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 border-2 border-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2 uppercase tracking-wide">Recreate instantly</h3>
                    <p className="text-gray-600 font-light">Get styling suggestions using your clothes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Break - Abstract Shape */}
        <section className="py-0 px-0 mb-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-purple-100/30 to-transparent"></div>
          <div className="relative h-[300px] flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="grid grid-cols-3 gap-8">
                <div className="h-48 bg-gradient-to-br from-purple-200/50 to-transparent rounded-lg"></div>
                <div className="h-48 bg-gradient-to-br from-purple-300/50 to-transparent rounded-lg"></div>
                <div className="h-48 bg-gradient-to-br from-purple-200/50 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Get - Editorial Cards */}
        <section className="py-32 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-20 text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight mb-6">
                What you&apos;ll get access to
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
                Early access to Looklyy includes exclusive features designed to transform how you approach personal styling.
              </p>
            </div>

            {/* Editorial Card Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative overflow-hidden bg-white border border-gray-200 p-10 hover:border-purple-300 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-purple-600 mb-6 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white rounded"></div>
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-4 uppercase tracking-wide">AI-Powered Matching</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Our technology analyzes fashion looks and matches them to items in your wardrobe with precision.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white border border-gray-200 p-10 hover:border-purple-300 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-purple-600 mb-6 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white rounded"></div>
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-4 uppercase tracking-wide">Personalized Suggestions</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Get styling recommendations tailored to your body type, preferences, and existing wardrobe.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white border border-gray-200 p-10 hover:border-purple-300 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-purple-600 mb-6 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white rounded"></div>
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-4 uppercase tracking-wide">Wardrobe Intelligence</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Understand what you own, what you wear most, and discover hidden styling possibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Section - Editorial CTA */}
        <section
          id="register"
          className="py-40 px-6 sm:px-8 lg:px-12 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight">
              Ready to transform
              <br />
              <span className="font-normal italic">your wardrobe?</span>
            </h2>
            <p className="text-xl sm:text-2xl text-purple-100 mb-12 font-light">
              Join the waitlist and be among the first to experience Looklyy.
            </p>

            {isSubmitted ? (
              <div className="bg-white rounded-lg p-12 shadow-2xl max-w-md mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-light text-gray-900 mb-3">You&apos;re registered!</h3>
                <p className="text-gray-600 font-light">
                  We&apos;ll send you an email when Looklyy is ready. Thanks for your interest!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-lg p-10 shadow-2xl max-w-lg mx-auto">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                <div className="space-y-6">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full px-6 py-4 text-base border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-purple-600 transition-colors placeholder:text-gray-400"
                    onClick={() => handleCTAClick('form_name')}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                    className="w-full px-6 py-4 text-base border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-purple-600 transition-colors placeholder:text-gray-400"
                    onClick={() => handleCTAClick('form_email')}
                  />
                  <button
                    type="submit"
                    onClick={() => handleCTAClick('form_submit')}
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-purple-600 text-white font-medium tracking-wide uppercase text-sm hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
                <p className="mt-6 text-xs text-gray-400 uppercase tracking-wider">
                  We respect your privacy. No spam, unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Footer - Minimalist */}
        <footer className="py-16 px-6 sm:px-8 lg:px-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-xl font-light tracking-tight text-gray-900">Looklyy</span>
            </div>
            <p className="text-gray-400 text-sm uppercase tracking-wider">
              © 2025 Looklyy. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
