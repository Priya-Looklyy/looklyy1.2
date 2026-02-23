'use client';

import { useState } from 'react';

type IllustrationWaitlistFormProps = {
  onSubmit: (email: string, phone: string) => Promise<void>;
  isSubmitting: boolean;
  error: string;
};

const PILL_STYLE = {
  fontFamily: "'Roboto Mono', monospace",
  color: '#5a4d6b',
};

export default function IllustrationWaitlistForm({
  onSubmit,
  isSubmitting,
  error,
}: IllustrationWaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    
    // Validate email
    if (!trimmedEmail) {
      console.warn('⚠️ Email is required');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      console.warn('⚠️ Invalid email format:', trimmedEmail);
      return;
    }
    
    // Validate phone (optional, but if provided must be valid)
    const digits = trimmedPhone.replace(/\D/g, '');
    if (digits.length > 0 && (digits.length < 7 || digits.length > 16)) {
      console.warn('⚠️ Invalid phone format:', trimmedPhone);
      return;
    }
    
    console.log('📝 Form submitting:', { email: trimmedEmail, phone: trimmedPhone || 'not provided' });
    
    try {
      await onSubmit(trimmedEmail, trimmedPhone || '');
      // Don't clear fields here - let the parent component handle success state
    } catch (err) {
      console.error('❌ Form submission error:', err);
    }
  };

  const showEmailPlaceholder = !emailFocused && !email;
  const showPhonePlaceholder = !phoneFocused && !phone;

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute inset-0 z-10 flex flex-col justify-center px-[8%] md:px-[10%]"
    >
      {/* Pills container - full width with equal side padding */}
      <div className="flex flex-col gap-3 w-full">
        {/* Email pill - label dissolves when input is focused or has value */}
        <div
          className="rounded-full overflow-hidden flex items-center relative"
          style={{
            ...PILL_STYLE,
            border: '2px solid #c4b5d4',
            background: 'transparent',
            minHeight: '37px',
          }}
        >
          {showEmailPlaceholder && (
            <span
              className="absolute inset-0 flex items-center px-5 pointer-events-none select-none"
              style={{
                ...PILL_STYLE,
                fontSize: 'clamp(12px, 2.8vw, 14px)',
              }}
            >
              Email
            </span>
          )}
          <input
            id="illustration-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            aria-label="Email"
            autoComplete="email"
            className="relative z-10 w-full min-h-[33px] px-5 py-2 bg-transparent border-none outline-none text-left placeholder:opacity-60 touch-manipulation"
            style={{
              ...PILL_STYLE,
              fontSize: 'clamp(12px, 2.8vw, 14px)',
            }}
          />
        </div>

        {/* Phone pill - placeholder dissolves when input is focused or has value */}
        <div
          className="rounded-full overflow-hidden flex items-center relative"
          style={{
            ...PILL_STYLE,
            border: '2px solid #c4b5d4',
            background: 'transparent',
            minHeight: '37px',
          }}
        >
          {showPhonePlaceholder && (
            <span
              className="absolute inset-0 flex items-center px-5 pointer-events-none select-none"
              style={{
                ...PILL_STYLE,
                fontSize: 'clamp(12px, 2.8vw, 14px)',
              }}
            >
              Phone
            </span>
          )}
          <input
            id="illustration-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            inputMode="tel"
            aria-label="Phone"
            autoComplete="tel"
            className="relative z-10 w-full min-h-[33px] px-5 py-2 bg-transparent border-none outline-none text-left placeholder:opacity-60 touch-manipulation"
            style={{
              ...PILL_STYLE,
              fontSize: 'clamp(12px, 2.8vw, 14px)',
            }}
          />
        </div>
      </div>


      {/* Submit button - center aligned, below pills, above illustration */}
      <div className="relative z-20 w-full flex justify-center mt-5 px-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="landing-btn relative z-20 rounded-full px-8 py-3 border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          style={{
            fontFamily: "'Roboto Mono', monospace",
            backgroundColor: '#8f1eae',
            color: '#faf7fc',
            fontSize: 'clamp(13px, 2.8vw, 15px)',
          }}
        >
          Join the early list
        </button>
      </div>

      {error && (
        <p
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white bg-red-500/70 px-3 py-2 rounded"
          style={{ fontFamily: "'Roboto Mono', monospace" }}
        >
          {error}
        </p>
      )}
    </form>
  );
}
