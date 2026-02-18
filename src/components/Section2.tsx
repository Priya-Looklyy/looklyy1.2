'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Section2() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (key: string) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  return (
    <section 
      className="w-full relative"
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 w-full"
        style={{
          height: '100%',
          width: '100%',
          zIndex: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {!imageErrors.background ? (
          <Image
            src="/assets/frames/Section2_BackgroundPNG.png"
            alt="Section 2 Background"
            width={1080}
            height={1920}
            className="w-full h-full"
            priority
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            onError={() => handleImageError('background')}
          />
        ) : (
          <div className="w-full h-full bg-yellow-100" />
        )}
      </div>

      {/* Main Content Container - Flex column with space-between */}
      <div
        className="relative w-full"
        style={{
          width: '100%',
          paddingLeft: '20px',
          paddingRight: '20px',
          height: '100%',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
          boxSizing: 'border-box',
        }}
      >
        {/* Top Zone: Header + Headline */}
        <div
          style={{
            width: '100%',
            paddingTop: '24px',
            flexShrink: 0,
            boxSizing: 'border-box',
          }}
        >
          {/* Header Row: Logo and Hello */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              marginBottom: '24px',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexShrink: 0,
              }}
            >
              <img
                src="/assets/logo/Looklyy_LogoSVG.svg"
                alt="Looklyy Logo"
                className="w-auto h-auto"
                style={{
                  height: 'auto',
                  maxWidth: '180px',
                  width: 'auto',
                  display: 'block',
                }}
                onError={() => handleImageError('logo')}
              />
            </div>

            {/* Hello - Premium mobile typography */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1,
                  margin: 0,
                  letterSpacing: '-0.01em',
                  color: '#f97316',
                }}
              >
                Hello
              </p>
            </div>
          </div>

          {/* "What if" to Main Headline */}
          <div
            style={{
              width: '100%',
              flexShrink: 0,
            }}
          >
            <img
              src="/assets/frames/Home_HeadlinePNG.png"
              alt="What if you could see"
              className="w-auto h-auto"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                maxHeight: '280px',
                display: 'block',
              }}
              onError={() => handleImageError('headline')}
            />
          </div>
        </div>

        {/* Middle Zone: Characters - Flex 1 to occupy remaining space */}
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: '20px',
            paddingRight: '20px',
            flexShrink: 1,
            overflow: 'hidden',
            minHeight: 0,
            maxHeight: '100%',
          }}
        >
          <img
            src="/assets/illustrations/Homepage_ImagePNG.png"
            alt="4 People Illustration"
            className="w-auto h-auto"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
            onError={() => handleImageError('people')}
          />
        </div>

        {/* Bottom Zone: Banner - Sticks to bottom */}
        <div
          style={{
            paddingBottom: '24px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <img
            src="/assets/frames/Footnote_Section1PNG.png"
            alt="We are exploring this idea"
            className="w-auto h-auto"
            style={{
              maxWidth: '100%',
              height: '72px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
            onError={() => handleImageError('footnote')}
          />
        </div>
      </div>
    </section>
  );
}
