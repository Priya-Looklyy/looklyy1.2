'use client';

import { useState } from 'react';
import type { Step } from '@/types/flow';

type WaitlistEmailStepProps = {
  stepState: Step;
  setStepState: (step: Step) => void;
  onEmailSubmit: (email: string) => void;
};

export default function WaitlistEmailStep({ stepState, setStepState, onEmailSubmit }: WaitlistEmailStepProps) {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

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

  if (stepState !== 'email') {
    return null;
  }

  return (
    <div className="w-full">
      <input
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
