'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Section2() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (key: string) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  return (
    <section className="w-full relative">
      {/* Background */}
      <div className="relative w-full min-h-screen">
        {!imageErrors.background ? (
          <Image
            src="/assets/frames/Section2_BackgroundPNG.png"
            alt="Section 2 Background"
            width={1200}
            height={1000}
            className="w-full h-auto object-cover"
            priority
            onError={() => handleImageError('background')}
          />
        ) : (
          <div className="w-full min-h-screen bg-yellow-100" />
        )}
        
        {/* Logo - Top Left - 40% larger */}
        {!imageErrors.logo && (
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-12 md:left-12 z-20">
            <img
              src="/assets/logo/Looklyy_LogoSVG.svg"
              alt="Looklyy Logo"
              width={210}
              height={84}
              className="w-auto h-auto"
              onError={() => handleImageError('logo')}
              style={{ maxWidth: '210px', height: 'auto' }}
            />
          </div>
        )}
        
        {/* Hello - Top Right - 10% smaller font */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 md:top-12 md:right-12 z-20">
          <p className="text-orange-500 text-base sm:text-lg font-medium" style={{ fontSize: '0.9em' }}>Hello</p>
        </div>
        
        {/* Headline Text - Below logo/Hello, left-aligned with logo */}
        {!imageErrors.headline && (
          <div className="absolute top-24 left-4 sm:top-28 sm:left-8 md:top-36 md:left-12 z-20">
            <Image
              src="/assets/frames/Home_HeadlinePNG.png"
              alt="Home Headline"
              width={600}
              height={200}
              className="w-auto h-auto max-w-[85vw] sm:max-w-[600px]"
              onError={() => handleImageError('headline')}
            />
          </div>
        )}
        
        {/* 4 People Illustration - Below headline, center-aligned */}
        {!imageErrors.homepageImage && (
          <div className="absolute top-64 left-1/2 transform -translate-x-1/2 sm:top-80 md:top-96 z-20 w-full px-4">
            <div className="flex justify-center">
              <Image
                src="/assets/illustrations/Homepage_ImagePNG.png"
                alt="Homepage Image - 4 People"
                width={800}
                height={600}
                className="w-auto h-auto max-w-[90vw] sm:max-w-[700px]"
                onError={() => handleImageError('homepageImage')}
              />
            </div>
          </div>
        )}
        
        {/* Footnote - Last element, below illustration */}
        {!imageErrors.footnote && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-full px-4">
            <div className="flex justify-center">
              <Image
                src="/assets/frames/Footnote_Section1PNG.png"
                alt="We are exploring this idea"
                width={600}
                height={150}
                className="w-auto h-auto max-w-[90vw] sm:max-w-[500px]"
                onError={() => handleImageError('footnote')}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
