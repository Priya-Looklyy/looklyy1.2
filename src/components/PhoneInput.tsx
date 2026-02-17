'use client';

import { useState } from 'react';
import type { Step } from '@/types/flow';

type PhoneInputProps = {
  stepState: Step;
  setStepState: (step: Step) => void;
  email: string;
  submitWaitlist: (email: string, phone: string) => Promise<void>;
};

export default function PhoneInput({ stepState, setStepState, email, submitWaitlist }: PhoneInputProps) {
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Phone validation: 7-15 digits (including country code)
  const validatePhone = (phoneValue: string) => {
    // Remove all non-digit characters except +
    const cleaned = phoneValue.replace(/[^\d+]/g, '');
    // Check if starts with + and has 7-15 digits total
    if (cleaned.startsWith('+')) {
      const digits = cleaned.slice(1); // Remove the +
      return digits.length >= 7 && digits.length <= 15;
    }
    // If no +, check if it's 7-15 digits
    const digits = cleaned;
    return digits.length >= 7 && digits.length <= 15;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Only allow digits, +, spaces, and dashes
    value = value.replace(/[^\d+\s-]/g, '');
    // Ensure + is only at the start
    if (value.includes('+') && !value.startsWith('+')) {
      value = '+' + value.replace(/\+/g, '');
    }
    // Limit to one +
    if ((value.match(/\+/g) || []).length > 1) {
      value = '+' + value.replace(/\+/g, '');
    }
    setPhone(value);
    setIsValid(validatePhone(value));
  };

  const handleContinue = async () => {
    // Prevent duplicate submissions
    if (stepState === 'submitting' || stepState === 'success') {
      return;
    }

    if (isValid && email) {
      try {
        await submitWaitlist(email, phone);
      } catch (error) {
        console.error('Error submitting waitlist:', error);
      }
    }
  };

  if (stepState !== 'phone' && stepState !== 'submitting') {
    return null;
  }

  const isSubmitting = stepState === 'submitting';

  return (
    <div className="w-full" style={{ minHeight: '120px' }}>
      <input
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        placeholder="+1 234 567 8900"
        disabled={isSubmitting}
        className="w-full border-b-2 border-gray-300 pb-2 outline-none focus:border-purple-600 transition-colors placeholder:text-gray-400 px-0 text-center disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          minHeight: '44px',
          fontSize: '16px',
        }}
        inputMode="tel"
      />
      <button
        onClick={handleContinue}
        disabled={!isValid || isSubmitting}
        className="w-full bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-6 flex items-center justify-center gap-2"
        style={{
          minHeight: '44px',
          fontSize: '16px',
        }}
      >
        {isSubmitting && (
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {isSubmitting ? 'Joining...' : 'Join waitlist'}
      </button>
    </div>
  );
}
