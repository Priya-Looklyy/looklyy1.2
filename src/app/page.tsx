'use client';

import { useState, useEffect } from 'react';
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
    <main
      className="min-h-screen w-full overflow-x-hidden bg-[#faf7fc]"
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      {/* Top navigation */}
      <header className="sticky top-0 z-30 bg-[#faf7fc]/90 backdrop-blur border-b border-[#e5d7f0]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#8f1eae]/10 text-[#8f1eae] text-sm font-semibold">
              L
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-[0.14em] uppercase text-[#8f1eae]">
                Looklyy
              </span>
              <span className="text-[11px] text-[#5a4d6b]">
                Style, simplified.
              </span>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-xs sm:flex">
            <a href="#how-it-works" className="text-[#5a4d6b] hover:text-[#8f1eae] transition-colors">
              How it works
            </a>
            <a href="#why-looklyy" className="text-[#5a4d6b] hover:text-[#8f1eae] transition-colors">
              Why Looklyy
            </a>
            <a href="#founder-story" className="text-[#5a4d6b] hover:text-[#8f1eae] transition-colors">
              Founder
            </a>
            <a
              href="#waitlist"
              className="rounded-full bg-[#8f1eae] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#731887] transition-colors"
            >
              Join the waitlist
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <video
            className="h-full w-full object-cover"
            src="/assets/Style,%20Simplified..mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Soft overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/25 mix-blend-multiply" />
          <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-[#8f1eae]/25 blur-3xl sm:h-80 sm:w-80" />
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-16 lg:flex-row lg:items-center lg:gap-14">
          {/* Hero copy */}
          <div className="relative z-10 max-w-xl space-y-6 lg:flex-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e5d7f0] bg-white/70 px-3 py-1 text-[11px] font-medium text-[#5a4d6b] shadow-sm backdrop-blur">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#8f1eae]/10 text-[10px] text-[#8f1eae]">
                ✶
              </span>
              Personal styling that starts where you actually shop.
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
              style={{ fontFamily: "'League Spartan', sans-serif", color: '#8f1eae', lineHeight: 0.95 }}
            >
              Style that
              <br />
              grows with you.
            </h1>
            <p
              className="text-sm sm:text-base leading-relaxed text-[#5a4d6b]"
              style={{ fontFamily: "'Roboto Mono', monospace" }}
            >
              Looklyy turns every scroll, cart and purchase into a quiet styling lesson. No outfit dumps, no
              overwhelm—just small, repeatable cues that help you understand what actually works for you.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center rounded-full bg-[#8f1eae] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#8f1eae]/30 hover:bg-[#731887] transition-colors"
              >
                Join the early list
              </a>
              <p className="text-[11px] text-[#5a4d6b]">
                Be part of the first cohort shaping Looklyy.
              </p>
            </div>

            <div className="mt-4 grid gap-3 text-[11px] text-[#5a4d6b] sm:text-xs sm:grid-cols-3">
              <div className="rounded-2xl border border-[#e5d7f0] bg-white/70 p-3 shadow-sm backdrop-blur">
                <p className="font-semibold text-[#8f1eae]">For real wardrobes</p>
                <p className="mt-1">
                  Built around how you already browse, buy and get dressed.
                </p>
              </div>
              <div className="rounded-2xl border border-[#e5d7f0] bg-white/70 p-3 shadow-sm backdrop-blur">
                <p className="font-semibold text-[#8f1eae]">Micro-lessons</p>
                <p className="mt-1">
                  Tiny styling nudges stitched into everyday shopping.
                </p>
              </div>
              <div className="rounded-2xl border border-[#e5d7f0] bg-white/70 p-3 shadow-sm backdrop-blur">
                <p className="font-semibold text-[#8f1eae]">Calm by design</p>
                <p className="mt-1">
                  No shouting trends—just clarity on what feels like you.
                </p>
              </div>
            </div>
          </div>

          {/* Right column - clean, image-free panel */}
          <div className="relative flex-1">
            <div className="mx-auto max-w-xs sm:max-w-sm">
              <div className="relative overflow-hidden rounded-[32px] border border-[#e5d7f0] bg-white/90 p-5 shadow-[0_18px_60px_rgba(54,16,83,0.18)] backdrop-blur">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(143,30,174,0.08),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(90,77,107,0.06),_transparent_55%)]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f1eae]">
                  What Looklyy feels like
                </p>
                <p className="mt-3 text-sm font-medium text-[#2b1038]">
                  Quiet guidance, not loud trends.
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-[#5a4d6b]">
                  Instead of another feed of outfits, Looklyy gives you language for why certain shapes, fabrics and
                  proportions keep working for you—so you can repeat them anywhere you shop.
                </p>
                <div className="mt-4 grid gap-3 text-[10px] text-[#5a4d6b]">
                  <div className="flex items-start gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#8f1eae]" />
                    <p>Small, contextual notes inside your real shopping flow.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#8f1eae]" />
                    <p>Patterns in what you keep vs. return, surfaced gently over time.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#8f1eae]" />
                    <p>A calmer relationship with your wardrobe and the mirror.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-[#e5d7f0] bg-white/70 py-10 sm:py-14"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-md space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f1eae]">
                How Looklyy fits in
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2b1038]">
                From scroll, to cart, to a wardrobe you recognise.
              </h2>
            </div>
            <p className="max-w-sm text-[11px] sm:text-sm leading-relaxed text-[#5a4d6b]">
              Looklyy lives beside your shopping—not on top of it. We capture patterns in what you reach for, what you
              keep, and what you send back.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e5d7f0] bg-[#faf7fc] p-4 shadow-sm">
              <p className="text-xs font-semibold text-[#8f1eae]">01 · Notice</p>
              <p className="mt-2 text-sm font-medium text-[#2b1038]">
                Your quiet preferences, surfaced.
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-[#5a4d6b]">
                We learn from the pieces you almost buy, not just the ones that make it home, so your “maybe”s start
                making more sense.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e5d7f0] bg-[#faf7fc] p-4 shadow-sm">
              <p className="text-xs font-semibold text-[#8f1eae]">02 · Translate</p>
              <p className="mt-2 text-sm font-medium text-[#2b1038]">
                Fit, proportion &amp; vibe in plain language.
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-[#5a4d6b]">
                Tiny notes like “this sleeve softens your shoulders” or “this length keeps your wardrobe coherent”
                replace vague “this is cute”.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e5d7f0] bg-[#faf7fc] p-4 shadow-sm">
              <p className="text-xs font-semibold text-[#8f1eae]">03 · Repeat</p>
              <p className="mt-2 text-sm font-medium text-[#2b1038]">
                Skills you can take anywhere.
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-[#5a4d6b]">
                Over time, you start to see the patterns yourself—across brands, budgets and seasons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Looklyy / social proof */}
      <section
        id="why-looklyy"
        className="py-10 sm:py-14"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f1eae]">
                Why now
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2b1038]">
                We&apos;re all drowning in options. Very few of them feel like us.
              </h2>
              <p className="text-[11px] sm:text-sm leading-relaxed text-[#5a4d6b]">
                Looklyy is built for the quiet questions people don&apos;t always know how to ask:{" "}
                <span className="italic">
                  “Why does that blazer feel like me, but this one doesn&apos;t?”
                </span>{" "}
                “How do I shop differently now that my body, role or season has changed?”
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#e5d7f0] bg-white p-4 text-[11px] sm:text-xs text-[#5a4d6b] shadow-sm">
                  <p className="font-semibold text-[#8f1eae]">
                    Not a closet makeover. A conversation.
                  </p>
                  <p className="mt-1">
                    Instead of telling you what to buy next, Looklyy explains why certain choices keep working—and how
                    to repeat them with what you already own.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e5d7f0] bg-white p-4 text-[11px] sm:text-xs text-[#5a4d6b] shadow-sm">
                  <p className="font-semibold text-[#8f1eae]">
                    Built for change.
                  </p>
                  <p className="mt-1">
                    Weight shifts, promotions, new cities, new phases—your style language adapts with you, without
                    needing a whole new wardrobe every time.
                  </p>
                </div>
              </div>
            </div>

            {/* Early list CTA card */}
            <div
              id="waitlist"
              className="rounded-3xl border border-[#e5d7f0] bg-white/90 p-5 shadow-[0_16px_40px_rgba(54,16,83,0.12)] backdrop-blur"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f1eae]">
                Early access
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[#2b1038]">
                Join the first Looklyy cohort.
              </h3>
              <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-[#5a4d6b]">
                We&apos;re inviting a small group of early users to shape how Looklyy works. You&apos;ll get early
                features, direct feedback loops and a product built around your real questions.
              </p>

              <div className="mt-4">
                {!form1Submitted ? (
                  <IllustrationWaitlistForm
                    onSubmit={(email, phone) => submitWaitlist(email, phone, 'form1')}
                    isSubmitting={isSubmitting}
                    error={form1Error}
                  />
                ) : (
                  <p
                    className="mt-2 text-center text-sm font-medium"
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      color: '#5a4d6b',
                    }}
                  >
                    You&apos;re on the list.
                  </p>
                )}
              </div>

              {step === 'success' && (
                <div className="mt-4 text-[#8f1eae]">
                  <SuccessStep />
                </div>
              )}

              <p className="mt-4 text-[10px] leading-relaxed text-[#8b7a9e] text-center">
                By joining, you agree to receive emails about Looklyy. No spam, no resale—just thoughtful updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder story */}
      <section
        id="founder-story"
        className="border-t border-[#e5d7f0] bg-[#faf7fc] py-10 sm:py-14"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-[#e5d7f0] bg-white/90 p-6 sm:p-8 shadow-[0_16px_40px_rgba(54,16,83,0.08)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f1eae]">
              Founder story
            </p>
            <div className="mt-4 space-y-3 text-[11px] sm:text-sm leading-relaxed text-[#2b1038]">
              <p className="text-base sm:text-lg font-semibold text-[#8f1eae]">
                Priya Stephen
              </p>
              <p className="italic text-[#5a4d6b]">
                “Style is often framed as taste. I believe it&apos;s a skill.”
              </p>
              <p>
                I didn&apos;t set out to build a fashion product. After a weight-transformation journey, my messages
                slowly filled with questions about how I dressed. People asked where my clothes were from, what brand,
                which store—but what worked for me rarely translated one‑to‑one for them.
              </p>
              <p>
                The real question underneath was harder to name:{" "}
                <span className="italic">
                  how do I understand why something feels like me, not just copy the item?
                </span>
              </p>
              <p>
                Across studying fashion, working in marketing, building a home business and standing on a Mrs World
                International stage, the pattern repeated. People don&apos;t struggle with expression; they struggle
                with understanding themselves in the mirror of their clothes.
              </p>
              <p className="font-medium text-[#5a4d6b]">
                Looklyy began as a response to that gap—a way to turn style from something you “have” into something
                you quietly practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5d7f0] bg-white py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[10px] sm:text-xs text-[#8b7a9e]">
            Be the first to know when we launch ·{" "}
            <a
              href="mailto:hello@looklyy.com"
              className="underline underline-offset-2 hover:text-[#8f1eae]"
            >
              hello@looklyy.com
            </a>
          </p>
          <p className="text-[9px] sm:text-[10px] text-[#b0a2c0]">
            By submitting your email you agree to receive updates in line with our Privacy Policy.
          </p>
        </div>
      </footer>

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
