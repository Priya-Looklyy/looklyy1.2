'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Section1() {
  const [imageError, setImageError] = useState(false);
  const [footnoteError, setFootnoteError] = useState(false);

  return (
    <section className="w-full relative">
      {/* Background */}
      <div className="relative w-full">
        {!imageError ? (
          <Image
            src="/assets/frames/Section1_BackgroundPNG.png"
            alt="Section 1 Background"
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-[800px] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Image failed to load</p>
          </div>
        )}
        
        {/* Footnote overlay */}
        {!footnoteError && (
          <div className="absolute bottom-0 left-0 right-0">
            <Image
              src="/assets/frames/Footnote_Section1PNG.png"
              alt="Section 1 Footnote"
              width={1200}
              height={100}
              className="w-full h-auto"
              onError={() => setFootnoteError(true)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
