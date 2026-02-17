'use client';

import { useRef } from 'react';

type PhoneStepProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

export default function PhoneStep({ value, onChange, onSubmit, isSubmitting = false }: PhoneStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Validate phone: 7-15 digits (allow + and spaces)
  const validatePhone = (phoneValue: string) => {
    const cleaned = phoneValue.replace(/[\s-]/g, '');
    const phoneDigits = cleaned.startsWith('+') 
      ? cleaned.slice(1).replace(/\D/g, '')
      : cleaned.replace(/\D/g, '');
    
    return phoneDigits.length >= 7 && phoneDigits.length <= 15;
  };

  const isValid = validatePhone(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    // Only allow digits, +, spaces, and dashes
    newValue = newValue.replace(/[^\d+\s-]/g, '');
    // Ensure + is only at the start
    if (newValue.includes('+') && !newValue.startsWith('+')) {
      newValue = '+' + newValue.replace(/\+/g, '');
    }
    // Limit to one +
    if ((newValue.match(/\+/g) || []).length > 1) {
      newValue = '+' + newValue.replace(/\+/g, '');
    }
    onChange(newValue);
  };

  const handleSubmit = () => {
    if (isValid && !isSubmitting) {
      // Blur input immediately on submit
      inputRef.current?.blur();
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full" style={{ minHeight: '120px' }}>
      <input
        ref={inputRef}
        type="tel"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="+1 234 567 8900"
        disabled={isSubmitting}
        className="w-full outline-none transition-all placeholder:text-gray-400 px-0 text-center border-0 focus:border-2 focus:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          height: '56px',
          fontSize: '16px',
          borderRadius: '16px',
        }}
        inputMode="tel"
      />
      <button
        onClick={handleSubmit}
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
