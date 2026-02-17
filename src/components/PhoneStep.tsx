'use client';

import { useRef } from 'react';

type PhoneStepProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function PhoneStep({ value, onChange, onSubmit }: PhoneStepProps) {
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
    if (isValid) {
      // Blur input immediately on submit
      inputRef.current?.blur();
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="tel"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="+1 234 567 8900"
        className="w-full outline-none transition-all placeholder:text-gray-400 px-0 text-center border-0 focus:border-2 focus:border-purple-600"
        style={{
          height: '56px',
          fontSize: '16px',
          borderRadius: '16px',
        }}
        inputMode="tel"
      />
      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-6"
        style={{
          minHeight: '44px',
          fontSize: '16px',
        }}
      >
        Join waitlist
      </button>
    </div>
  );
}
