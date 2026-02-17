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
        minHeight: 'min(100vh, 1100px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 w-full"
        style={{
          minHeight: 'min(100vh, 1100px)',
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

      {/* Content Container with 12-column grid */}
      <div
        className="relative w-full mx-auto"
        style={{
          maxWidth: '1200px',
          paddingLeft: '6vw',
          paddingRight: '6vw',
          minHeight: 'min(100vh, 1100px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'var(--space-2)',
          paddingTop: 'var(--space-4)',
          paddingBottom: 'var(--space-4)',
          position: 'relative',
          zIndex: 10,
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

        {/* Hello - col 10-12 */}
        <div
          style={{
            gridColumn: '10 / 13',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
          }}
        >
          <p
            className="text-orange-500 font-medium"
            style={{
              fontSize: '18px',
              margin: 0,
            }}
          >
            Hello
          </p>
        </div>

        {/* "What if" to Main Headline - col 2-10, height 260-320px */}
        {!imageErrors.headline && (
          <div
            style={{
              gridColumn: '2 / 11', // Columns 2 through 10
              marginTop: 'var(--space-6)',
              minHeight: '260px',
              maxHeight: '320px',
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

        {/* Illustration area - full width centered, height 420px */}
        {!imageErrors.people && (
          <div
            style={{
              gridColumn: '1 / -1',
              marginTop: 'var(--space-6)',
              height: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/assets/illustrations/Homepage_ImagePNG.png"
              alt="4 People Illustration"
              className="w-auto h-auto"
              style={{
                maxWidth: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              onError={() => handleImageError('people')}
            />
          </div>
        )}

        {/* Footer strip - full width, height 72px */}
        {!imageErrors.footnote && (
          <div
            style={{
              gridColumn: '1 / -1',
              marginTop: 'var(--space-5)',
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
