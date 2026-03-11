'use client';

import { useState, useEffect } from 'react';
import IllustrationWaitlistForm from '@/components/IllustrationWaitlistForm';
import { submitWaitlist as submitWaitlistToDB } from '@/lib/supabase';

export default function Home() {
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
    } catch (err) {
      console.error('❌ Unexpected error in form:', err);
      setForm1Error('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="min-h-screen w-full overflow-x-hidden bg-[#faf7fc]"
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <video
            className="h-full w-full object-cover"
            src="/assets/Style,%20Simplified..mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Soft overlay for text readability (kept very light so video is visible) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/0 to-black/10" />
          <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-[#8f1eae]/25 blur-3xl sm:h-80 sm:w-80" />
        </div>

        {/* Hero text */}
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-32">
          <h1
            style={{
              fontFamily: '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(3rem, 18vw, 300px)',
              lineHeight: 0.9,
              color: '#8f1eae',
            }}
          >
            Style,
            <br />
            Simplified.
          </h1>
        </div>
      </section>

      {/* Waitlist section */}
      <section
        id="waitlist"
        className="bg-[#faf7fc] py-10 sm:py-16"
      >
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 sm:px-6">
          {/* Transparent container so the absolutely positioned form stays here and doesn't overlap the hero */}
          <div className="relative w-full max-w-md min-h-[220px]">
            {!form1Submitted && (
              <IllustrationWaitlistForm
                onSubmit={(email, phone) => submitWaitlist(email, phone, 'form1')}
                isSubmitting={isSubmitting}
                error={form1Error}
              />
            )}
          </div>
        </div>
      </section>

      {/* Thank You Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div
            className="max-w-sm w-full rounded-lg border border-[#8f1eae] bg-[#faf7fc] p-8 text-center shadow-xl"
          >
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(250, 247, 252, 0.9)' }}
            >
              <svg
                className="h-6 w-6 text-[#8f1eae]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-[#8f1eae]">
              Thank you! We&apos;ll be in touch soon.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
