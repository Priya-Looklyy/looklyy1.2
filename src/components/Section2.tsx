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
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 w-full"
        style={{
          height: '100%',
          zIndex: 0,
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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Top Zone: Header + Headline */}
        <div
          style={{
            width: '100%',
            paddingTop: '32px',
            flexShrink: 0,
          }}
        >
          {/* Header Row: Logo and Hello */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              marginBottom: '32px',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexShrink: 0,
                minHeight: '60px',
              }}
            >
              <img
                src="/assets/logo/Looklyy_LogoSVG.svg"
                alt="Looklyy Logo"
                className="w-auto h-auto"
                style={{
                  height: 'auto',
                  maxWidth: '200px',
                  minWidth: '150px',
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
                className="text-orange-500"
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
              minHeight: '200px',
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
                maxHeight: '320px',
                display: 'block',
              }}
              onError={() => handleImageError('headline')}
            />
          </div>
        </div>

        {/* Middle Zone: Characters - Flex 1 to occupy remaining space */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: '20px',
            paddingRight: '20px',
            minHeight: '200px',
            flexShrink: 1,
            overflow: 'hidden',
          }}
        >
          <img
            src="/assets/illustrations/Homepage_ImagePNG.png"
            alt="4 People Illustration"
            className="w-auto h-auto"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
            onError={() => handleImageError('people')}
          />
        </div>

        {/* Bottom Zone: Banner - Sticks to bottom */}
        <div
          style={{
            paddingBottom: '32px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '100%',
            minHeight: '72px',
          }}
        >
          <img
            src="/assets/frames/Footnote_Section1PNG.png"
            alt="We are exploring this idea"
            className="w-auto h-auto"
            style={{
              maxWidth: '100%',
              height: '100%',
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
