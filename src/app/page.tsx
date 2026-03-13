'use client';

import { useState, useEffect, useRef } from 'react';
import IllustrationWaitlistForm from '@/components/IllustrationWaitlistForm';
import { submitWaitlist as submitWaitlistToDB } from '@/lib/supabase';

export default function Home() {
  const [form1Error, setForm1Error] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [form1Submitted, setForm1Submitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

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

  // Scroll-triggered section visibility for animations
  useEffect(() => {
    const observers = sectionRefs.current
      .filter(Boolean)
      .map((el, i) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            setVisibleSections((prev) => new Set(prev).add(i));
          },
          { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
        );
        observer.observe(el!);
        return observer;
      });
    return () => observers.forEach((o) => o.disconnect());
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
    <main
      className="min-h-screen w-full overflow-x-hidden bg-[#faf7fc] landing-mesh"
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="/assets/Style-Simplified.png"
            alt="Illustrated clothing rack"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Hero text */}
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-32">
          <h1
            className="landing-hero-reveal"
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

      {/* Section 1 */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="bg-[#faf7fc] py-12 sm:py-16"
      >
        <div
          className={`mx-auto max-w-3xl px-4 sm:px-6 text-center landing-reveal ${visibleSections.has(0) ? 'landing-reveal--visible' : ''}`}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-[#8f1eae]">
            Shopping online was supposed to be fun
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#5a4d6b]">
            Somewhere along the way it turned into endless scrolling, recycled trends, and the same content everywhere.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="bg-[#faf7fc] py-12 sm:py-16"
      >
        <div
          className={`mx-auto max-w-3xl px-4 sm:px-6 text-center landing-reveal landing-reveal-delay-1 ${visibleSections.has(1) ? 'landing-reveal--visible' : ''}`}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-[#8f1eae]">
            Finding cool stuff that suits you shouldn&apos;t feel like work
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#5a4d6b]">
            The best combinations are always hidden under algorithms, ads, and things you never asked to see.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="bg-[#faf7fc] py-12 sm:py-16"
      >
        <div
          className={`mx-auto max-w-3xl px-4 sm:px-6 text-center landing-reveal landing-reveal-delay-2 ${visibleSections.has(2) ? 'landing-reveal--visible' : ''}`}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-[#8f1eae]">
            We&apos;re fixing that quietly
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#5a4d6b]">
            Early members will be the first to experience Looklyy.
          </p>
        </div>
      </section>

      {/* Waitlist section with form */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        id="waitlist"
        className="bg-[#faf7fc] py-10 sm:py-16"
      >
        <div
          className={`mx-auto flex max-w-md flex-col items-center gap-6 px-4 sm:px-6 landing-reveal landing-reveal-delay-3 ${visibleSections.has(3) ? 'landing-reveal--visible' : ''}`}
        >
          <div className="relative w-full max-w-md min-h-[220px] landing-form-card rounded-3xl border border-[#e5d7f0] bg-white/90 p-5 shadow-[0_16px_40px_rgba(54,16,83,0.12)] backdrop-blur">
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
    </main>
  );
}
