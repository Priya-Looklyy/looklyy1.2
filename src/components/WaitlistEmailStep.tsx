'use client';

import { useState, useEffect, useRef } from 'react';
import type { Step } from '@/types/flow';

type WaitlistEmailStepProps = {
  stepState: Step;
  setStepState: (step: Step) => void;
  onEmailSubmit: (email: string) => void;
};

export default function WaitlistEmailStep({ stepState, setStepState, onEmailSubmit }: WaitlistEmailStepProps) {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Email validation
  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleContinue = () => {
    if (isValid) {
      onEmailSubmit(email);
      setStepState('phone');
    }
  };

  useEffect(() => {
    if (stepState === 'email' && inputRef.current) {
      // Delay focus by 150ms to avoid iOS layout jump
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [stepState]);

  if (stepState !== 'email') {
    return null;
  }

  return (
    <div className="w-full opacity-0 translate-y-4 animate-fade-in-up">
      <input
        ref={inputRef}
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Your Email"
        className="w-full border-b-2 border-gray-300 pb-2 outline-none focus:border-purple-600 transition-colors placeholder:text-gray-400 px-0 text-center"
        style={{
          minHeight: '44px',
          fontSize: '16px',
        }}
      />
      <button
        onClick={handleContinue}
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
