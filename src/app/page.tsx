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

  // Navigation handlers
  const goToNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % sliderImagesArray.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + sliderImagesArray.length) % sliderImagesArray.length);
  };

  // Get visible slides (show 4-5 overlapping images at once)
  const getVisibleSlides = () => {
    const visibleCount = 5;
    const slides = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentSlideIndex + i) % sliderImagesArray.length;
      slides.push({
        index,
        src: sliderImagesArray[index],
        position: i, // 0 is center/most prominent
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

        {/* Hero Section - Editorial Style - Strict Viewport Height */}
        <section className="h-screen flex items-center pt-14 px-6 sm:px-8 lg:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full h-full flex items-center">
            {/* Editorial Layout: Text Left, Image Right */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center w-full h-full">
              {/* Editorial Text Content - Left Side */}
              <div className="space-y-3 lg:space-y-4 h-full flex flex-col justify-center">
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
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed font-light max-w-xl">
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

              {/* Dynamic Image Slider - Right Side - Overlapping Fan Style */}
              <div className="relative h-[280px] sm:h-[320px] lg:h-[380px] xl:h-[420px] order-first lg:order-last flex items-center justify-center overflow-visible">
                {/* Golden-brown textured background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-100/80 to-amber-50 rounded-2xl" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(180, 83, 9, 0.15) 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}></div>
                
                {/* Slider Container - Centered with overlapping images */}
                <div className="relative h-full w-full flex items-center justify-center">
                  {/* Navigation Arrow - Left */}
                  <button
                    onClick={goToPrevSlide}
                    className="absolute left-2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Overlapping Images Container */}
                  <div className="relative h-full w-full flex items-center justify-center">
                    {getVisibleSlides().map((slide, idx) => {
                      const isCenter = slide.position === 0;
                      const offset = (slide.position - 2) * 15; // Offset for fan effect
                      const rotation = (slide.position - 2) * 3; // Rotation for fan effect
                      const scale = isCenter ? 1 : 0.85 - (slide.position * 0.05); // Center image is largest
                      const zIndex = 10 - slide.position; // Center has highest z-index
                      const opacity = isCenter ? 1 : 0.7 - (slide.position * 0.1);

                      return (
                        <div
                          key={`${slide.index}-${slide.position}`}
                          className="absolute transition-all duration-700 ease-in-out"
                          style={{
                            width: '22.5%', // 22.5% of screen width (between 20-25%)
                            height: '85%',
                            transform: `translateX(${offset}%) rotate(${rotation}deg) scale(${scale})`,
                            zIndex: zIndex,
                            opacity: opacity,
                            transformOrigin: 'center center',
                          }}
                        >
                          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl" style={{
                            boxShadow: isCenter 
                              ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)' 
                              : '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                          }}>
                            <Image
                              src={slide.src}
                              alt={`Fashion Editorial ${slide.index + 1}`}
                              fill
                              className="object-cover object-center"
                              priority={isCenter}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target) {
                                  target.src = '/single-homepage-image.jpg';
                                }
                              }}
                            />
                            {/* White border effect like instant camera print */}
                            <div className="absolute inset-0 border-4 border-white pointer-events-none"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Arrow - Right */}
                  <button
                    onClick={goToNextSlide}
                    className="absolute right-2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    aria-label="Next slide"
                  >
                    <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
