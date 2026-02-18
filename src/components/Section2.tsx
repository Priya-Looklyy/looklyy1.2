'use client';

import { useState, useEffect } from 'react';

export default function Section2() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsSmallMobile(window.innerWidth <= 480);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageError = (key: string) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  // Responsive values
  const padding = isSmallMobile ? '12px' : isMobile ? '16px' : '24px';
  const headerMarginBottom = isSmallMobile ? '24px' : isMobile ? '32px' : '48px';
  const logoSize = isSmallMobile ? '70px' : isMobile ? '90px' : '112px';
  const textWhatIf = isSmallMobile ? '17.28px' : isMobile ? '18.43px' : '23.04px';
  const textYouCould = isSmallMobile ? '18px' : isMobile ? '20px' : '24px';
  const textWhySome = isSmallMobile ? '28px' : isMobile ? '32px' : '40px';

  return (
    <section
        style={{
          width: '100%',
          height: '100dvh',
          maxHeight: '100dvh',
          backgroundColor: '#fdf3c0',
          fontFamily: "'Roboto Mono', monospace",
          overflowX: 'hidden',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: padding,
          paddingRight: 0,
          boxSizing: 'border-box',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: headerMarginBottom,
            gap: '16px',
            paddingRight: padding,
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: logoSize,
              height: logoSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {!imageErrors.logo ? (
              <img
                src="/assets/logo/Looklyy_LogoSVG.svg"
                alt="Looklyy Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                onError={() => {
                  handleImageError('logo');
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255, 161, 20, 0.2)',
                  border: '2px solid #ffa114',
                  borderRadius: '8px',
                }}
              />
            )}
          </div>

          {/* Hello Text */}
          <div
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 300,
              fontSize: 'clamp(12px, 5vw, 16px)',
              color: '#ffa114',
              marginLeft: 'auto',
              textTransform: 'lowercase',
            }}
          >
            hello
          </div>
        </div>

        {/* Main Content Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            gap: '2px',
            paddingRight: padding,
          }}
        >
          {/* Text Box */}
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                lineHeight: 1.12,
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 300,
                  fontSize: textWhatIf,
                  color: '#ffa114',
                  textTransform: 'uppercase',
                }}
              >
                What if
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                lineHeight: 1.12,
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 700,
                  fontSize: textYouCould,
                  color: '#ffa114',
                  textTransform: 'uppercase',
                }}
              >
                You could see
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                lineHeight: 1.12,
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 700,
                  fontSize: textWhySome,
                  color: '#ffa114',
                  textTransform: 'uppercase',
                }}
              >
                Why some Outfits<br />Work for you
              </span>
            </div>
          </div>

          {/* Illustration */}
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              aspectRatio: 1,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflow: 'hidden',
              marginBottom: 0,
            }}
          >
            {!imageErrors.illustration ? (
              <img
                src="/assets/illustrations/Homepage_ImagePNG.png"
                alt="Looklyy Illustration"
                style={{
                  width: '130%',
                  height: '130%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
                onError={() => handleImageError('illustration')}
              />
            ) : (
              <div
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '14px',
                  color: '#ffa114',
                  textAlign: 'center',
                }}
              >
                Illustration
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div
          style={{
            width: `calc(100% + ${padding})`,
            height: '40px',
            backgroundColor: '#ffd864',
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            marginLeft: `-${padding}`,
            marginBottom: `-${padding}`,
            flexShrink: 0,
          }}
        >
          {!imageErrors.footer ? (
            <img
              src="/assets/frames/Footnote_Section1PNG.png"
              alt="Looklyy Footer"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 0,
              }}
              onError={() => handleImageError('footer')}
            />
          ) : (
            <div style={{ color: '#ffa114', fontSize: '14px' }}>We are exploring this idea</div>
          )}
        </div>
      </section>
    </>
  );
}
