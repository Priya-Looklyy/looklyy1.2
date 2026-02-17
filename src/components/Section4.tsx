'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Section4() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (key: string) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  return (
    <section className="w-full relative">
      {/* Top Section - Form and Illustration */}
      <div className="relative w-full">
        {!imageErrors.topText ? (
          <Image
            src="/assets/illustrations/Section4_TopTextPNG.png"
            alt="Section 4 Top - Form Section"
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
            priority
            onError={() => handleImageError('topText')}
          />
        ) : (
          <div className="w-full h-[600px] bg-orange-100" />
        )}
      </div>
      
      {/* Bottom Section - Founder Story */}
      <div className="relative w-full" style={{ backgroundColor: '#F5F5DC' }}>
        {!imageErrors.bottomText ? (
          <div className="relative w-full">
            <Image
              src="/assets/frames/Section4_BottomtextPNG.png"
              alt="Section 4 Bottom - Founder Story"
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
              onError={() => handleImageError('bottomText')}
            />
          </div>
        ) : (
          <div className="w-full h-[800px]" style={{ backgroundColor: '#F5F5DC' }} />
        )}
        
        {/* Founder Image Overlay */}
        {!imageErrors.founderImage && (
          <div className="absolute top-1/4 left-8 sm:left-16 md:left-24 z-10">
            <div className="relative">
              <Image
                src="/assets/photos/Section3_FounderImagePNG.png"
                alt="Founder - Priya Stephen"
                width={300}
                height={400}
                className="w-auto h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px] rounded-lg shadow-lg"
                onError={() => handleImageError('founderImage')}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
