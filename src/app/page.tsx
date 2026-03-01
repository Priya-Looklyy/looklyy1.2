'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SuccessStep from '@/components/SuccessStep';
import IllustrationWaitlistForm from '@/components/IllustrationWaitlistForm';
import { submitWaitlist as submitWaitlistToDB } from '@/lib/supabase';
import type { Step } from '@/types/flow';

export default function Home() {
  const [step, setStep] = useState<Step>('email');
  const [form1Error, setForm1Error] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [form1Submitted, setForm1Submitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Removed localStorage check - it was causing both forms to disappear on page load
  // Each form should work independently

  useEffect(() => {
    if (showThankYou) {
      const t = setTimeout(() => setShowThankYou(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showThankYou]);

  const submitWaitlist = async (e: string, phone: string, formId: 'form1') => {
    if (isSubmitting) return;
    if (form1Submitted) return;

    console.log('📤 Submitting form with email:', e);
    setForm1Error('');
    
    setIsSubmitting(true);

    try {
      const result = await submitWaitlistToDB(e, phone || null);
      
      console.log('📥 Form submission result:', result);

      if (!result.success) {
        setForm1Error(result.error || 'Something went wrong');
        setIsSubmitting(false);
        return;
      }

      setForm1Submitted(true);
      setForm1Error('');
      setIsSubmitting(false);
      setShowThankYou(true);
      setStep('success');
    } catch (err) {
      console.error('❌ Unexpected error in form:', err);
      setForm1Error('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="landing-page fixed inset-0 overflow-x-hidden overflow-y-auto"
      style={{
        fontFamily: "'Roboto Mono', monospace",
        backgroundColor: '#faf7fc',
      }}
    >
      <div
        className="wrapper flex flex-col w-full min-h-full p-6 pr-0 pb-[max(24px,env(safe-area-inset-bottom))]"
        style={{ paddingRight: 0 }}
      >
        {/* Hero Section - full bleed image + centered typography, responsive */}
        <section className="hero-section relative w-full min-h-[min(100vh,800px)] overflow-hidden flex items-center justify-center">
          <div className="hero-bg absolute inset-0">
            <Image
              src="https://raw.githubusercontent.com/Priya-Looklyy/looklyy1.2/master/public/assets/photos/Untitled%20design%20(42).png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
          </div>
          <div className="hero-content relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6">
            <h1
              className="hero-headtext"
              style={{
                fontFamily: "'League Spartan', sans-serif",
                fontSize: 'clamp(2.5rem, 12vw, 135px)',
                fontWeight: 'bold',
                lineHeight: 0.94,
                color: '#8f1eae',
              }}
            >
              Style,
              <br />
              Simplified.
            </h1>
            <p
              className="hero-subtext"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '40px',
                lineHeight: 0.94,
                color: '#8f1eae',
                marginTop: '55px',
              }}
            >
              Turn every shopping moment into a styling lesson
            </p>
          </div>
        </section>

        {/* Join the Early List - two columns: image left, form right (1366×768) */}
        <section
          className="w-full max-w-[1366px] mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[768px] md:h-[768px] bg-[#faf7fc]"
          style={{ width: 'min(100%, 1366px)' }}
        >
          {/* Left: image edge-to-edge */}
          <div className="relative w-full h-[50vh] md:h-full min-h-[280px] overflow-hidden">
            <Image
              src="https://raw.githubusercontent.com/Priya-Looklyy/looklyy1.2/master/public/assets/photos/Untitled%20design%20(43).png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="683px"
            />
          </div>
          {/* Right: form */}
          <div className="relative w-full min-h-[320px] md:min-h-0 md:h-full flex items-center justify-center bg-[#faf7fc] p-6">
            {!form1Submitted ? (
              <IllustrationWaitlistForm
                onSubmit={(email, phone) => submitWaitlist(email, phone, 'form1')}
                isSubmitting={isSubmitting}
                error={form1Error}
              />
            ) : (
              <p
                className="text-center font-medium"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  color: '#5a4d6b',
                  fontSize: 'clamp(16px, 3.5vw, 20px)',
                }}
              >
                You&apos;re on the list.
              </p>
            )}
          </div>
        </section>

        {/* Extended Content - Founder Story & footer */}
        <div className="extended-content w-[calc(100%+24px)] -ml-6 -mr-6 bg-[#faf7fc] p-6 min-h-[400px]">
          <div className="max-w-xl mx-auto">

            {/* Founder Story - photo left 50%, name + 3 paragraphs right 50%; mobile: text first, then photo; rest full width */}
            <div
              className="w-[90%] max-w-full mx-auto my-8 py-6 flex flex-col gap-6"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                backgroundColor: '#faf7fc',
              }}
            >
              <h3
                className="font-bold uppercase w-full text-left"
                style={{
                  fontSize: 'clamp(19.4px, 4.85vw, 29px)',
                  lineHeight: 1.2,
                  color: '#8f1eae',
                }}
              >
                Founder Story
              </h3>

              {/* Top row: photo 50% | name + 3 paragraphs 50%; mobile: name + 3 paras first, then photo */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                {/* Right half on desktop - founder name + 3 paragraphs; first on mobile */}
                <div className="w-full flex flex-col gap-4 order-1 md:order-2">
                  <p
                    className="font-bold"
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      fontSize: 'clamp(18px, 4.5vw, 24px)',
                      lineHeight: 1.3,
                      color: '#8f1eae',
                    }}
                  >
                    Priya Stephen
                  </p>
                  <p
                    className="font-normal italic"
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      fontSize: 'clamp(14px, 3.5vw, 18px)',
                      lineHeight: 1.5,
                      color: '#000',
                    }}
                  >
                    Style is considered as taste, I believe it&apos;s a skill
                  </p>
                  <p
                    className="font-normal"
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      fontSize: 'clamp(14px, 3.5vw, 17px)',
                      lineHeight: 1.55,
                      color: '#000',
                    }}
                  >
                    I didn&apos;t set out to build a fashion product.
                  </p>
                  <p
                    className="font-normal"
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      fontSize: 'clamp(14px, 3.5vw, 17px)',
                      lineHeight: 1.55,
                      color: '#000',
                    }}
                  >
                    After a personal weight-transformation journey, my messages slowly filled with questions about how I dressed. Most people asked where my clothes were from.
                  </p>
                </div>
                {/* Left half on desktop - founder photo; second on mobile */}
                <div
                  className="w-full flex items-center justify-center min-h-[200px] md:min-h-0 order-2 md:order-1"
                  style={{ backgroundColor: '#faf7fc' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://raw.githubusercontent.com/Priya-Looklyy/looklyy1.2/refs/heads/master/public/assets/illustrations/FounderPhoto.svg"
                    alt="Founder"
                    loading="lazy"
                    className="w-full h-full object-contain block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.background = '#e5e7eb';
                      (e.target as HTMLImageElement).alt = 'Image unavailable';
                    }}
                  />
                </div>
              </div>

              {/* Bottom row - rest of paragraphs full width */}
              <div
                className="w-full flex flex-col gap-4 font-normal"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: 'clamp(14px, 3.5vw, 17px)',
                  lineHeight: 1.55,
                  color: '#000',
                }}
              >
                <p>
                  But what worked for me didn&apos;t quite land the same way for others. I could share an outfit, but not the understanding behind it.
                </p>
                <p>
                  Over time, I noticed a pattern. People weren&apos;t asking for more choices — they were asking quieter questions: the kind you don&apos;t always know how to phrase, only how to feel.
                </p>
                <p>
                  My background has always lived between creativity and behaviour, studying fashion, working as a marketing professional, building a home business, and competing and winning a crown at Mrs World International. Different worlds, but the same observation repeated: people don&apos;t struggle with expression; they struggle with understanding themselves.
                </p>
                <p>Looklyy began as a response to that gap.</p>
              </div>
            </div>

            <p
              className="mb-6 mt-6 text-center"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                color: '#000000',
                fontSize: 'clamp(11px, 2.5vw, 12px)',
              }}
            >
              Be the first to know when we launch |{' '}
              <a
                href="mailto:hello@looklyy.com"
                className="underline hover:opacity-80"
                style={{ color: 'inherit' }}
              >
                hello@looklyy.com
              </a>{' '}
              |
              <br />
              By submitting you agree to our terms of Privacy Policy
            </p>

            {step === 'success' && (
              <div style={{ color: '#8f1eae' }}>
                <SuccessStep />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thank You Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div
            className="rounded-lg shadow-xl p-8 max-w-sm w-full text-center"
            style={{ backgroundColor: '#faf7fc', border: '2px solid #8f1eae' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(250, 247, 252, 0.9)' }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: '#8f1eae' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium" style={{ color: '#8f1eae' }}>
              Thank you! We&apos;ll be in touch soon.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
