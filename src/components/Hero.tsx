'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const INTRO_WORDS = ['Style', 'Trends', 'Outfits', 'Looks', 'Ideas', 'Inspiration'] as const;
const CYCLING_WORDS = ['Simplified', 'Effortless'] as const;

const INTRO_DURATION = 1200;

export function Hero() {
  const [introDone, setIntroDone] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(CYCLING_WORDS[0].length);
  const [isHovered, setIsHovered] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);

  useEffect(() => {
    // Initial intro sequence: scattered words → merge → dissolve → headline
    setIntroDone(false);
    setShowHeadline(false);

    const introTimer = setTimeout(() => {
      setIntroDone(true);
    }, INTRO_DURATION);

    const headlineTimer = setTimeout(() => {
      setShowHeadline(true);
    }, INTRO_DURATION + 80);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(headlineTimer);
    };
  }, []);

  useEffect(() => {
    if (!introDone || isHovered) return;
    const id = setInterval(() => {
      setCurrentWordIndex((i) => (i + 1) % CYCLING_WORDS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [introDone, isHovered]);

  // Typing animation for the second word only
  useEffect(() => {
    if (!showHeadline) return;
    const word = CYCLING_WORDS[currentWordIndex];
    setTypedLength(0);

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTypedLength(i);
      if (i >= word.length) {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [currentWordIndex, showHeadline]);

  const fullWord = CYCLING_WORDS[currentWordIndex];
  const visibleWord = showHeadline ? fullWord.slice(0, typedLength) : '';

  return (
    <section className="relative flex min-h-[60vh] md:min-h-[70vh] items-center justify-center overflow-hidden bg-hero-gradient animate-hero-gradient px-4 py-6 md:py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F7F6FB]/40 via-transparent to-[#F4F4F6]/80" />

      {!introDone && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {INTRO_WORDS.map((word, index) => {
            const angle = (index / INTRO_WORDS.length) * Math.PI * 2;
            const r = 90;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;

            return (
              <motion.span
                key={word}
                className="absolute text-3xl sm:text-4xl font-semibold text-[#8f1eae]"
                initial={{ opacity: 0, x, y, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={{
                  duration: INTRO_DURATION / 1000,
                  delay: index * 0.06,
                  ease: [0.25, 0.8, 0.25, 1],
                }}
              >
                {word}
              </motion.span>
            );
          })}
        </div>
      )}

      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={showHeadline ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 0, scale: 1 }}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.7, delay: INTRO_DURATION / 1000, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 cursor-default select-none"
        >
          <h1
            className="editorial-headline flex flex-col items-center gap-0 text-[clamp(2.4rem,9vw,4.2rem)] font-bold leading-[0.95] text-[#8f1eae] md:flex-row md:flex-wrap md:items-baseline md:justify-center"
            style={{
              fontFamily: '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            <span className="block md:inline">Style,</span>
            <span className="block md:inline">
              {visibleWord}
              <span>.</span>
            </span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}

