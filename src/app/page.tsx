'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SuccessStep from '@/components/SuccessStep';
import IllustrationWaitlistForm from '@/components/IllustrationWaitlistForm';
import { submitWaitlist as submitWaitlistToDB } from '@/lib/supabase';
import type { Step } from '@/types/flow';

export default function Home() {
  const [step, setStep] = useState<Step>('email');
  // Separate error state for each form
  const [form1Error, setForm1Error] = useState('');
  const [form2Error, setForm2Error] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  // Separate state for each form instance
  const [form1Submitted, setForm1Submitted] = useState(false);
  const [form2Submitted, setForm2Submitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Removed localStorage check - it was causing both forms to disappear on page load
  // Each form should work independently

  useEffect(() => {
    if (showThankYou) {
      const t = setTimeout(() => setShowThankYou(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showThankYou]);

  const submitWaitlist = async (e: string, phone: string, formId: 'form1' | 'form2') => {
    // Prevent double submission
    if (isSubmitting) {
      console.log('⏸️ Already submitting, ignoring duplicate request');
      return;
    }
    
    // Check if this specific form was already submitted
    if (formId === 'form1' && form1Submitted) {
      console.log('⏸️ Form 1 already submitted');
      return;
    }
    if (formId === 'form2' && form2Submitted) {
      console.log('⏸️ Form 2 already submitted');
      return;
    }

    console.log(`📤 Submitting form ${formId} with email:`, e);
    
    // Clear error for the specific form
    if (formId === 'form1') {
      setForm1Error('');
    } else {
      setForm2Error('');
    }
    
    setIsSubmitting(true);

    try {
      const result = await submitWaitlistToDB(e, phone || null);
      
      console.log(`📥 Form ${formId} submission result:`, result);
      
      if (!result.success) {
        console.error(`❌ Form ${formId} submission failed:`, result.error);
        // Set error for the specific form
        if (formId === 'form1') {
          setForm1Error(result.error || 'Something went wrong');
        } else {
          setForm2Error(result.error || 'Something went wrong');
        }
        setIsSubmitting(false);
        return;
      }
      
      // Mark this specific form as submitted (only this one!)
      if (formId === 'form1') {
        console.log('✅ Form 1 submitted successfully');
        setForm1Submitted(true);
        setForm1Error(''); // Clear any previous errors
      } else {
        console.log('✅ Form 2 submitted successfully');
        setForm2Submitted(true);
        setForm2Error(''); // Clear any previous errors
      }
      
      // Don't set localStorage - let each form work independently
      setIsSubmitting(false);
      setShowThankYou(true);
      
      // Update step for backward compatibility (for SuccessStep component)
      setStep('success');
    } catch (err) {
      console.error(`❌ Unexpected error in form ${formId}:`, err);
      const errorMsg = 'An unexpected error occurred. Please try again.';
      if (formId === 'form1') {
        setForm1Error(errorMsg);
      } else {
        setForm2Error(errorMsg);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="landing-page fixed inset-0 overflow-x-hidden overflow-y-auto"
      style={{
        fontFamily: "'Roboto Mono', monospace",
        backgroundColor: '#fdf3c0',
      }}
    >
      <div
        className="wrapper flex flex-col w-full min-h-full p-6 pr-0 pb-[max(24px,env(safe-area-inset-bottom))]"
        style={{ paddingRight: 0 }}
      >
        {/* Header with Logo and Hello - responsive */}
        <header className="flex justify-between items-center mb-12 gap-4 pr-6">
          <div className="logo-placeholder flex items-center justify-center shrink-0 overflow-hidden">
            <Image
              src="/assets/Looklyy Logo.svg"
              alt="Looklyy Logo"
              width={129}
              height={129}
              className="w-full h-full object-contain"
              sizes="(max-width: 480px) 72px, (max-width: 640px) 104px, 129px"
            />
          </div>
          <span
            className="hello-text font-light text-[#ffa114] ml-auto"
            style={{ fontSize: 'clamp(14px, 4vw, 22px)' }}
          >
            hello
          </span>
        </header>

        {/* Main Content */}
        <main className="main-content flex flex-col items-center flex-1 -mt-2 pr-6">
          {/* HeadText Box */}
          <div className="text-box w-[calc(100%+24px)] -ml-6 bg-transparent py-6 pl-7 -mb-2">
            <div className="flex flex-wrap gap-2 leading-[1.12] items-baseline">
              <span className="text-what-if font-light uppercase" style={{ fontSize: '31.795px', color: '#ffa114' }}>
                What if
              </span>
            </div>
            <div className="flex flex-wrap gap-2 leading-[1.12] items-baseline">
              <span className="text-you-could font-bold uppercase" style={{ fontSize: '33.12px', color: '#ffa114' }}>
                You could see
              </span>
            </div>
            <div className="flex flex-wrap gap-2 leading-[1.12] items-baseline">
              <span className="text-why-some font-bold uppercase" style={{ fontSize: '55.2px', color: '#ffa114' }}>
                Why some Outfits
                <br />
                Work for you
              </span>
            </div>
          </div>

          {/* Illustration - fits container, no cropping (SVG viewBox 375×450) */}
          <div
            className="illustration-placeholder w-full max-w-[600px] bg-transparent rounded-xl flex items-center justify-center mx-auto mb-0 overflow-visible"
            style={{ fontFamily: "'Roboto Mono', monospace", color: '#ffa114' }}
          >
            <div className="w-full relative" style={{ aspectRatio: '375 / 450' }}>
              <Image
                src="/assets/illustrations/Homepage_Illistration.svg"
                alt="Looklyy Illustration"
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 600px) 100vw, 600px"
              />
            </div>
          </div>
        </main>

        {/* Extended Content - Waitlist Form */}
        <div className="extended-content w-[calc(100%+24px)] -ml-6 -mr-6 bg-[#fdf3c0] p-6 min-h-[400px]">
          <div className="max-w-xl mx-auto">
            {/* Conversation section - responsive HTML text instead of SVG text */}
            <div
              className="w-full py-5 mb-6 flex flex-col items-center"
              style={{ fontFamily: "'Roboto Mono', monospace", color: '#ffa114' }}
            >
              <p
                className="font-bold uppercase w-full text-left mb-4"
                style={{
                  fontSize: 'clamp(20px, 5vw, 33.12px)',
                  lineHeight: 1.12,
                }}
              >
                We are exploring the idea
              </p>

              {/* Speech bubble with VOICE YOUR THOUGHTS */}
              <div
                className="relative w-full max-w-[420px] py-6 px-6 mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: '#ff8c00',
                  boxShadow: '0 4px 20px rgba(255, 140, 0, 0.3)',
                }}
              >
                <div
                  className="absolute -bottom-4 left-8 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[24px] border-l-transparent border-r-transparent border-t-[#ff8c00]"
                  style={{ transform: 'rotate(-15deg)' }}
                />
                <p
                  className="font-bold uppercase text-white text-center leading-tight"
                  style={{
                    fontSize: 'clamp(18px, 4.5vw, 28px)',
                  }}
                >
                  Voice your thoughts
                </p>
              </div>

              <p
                className="font-bold uppercase w-full text-left"
                style={{
                  fontSize: 'clamp(20px, 5vw, 33.12px)',
                  lineHeight: 1.12,
                }}
              >
                How you decide what to wear
              </p>
            </div>

            {/* Full-width Phone & Email illustration with overlay form */}
            <div
              className="relative w-screen overflow-hidden my-6 flex items-center justify-center"
              style={{
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                aspectRatio: '16 / 10',
                background: 'linear-gradient(135deg, #ffa114 0%, #ff8c00 100%)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://raw.githubusercontent.com/Priya-Looklyy/looklyy1.2/refs/heads/master/public/assets/illustrations/Illustration_Phone%26Email.svg"
                alt="Phone and Email illustration"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.background = 'rgba(255, 255, 255, 0.1)';
                  (e.target as HTMLImageElement).alt = 'Illustration unavailable';
                }}
              />
              {!form1Submitted ? (
                <IllustrationWaitlistForm
                  onSubmit={(email, phone) => submitWaitlist(email, phone, 'form1')}
                  isSubmitting={isSubmitting}
                  error={form1Error}
                />
              ) : (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <p
                    className="text-center font-medium"
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      color: '#fdf3c0',
                      fontSize: 'clamp(16px, 3.5vw, 20px)',
                    }}
                  >
                    You&apos;re on the list.
                  </p>
                </div>
              )}
            </div>

            {/* Founder Story - photo left 50%, name + 3 paragraphs right 50%; mobile: text first, then photo; rest full width */}
            <div
              className="w-[90%] max-w-full mx-auto my-8 py-6 flex flex-col gap-6"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                backgroundColor: '#fdf3c0',
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
                      color: '#ffa114',
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
                  style={{ backgroundColor: '#fdf3c0' }}
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

            {/* Believe in the idea - full-width panel */}
            <div
              className="w-screen mt-12 mb-8 flex flex-col overflow-hidden"
              style={{
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                backgroundColor: '#ffd864',
                minHeight: '400px',
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              <h3
                className="font-bold text-left w-full px-6 md:px-10 pt-6 pb-3 uppercase tracking-wide"
                style={{
                  fontSize: 'clamp(17px, 4.2vw, 22px)',
                  color: '#ffa114',
                  letterSpacing: '0.02em',
                }}
              >
                BELIEVE IN THE IDEA?
              </h3>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 min-h-0 px-4 md:px-8 pb-6">
                {/* Illustration: on mobile first (top), on md+ left */}
                <div className="flex items-center justify-center overflow-hidden p-4 order-1 min-h-[200px] md:min-h-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://raw.githubusercontent.com/Priya-Looklyy/looklyy1.2/refs/heads/master/public/assets/illustrations/Co-Founder.svg"
                    alt="Co-Founder"
                    loading="lazy"
                    className="w-full h-full max-h-[280px] md:max-h-none object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.background = '#ffd864';
                      (e.target as HTMLImageElement).alt = 'Image unavailable';
                    }}
                  />
                </div>
                {/* Text: on mobile second (bottom), on md+ right; left aligned, vertical center */}
                <div className="flex items-center px-4 md:px-6 py-4 order-2">
                  <p
                    className="font-normal text-left w-full"
                    style={{
                      fontSize: 'clamp(14px, 2.2vw, 18px)',
                      lineHeight: 1.4,
                      color: '#000000',
                    }}
                  >
                    I&apos;m looking for a Co-Founder to shape this idea
                  </p>
                </div>
              </div>
            </div>

            {/* Write to me + email - full width, no bleed top/bottom/sides */}
            <div
              className="w-screen py-8 px-4"
              style={{
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                marginTop: '-2rem',
                marginBottom: '-2rem',
                backgroundColor: '#ffd864',
              }}
            >
              <p
                className="text-center mb-2"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: 'clamp(10px, 2.5vw, 12px)',
                  color: '#000000',
                  fontWeight: 400,
                }}
              >
                Write to me
              </p>
              <div className="flex justify-center">
                <span
                  className="inline-block text-center px-4 py-2"
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: 'clamp(14px, 3.5vw, 17px)',
                    color: '#000000',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  hello@looklyy.com
                </span>
              </div>
            </div>

            {/* Replica waitlist form - same functionality, no illustration */}
            <div
              className="relative w-screen my-8 flex items-center justify-center overflow-hidden"
              style={{
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                minHeight: '280px',
                aspectRatio: '16 / 10',
                background: 'linear-gradient(135deg, #ffa114 0%, #ff8c00 100%)',
              }}
            >
              {!form2Submitted ? (
                <IllustrationWaitlistForm
                  onSubmit={(email, phone) => submitWaitlist(email, phone, 'form2')}
                  isSubmitting={isSubmitting}
                  error={form2Error}
                />
              ) : (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <p
                    className="text-center font-medium"
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      color: '#fdf3c0',
                      fontSize: 'clamp(16px, 3.5vw, 20px)',
                    }}
                  >
                    You&apos;re on the list.
                  </p>
                </div>
              )}
            </div>

            <p
              className="mb-6 mt-6 text-center"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                color: '#000000',
                fontSize: 'clamp(11px, 2.5vw, 12px)',
              }}
            >
              Be the first to know when we launch | Looklyy |
              <br />
              By submitting you agree to our terms of Privacy Policy
            </p>

            {step === 'success' && (
              <div style={{ color: '#ffa114' }}>
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
            style={{ backgroundColor: '#fdf3c0', border: '2px solid #ffa114' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(255, 161, 20, 0.3)' }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: '#ffa114' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium" style={{ color: '#ffa114' }}>
              Thank you! We&apos;ll be in touch soon.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
