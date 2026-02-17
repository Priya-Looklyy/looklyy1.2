'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Section2() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (key: string) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  return (
    <section className="w-full relative" style={{ minHeight: '100dvh' }}>
      {/* Background - Full screen, no resize/skew */}
      <div className="relative w-full" style={{ minHeight: '100dvh' }}>
        {!imageErrors.background ? (
          <Image
            src="/assets/frames/Section2_BackgroundPNG.png"
            alt="Section 2 Background"
            width={1080}
            height={1920}
            className="w-full h-full object-cover"
            priority
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            onError={() => handleImageError('background')}
          />
        ) : (
          <div className="w-full min-h-screen bg-yellow-100" />
        )}
        
        {/* Container for all content - positioned relative to background */}
        <div className="absolute inset-0 w-full" style={{ minHeight: '100dvh' }}>
          {/* Logo - Top Left, 80% larger */}
          {!imageErrors.logo && (
            <div 
              className="absolute z-20"
              style={{
                top: '4%',
                left: '4%',
              }}
            >
              <img
                src="/assets/logo/Looklyy_LogoSVG.svg"
                alt="Looklyy Logo"
                className="w-auto h-auto"
                style={{ 
                  width: '270px', // 150px * 1.8 = 270px (80% larger)
                  height: 'auto'
                }}
                onError={() => handleImageError('logo')}
              />
            </div>
          )}
          
          {/* Hello - Top Right, aligned with logo, 10% smaller font */}
          <div 
            className="absolute z-20"
            style={{
              top: '4%',
              right: '4%',
              display: 'flex',
              alignItems: 'center',
              height: '108px', // Match logo height approximately
            }}
          >
            <p 
              className="text-orange-500 font-medium"
              style={{
                fontSize: '18px', // Reduced by 10% from ~20px
                margin: 0,
              }}
            >
              Hello
            </p>
          </div>
          
          {/* Headline - Below logo/Hello, 10% padding, left-aligned to logo */}
          {!imageErrors.headline && (
            <div 
              className="absolute z-20"
              style={{
                top: '20%', // Approximately logo height + 10% padding
                left: '4%', // Aligned to logo left
              }}
            >
              <img
                src="/assets/frames/Home_HeadlinePNG.png"
                alt="Home Headline"
                className="w-auto h-auto"
                style={{ 
                  maxWidth: '90vw',
                  height: 'auto',
                  objectFit: 'contain'
                }}
                onError={() => handleImageError('headline')}
              />
            </div>
          )}
          
          {/* 4 People Illustration - Below headline, center-aligned, 10% padding */}
          {!imageErrors.people && (
            <div 
              className="absolute z-20"
              style={{
                top: '45%', // Positioned below headline with spacing
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                src="/assets/illustrations/Homepage_ImagePNG.png"
                alt="4 People Illustration"
                className="w-auto h-auto"
                style={{ 
                  maxWidth: '90vw',
                  height: 'auto',
                  objectFit: 'contain'
                }}
                onError={() => handleImageError('people')}
              />
            </div>
          )}
          
          {/* Footnote - Below 4 people illustration, 5% padding after feet */}
          {!imageErrors.footnote && (
            <div 
              className="absolute z-20"
              style={{
                bottom: '5%', // 5% padding from bottom (after feet)
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                src="/assets/frames/Footnote_Section1PNG.png"
                alt="We are exploring this idea"
                className="w-auto h-auto"
                style={{ 
                  maxWidth: '90vw',
                  height: 'auto',
                  objectFit: 'contain'
                }}
                onError={() => handleImageError('footnote')}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
