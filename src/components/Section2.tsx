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
        className="relative w-full mx-auto"
        style={{
          maxWidth: '1200px',
          paddingLeft: '6vw',
          paddingRight: '6vw',
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
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'var(--space-2)',
            paddingTop: 'var(--space-4)',
          }}
        >
          {/* Logo - col 1-3 */}
          {!imageErrors.logo && (
            <div
              style={{
                gridColumn: '1 / 4',
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <img
                src="/assets/logo/Looklyy_LogoSVG.svg"
                alt="Looklyy Logo"
                className="w-auto h-auto"
                style={{
                  height: 'auto',
                  maxWidth: '100%',
                }}
                onError={() => handleImageError('logo')}
              />
            </div>
          )}

          {/* Hello - col 10-12 - Premium mobile typography */}
          <div
            style={{
              gridColumn: '10 / 13',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
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
              }}
            >
              Hello
            </p>
          </div>

          {/* "What if" to Main Headline - col 2-10 */}
          {!imageErrors.headline && (
            <div
              style={{
                gridColumn: '2 / 11',
                marginTop: 'var(--space-4)', // Small spacing after header
                display: 'flex',
                alignItems: 'flex-start',
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
                }}
                onError={() => handleImageError('headline')}
              />
            </div>
          )}
        </div>

        {/* Middle Zone: Characters - Flex 1 to occupy remaining space */}
        {!imageErrors.people && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: '20px',
              paddingRight: '20px',
              minHeight: 0, // Important for flex children
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
              }}
              onError={() => handleImageError('people')}
            />
          </div>
        )}

        {/* Bottom Zone: Banner - Sticks to bottom */}
        {!imageErrors.footnote && (
          <div
            style={{
              paddingBottom: 'var(--space-4)',
              height: '72px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
              }}
              onError={() => handleImageError('footnote')}
            />
          </div>
        )}
      </div>
    </section>
  );
}
