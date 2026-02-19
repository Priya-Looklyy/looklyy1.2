'use client';

import { useState } from 'react';

type InteractivePhoneEmailProps = {
  onSubmit: (email: string, phone: string) => Promise<void>;
  isSubmitting: boolean;
  error: string;
};

/** Overlay positions - adjust these to match the pill locations in the illustration */
const OVERLAY_POSITIONS = {
  email: { top: '28%', left: '8%', width: '38%', height: '12%' },
  phone: { top: '28%', left: '54%', width: '38%', height: '12%' },
  submit: { bottom: '10%', left: '20%', width: '60%', height: '14%' },
};

export default function InteractivePhoneEmail({
  onSubmit,
  isSubmitting,
  error,
}: InteractivePhoneEmailProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailActive, setEmailActive] = useState(false);
  const [phoneActive, setPhoneActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedEmail) return;
    await onSubmit(trimmedEmail, trimmedPhone);
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneDigits = phone.replace(/\D/g, '');
  const phoneValid = phoneDigits.length >= 7 && phoneDigits.length <= 15;

  return (
    <div
      className="relative w-full"
      style={{
        background: 'linear-gradient(135deg, #ffa114 0%, #ff8c00 100%)',
        minHeight: '280px',
        aspectRatio: '16 / 10',
      }}
    >
      {/* Illustration - full size, no overlay styling */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://raw.githubusercontent.com/Priya-Looklyy/looklyy1.2/refs/heads/master/public/assets/illustrations/Phone%20and%20Email.svg"
        alt="Phone and Email"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* Transparent overlay - sits exactly on top of illustration, inputs positioned over the pills */}
      <form
        onSubmit={handleSubmit}
        className="absolute inset-0"
      >
        {/* Email pill overlay - click reveals input, covering (dissolving) the illustration text */}
        <div
          className="absolute rounded-full overflow-hidden transition-opacity duration-300"
          style={{
            top: OVERLAY_POSITIONS.email.top,
            left: OVERLAY_POSITIONS.email.left,
            width: OVERLAY_POSITIONS.email.width,
            height: OVERLAY_POSITIONS.email.height,
          }}
        >
          {!emailActive && !email ? (
            <button
              type="button"
              onClick={() => setEmailActive(true)}
              className="w-full h-full bg-transparent border-none cursor-pointer flex items-center justify-center"
              aria-label="Enter email"
            />
          ) : (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailActive(true)}
              onBlur={() => !email && setEmailActive(false)}
              className="w-full h-full bg-[#ff8c00]/95 border-none outline-none text-white text-center px-2"
              style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 'clamp(10px, 2.5vw, 14px)' }}
              placeholder="email@example.com"
              autoFocus={emailActive}
            />
          )}
        </div>

        {/* Phone pill overlay - click reveals input, covering (dissolving) the illustration text */}
        <div
          className="absolute rounded-full overflow-hidden transition-opacity duration-300"
          style={{
            top: OVERLAY_POSITIONS.phone.top,
            left: OVERLAY_POSITIONS.phone.left,
            width: OVERLAY_POSITIONS.phone.width,
            height: OVERLAY_POSITIONS.phone.height,
          }}
        >
          {!phoneActive && !phone ? (
            <button
              type="button"
              onClick={() => setPhoneActive(true)}
              className="w-full h-full bg-transparent border-none cursor-pointer flex items-center justify-center"
              aria-label="Enter phone"
            />
          ) : (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => setPhoneActive(true)}
              onBlur={() => !phone && setPhoneActive(false)}
              className="w-full h-full bg-[#ff8c00]/95 border-none outline-none text-white text-center px-2"
              style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 'clamp(10px, 2.5vw, 14px)' }}
              placeholder="+1 234 567 8900"
              inputMode="tel"
              autoFocus={phoneActive}
            />
          )}
        </div>

        {/* Submit button overlay - positioned over "Join the early list" in the illustration */}
        <button
          type="submit"
          disabled={!emailValid || !phoneValid || isSubmitting}
          className="absolute bg-transparent border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded-full flex items-center justify-center text-transparent hover:bg-white/5 active:bg-white/10 transition-colors"
          style={{
            bottom: OVERLAY_POSITIONS.submit.bottom,
            left: OVERLAY_POSITIONS.submit.left,
            width: OVERLAY_POSITIONS.submit.width,
            height: OVERLAY_POSITIONS.submit.height,
          }}
          aria-label={isSubmitting ? 'Submitting...' : 'Join the early list'}
        />
      </form>

      {error && (
        <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-white bg-red-500/50 px-2 py-1 rounded">
          {error}
        </p>
      )}
    </div>
  );
}
