'use client';

import Image from 'next/image';

export default function Section1() {
  return (
    <section className="w-full relative">
      {/* Background */}
      <div className="relative w-full">
        <Image
          src="/assets/frames/Section1_BackgroundPNG.png"
          alt="Section 1 Background"
          width={1200}
          height={800}
          className="w-full h-auto object-cover"
          priority
        />
        
        {/* Footnote overlay */}
        <div className="absolute bottom-0 left-0 right-0">
          <Image
            src="/assets/frames/Footnote_Section1PNG.png"
            alt="Section 1 Footnote"
            width={1200}
            height={100}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
