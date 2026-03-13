'use client';

import { useState, useEffect } from 'react';
import IllustrationWaitlistForm from '@/components/IllustrationWaitlistForm';
import { submitWaitlist as submitWaitlistToDB } from '@/lib/supabase';
import { Hero } from '@/components/Hero';
import { AmoebaCards } from '@/components/AmoebaCards';

export default function Home() {
  const [form1Error, setForm1Error] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [form1Submitted, setForm1Submitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Removed localStorage check - it was causing both forms to disappear on page load
  // Each form should work independently

  useEffect(() => {
    if (showThankYou) {
      const t = setTimeout(() => setShowThankYou(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showThankYou]);

  // Simple visit analytics: record one visit per session
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = 'looklyy_visit_logged_v1';
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, '1');

    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathname: window.location.pathname,
        language: window.navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    }).catch(() => {
      // best-effort only
    });
  }, []);

  // Show subtle "back to top" arrow after scrolling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 240);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <main className="min-h-screen w-full overflow-x-hidden bg-[#faf7fc]" style={{ fontFamily: "'Roboto Mono', monospace" }}>
      {/* Simple navigation */}
      <header className="sticky top-0 z-30 bg-[#faf7fc]/85 backdrop-blur-sm border-b border-[#ece1f4]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <span
            style={{
              fontFamily:
                '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              color: '#8f1eae',
            }}
          >
            looklyy
          </span>
          <span
            className="text-xs sm:text-sm"
            style={{
              fontFamily:
                '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 300,
              color: '#6b6475',
            }}
          >
            hello
          </span>
        </div>
      </header>

      <Hero />

      <AmoebaCards />

      {/* Waitlist section with form */}
      <section id="waitlist" className="bg-[#faf7fc] py-8 sm:py-10">
        <div className="mx-auto w-full max-w-md px-4 sm:px-6">
          {!form1Submitted && (
            <IllustrationWaitlistForm
              onSubmit={(email, phone) => submitWaitlist(email, phone, 'form1')}
              isSubmitting={isSubmitting}
              error={form1Error}
            />
          )}
        </div>
      </section>

      {/* Placeholder single video section – clean, no scroll for now */}
      <section className="bg-[#faf7fc] pb-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto w-full sm:w-3/4 md:w-1/2 border border-[#e5d7f0] bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.18)] overflow-hidden">
            <div className="aspect-[9/16] w-full flex flex-col items-center justify-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-10 w-10 md:h-12 md:w-12 opacity-30"
                fill="none"
                stroke="#8f1eae"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="8" />
                <path d="M10 9.5v5l4-2.5-4-2.5z" fill="#8f1eae" />
              </svg>
              <span
                className="text-sm md:text-base text-center opacity-30"
                style={{
                  fontFamily:
                    '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: 300,
                  color: '#8f1eae',
                }}
              >
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Email + fine print */}
      <section className="bg-[#faf7fc] pb-10">
        <div className="mx-auto max-w-3xl px-6 text-center space-y-1">
          <p
            className="text-[11px] sm:text-xs whitespace-nowrap"
            style={{
              fontFamily:
                '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: '#6b6475',
              lineHeight: 1.4,
            }}
          >
            hello@looklyy.com | Be the first to experience looklyy
          </p>
          <p
            className="text-[9px] sm:text-[10px]"
            style={{
              fontFamily:
                '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 300,
              color: '#6b6475',
              lineHeight: 1.4,
            }}
          >
            You agree to our{' '}
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="underline underline-offset-2 decoration-[#6b6475] text-[#6b6475]"
            >
              privacy policy
            </button>{' '}
            by joining our early list
          </p>
        </div>
      </section>

      {/* Thank You Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div
            className="max-w-sm w-full rounded-2xl border border-[#8f1eae] bg-[#faf7fc] p-8 text-center shadow-xl landing-thank-you-modal"
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

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="relative max-w-lg w-full rounded-2xl border border-[#e5d7f0] bg-[#faf7fc] p-6 sm:p-8 shadow-xl">
            <button
              type="button"
              onClick={() => setShowPrivacy(false)}
              className="absolute right-4 top-4 text-[#8f1eae] hover:text-[#6b1a8a]"
              aria-label="Close privacy policy"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M7 17L17 7" />
                <path d="M9 7h8v8" />
              </svg>
            </button>

            <h2
              className="mb-3 text-base sm:text-lg"
              style={{
                fontFamily:
                  '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontWeight: 500,
                color: '#8f1eae',
              }}
            >
              Privacy policy
            </h2>
            <div className="max-h-72 overflow-y-auto pr-1">
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{
                  fontFamily:
                    '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: 300,
                  color: '#4b4455',
                }}
              >
                We use your email and phone number only to contact you about Looklyy, share early access,
                and occasionally ask for feedback. We don&apos;t sell your data, and we won&apos;t share it with
                third parties for their own marketing. You can opt out at any time by replying to any email
                from us or contacting hello@looklyy.com.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Back to top arrow */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-[#d6c7e6] bg-white/60 shadow-sm backdrop-blur-sm text-[#8f1eae] opacity-40 hover:opacity-70 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M12 6l-5 5" />
            <path d="M12 6l5 5" />
            <path d="M12 6v12" />
          </svg>
        </button>
      )}
    </main>
  );
}
