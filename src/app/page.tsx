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
  const sliderImagesArray = Array.from({ length: 27 }, (_, i) => `/demo-images/${i + 1}.jpg`);

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

  // Get visible slides (center + 2-3 on each side = 5-7 total cards)
  const getVisibleSlides = () => {
    const cardsPerSide = 3; // 3 cards on each side of center
    const totalCards = cardsPerSide * 2 + 1; // 7 total cards
    const slides = [];
    
    for (let i = -cardsPerSide; i <= cardsPerSide; i++) {
      const index = (currentSlideIndex + i + sliderImagesArray.length) % sliderImagesArray.length;
      slides.push({
        index,
        src: sliderImagesArray[index],
        position: i, // 0 is center, negative = left, positive = right
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

        {/* Hero Section - Refactored Layout */}
        <section className="min-h-screen flex items-center pt-14">
          <div className="max-w-7xl mx-auto px-6 w-full">
            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Text Column - Left Side */}
              <div className="max-w-[480px] space-y-6 lg:pr-12">
                {/* Large Editorial Headline - 2 lines, all black */}
                <div className="space-y-2">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light leading-[1.1] text-gray-900 tracking-tight">
                    What if you could learn to style
                    <br />
                    as a skill as you shop?
                  </h1>
                  
                  {/* Decorative Line */}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-gray-400 to-transparent"></div>
                </div>

                {/* Sub-headline - Editorial Style */}
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed font-light">
                  Would you consider registering if I showed you, every day, how to dress better through small, low-risk additions using what you already own?
                </p>

                {/* CTA Form - Editorial Style */}
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 pt-2"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                    className="flex-1 px-5 py-3 text-sm border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-purple-600 transition-colors placeholder:text-gray-400"
                    onClick={() => handleCTAClick('hero_email')}
                  />
                  <button
                    type="submit"
                    onClick={() => handleCTAClick('hero_button')}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none px-6 py-3 bg-purple-600 text-white font-medium tracking-wide uppercase text-xs hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </form>

                {/* Trust indicator - Minimal */}
                <p className="text-xs text-gray-400 uppercase tracking-wider pt-1">
                  No spam. Unsubscribe anytime.
                </p>
              </div>

              {/* Dynamic Image Slider - Right Side - Polaroid Style Stacked Cards */}
              <div className="relative flex justify-center lg:justify-end order-first lg:order-last">
                {/* Subtle textured background */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-stone-100/50 to-stone-50 rounded-2xl" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(120, 113, 108, 0.08) 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}></div>
                
                {/* Slider Container - Centered with polaroid cards */}
                <div className="relative max-w-md w-full flex items-center justify-center min-h-[420px] lg:min-h-[500px]">
                  {/* Navigation Arrow - Left */}
                  <button
                    onClick={goToPrevSlide}
                    disabled={isSliding}
                    className={`group absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ease-in-out ${
                      isSliding && arrowRipple === 'left' 
                        ? 'opacity-70 scale-95' 
                        : 'opacity-80 hover:opacity-100 hover:scale-110 active:scale-95'
                    } ${
                      arrowRipple === 'left' ? 'shadow-lg' : 'shadow-md'
                    }`}
                    style={{
                      backgroundColor: 'rgba(250, 250, 249, 0.75)', // stone-50 with 75% opacity
                      boxShadow: arrowRipple === 'left' 
                        ? '0 10px 25px rgba(0, 0, 0, 0.15)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
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
                    {/* Ripple effect */}
                    {arrowRipple === 'left' && (
                      <span className="absolute inset-0 rounded-full bg-stone-400/20 arrow-ripple"></span>
                    )}
                  </button>

                  {/* Polaroid Cards Container */}
                  <div className="relative w-full flex items-center justify-center min-h-[420px] lg:min-h-[500px]">
                    {getVisibleSlides().map((slide) => {
                      const isCenter = slide.position === 0;
                      const absPosition = Math.abs(slide.position);
                      
                      // Card sizing: 340px mobile, 420px desktop, 460px large screens
                      const cardWidth = isCenter 
                        ? 'w-[340px] sm:w-[420px] lg:w-[460px]' 
                        : 'w-[340px] sm:w-[420px] lg:w-[460px]';
                      
                      // Scale: center = 1, side cards = 0.9
                      const scale = isCenter ? 1 : 0.9;
                      
                      // Opacity: center = 1, side cards = 0.6
                      const opacity = isCenter ? 1 : 0.6;
                      
                      // Z-index: center = 30, side cards decrease
                      const zIndex = isCenter ? 30 : 20 - absPosition;
                      
                      // Horizontal offset: side cards translate-x-12 (48px)
                      const translateX = slide.position === 0 ? 0 : slide.position * 48; // 12 * 4 = 48px (translate-x-12)

                      return (
                        <div
                          key={`${slide.index}-${slide.position}`}
                          className={`absolute ${cardWidth} transition-all duration-500 ease-in-out`}
                          style={{
                            left: '50%',
                            transform: `translateX(calc(-50% + ${translateX}px)) scale(${scale})`,
                            zIndex: zIndex,
                            opacity: opacity,
                            transformOrigin: 'center center',
                          }}
                        >
                          {/* Polaroid-style card frame */}
                          <div 
                            className={`relative w-full bg-white rounded-xl shadow-lg transition-all duration-500 ${
                              isCenter ? 'hover:scale-105 cursor-pointer' : ''
                            }`}
                            style={{
                              boxShadow: isCenter 
                                ? '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)' 
                                : '0 10px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.03)',
                              padding: '6px 6px 8px 6px', // Minimal padding, reduced caption area
                            }}
                          >
                            {/* Image container - takes 85-90% of card height */}
                            <div className="relative w-full h-[420px] lg:h-[500px] rounded-lg overflow-hidden">
                              <Image
                                src={slide.src}
                                alt={`Fashion Editorial ${slide.index + 1}`}
                                fill
                                className="object-cover rounded-xl"
                                priority={isCenter}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  if (target) {
                                    target.src = '/single-homepage-image.jpg';
                                  }
                                }}
                              />
                            </div>
                            
                            {/* Minimal polaroid caption area */}
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-white rounded-b-xl"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Arrow - Right */}
                  <button
                    onClick={goToNextSlide}
                    disabled={isSliding}
                    className={`group absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ease-in-out ${
                      isSliding && arrowRipple === 'right' 
                        ? 'opacity-70 scale-95' 
                        : 'opacity-80 hover:opacity-100 hover:scale-110 active:scale-95'
                    } ${
                      arrowRipple === 'right' ? 'shadow-lg' : 'shadow-md'
                    }`}
                    style={{
                      backgroundColor: 'rgba(250, 250, 249, 0.75)', // stone-50 with 75% opacity
                      boxShadow: arrowRipple === 'right' 
                        ? '0 10px 25px rgba(0, 0, 0, 0.15)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
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
                    {/* Ripple effect */}
                    {arrowRipple === 'right' && (
                      <span className="absolute inset-0 rounded-full bg-stone-400/20 arrow-ripple"></span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

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
