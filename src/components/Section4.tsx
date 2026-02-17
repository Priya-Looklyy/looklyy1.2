'use client';

import Image from 'next/image';

export default function Section4() {
  return (
    <section className="w-full relative">
      {/* Top Section - Form and Illustration */}
      <div className="relative w-full">
        <Image
          src="/assets/illustrations/Section4_TopTextPNG.png"
          alt="Section 4 Top - Form Section"
          width={1200}
          height={600}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      
      {/* Bottom Section - Founder Story */}
      <div className="relative w-full bg-beige-50">
        <div className="relative w-full">
          <Image
            src="/assets/frames/Section4_BottomtextPNG.png"
            alt="Section 4 Bottom - Founder Story"
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Founder Image Overlay */}
        <div className="absolute top-1/4 left-8 sm:left-16 md:left-24 z-10">
          <div className="relative">
            <Image
              src="/assets/photos/Section3_FounderImagePNG.png"
              alt="Founder - Priya Stephen"
              width={300}
              height={400}
              className="w-auto h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px] rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
