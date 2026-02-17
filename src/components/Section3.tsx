'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import EmailStep from './EmailStep';
import PhoneStep from './PhoneStep';
import SuccessStep from './SuccessStep';
import { register } from '@/lib/register';
import type { Step } from '@/types/flow';

export default function Section3() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const joinedWaitlist = localStorage.getItem('joined_waitlist');
      if (joinedWaitlist === 'true') {
        setStep('success');
      }
    }
  }, []);

  const handleImageError = (key: string) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  const handleEmailContinue = () => {
    setStep('phone');
  };

  const handlePhoneSubmit = async () => {
    if (step === 'submitting' || step === 'success') return;
    
    setStep('submitting');

    const startTime = Date.now();
    const minDuration = 600;

    try {
      const [success] = await Promise.all([
        register(email, phone),
        new Promise(resolve => setTimeout(resolve, minDuration)),
      ]);
      
      if (success) {
        // Ensure minimum duration
        const elapsed = Date.now() - startTime;
        if (elapsed < minDuration) {
          await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
        }
        setStep('success');
        if (typeof window !== 'undefined') {
          localStorage.setItem('joined_waitlist', 'true');
        }
      } else {
        setStep('phone');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setStep('phone');
    }
  };

  return (
    <section className="w-full relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="relative w-full flex-1">
        {!imageErrors.background ? (
          <Image
            src="/assets/frames/Section3_BackgroundPNG.png"
            alt="Section 3 Background"
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
            priority
            onError={() => handleImageError('background')}
          />
        ) : (
          <div className="w-full h-[800px] bg-orange-100" />
        )}
        
        {/* Bottom Panel */}
        {!imageErrors.bottomPanel && (
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <Image
              src="/assets/frames/Section3_BottompanelPNG.png"
              alt="Section 3 Bottom Panel"
              width={1200}
              height={300}
              className="w-full h-auto"
              onError={() => handleImageError('bottomPanel')}
            />
          </div>
        )}
        
        {/* Bottom Text */}
        {!imageErrors.bottomText && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <Image
              src="/assets/frames/Section3_BottomtextPNG.png"
              alt="Section 3 Bottom Text"
              width={800}
              height={100}
              className="w-auto h-auto max-w-[90vw]"
              onError={() => handleImageError('bottomText')}
            />
          </div>
        )}
        
        {/* Interactive Form Overlay - Positioned in orange section */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 sm:px-8 z-30">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl">
            {step === 'email' && (
              <EmailStep
                value={email}
                onChange={setEmail}
                onContinue={handleEmailContinue}
              />
            )}
            {(step === 'phone' || step === 'submitting') && (
              <PhoneStep
                value={phone}
                onChange={setPhone}
                onSubmit={handlePhoneSubmit}
                isSubmitting={step === 'submitting'}
              />
            )}
            {step === 'success' && (
              <SuccessStep />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
