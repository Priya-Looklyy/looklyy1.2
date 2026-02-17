'use client';

import Image from 'next/image';

export default function Section2() {
  return (
    <section className="w-full relative">
      {/* Background */}
      <div className="relative w-full min-h-screen">
        <Image
          src="/assets/frames/Section2_BackgroundPNG.png"
          alt="Section 2 Background"
          width={1200}
          height={1000}
          className="w-full h-auto object-cover"
          priority
        />
        
        {/* Logo - Top Left */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-12 md:left-12 z-20">
          <Image
            src="/assets/logo/Looklyy_LogoSVG.svg"
            alt="Looklyy Logo"
            width={150}
            height={60}
            className="w-auto h-auto"
          />
        </div>
        
        {/* Hello - Top Right */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 md:top-12 md:right-12 z-20">
          <p className="text-orange-500 text-lg sm:text-xl font-medium">Hello</p>
        </div>
        
        {/* Top Left Element - Responsive positioning */}
        <div className="absolute top-20 left-4 sm:top-24 sm:left-8 md:top-32 md:left-12">
          <Image
            src="/assets/frames/Section2TopLeftelement_PNG.png"
            alt="Section 2 Top Left"
            width={400}
            height={200}
            className="w-auto h-auto max-w-[40vw] sm:max-w-none"
          />
        </div>
        
        {/* Right Top Text - Responsive positioning */}
        <div className="absolute top-20 right-4 sm:top-24 sm:right-8 md:top-32 md:right-12">
          <Image
            src="/assets/frames/Section2RightTopText_PNG.png"
            alt="Section 2 Right Top Text"
            width={400}
            height={200}
            className="w-auto h-auto max-w-[40vw] sm:max-w-none"
          />
        </div>
        
        {/* Mid Text - Centered */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4">
          <div className="flex justify-center">
            <Image
              src="/assets/frames/Section2MidText_PNG.png"
              alt="Section 2 Mid Text"
              width={800}
              height={300}
              className="w-auto h-auto max-w-[90vw] sm:max-w-[80vw] md:max-w-[700px]"
            />
          </div>
        </div>
        
        {/* Join Early List - Interactive CTA */}
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-full px-4">
          <div className="flex justify-center">
            <button
              onClick={() => {
                const section3 = document.querySelector('section:nth-of-type(3)');
                section3?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="transition-opacity hover:opacity-90 active:opacity-75"
            >
              <Image
                src="/assets/frames/Section2Jointheearlylist_PNG.png"
                alt="Join Early List"
                width={600}
                height={150}
                className="w-auto h-auto max-w-[90vw] sm:max-w-[500px] cursor-pointer"
              />
            </button>
          </div>
        </div>
        
        {/* Last Panel */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <Image
            src="/assets/frames/Section2Lastpanel_PNG.png"
            alt="Section 2 Last Panel"
            width={1200}
            height={200}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
