'use client';

import { useEffect, useRef } from 'react';

type EmailStepProps = {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
};

export default function EmailStep({ value, onChange, onContinue }: EmailStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Auto focus after 150ms
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid) {
      onContinue();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Your Email"
        className="w-full outline-none transition-all placeholder:text-gray-400 px-0 text-center border-0 focus:border-2 focus:border-purple-600"
        style={{
          height: '56px',
          fontSize: '16px',
          borderRadius: '16px',
        }}
      />
      <button
        onClick={onContinue}
        disabled={!isValid}
        className="w-full bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-6"
        style={{
          minHeight: '44px',
          fontSize: '16px',
        }}
      >
        Continue
      </button>
    </div>
  );
}
