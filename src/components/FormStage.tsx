'use client';

import { ReactNode, useEffect, useState } from 'react';
import type { Step } from '@/types/flow';

type FormStageProps = {
  step: Step;
  emailStep: ReactNode;
  phoneStep: ReactNode;
  height?: string;
};

export default function FormStage({ step, emailStep, phoneStep, height = '200px' }: FormStageProps) {
  const [mounted, setMounted] = useState(false);
  const [displayedStep, setDisplayedStep] = useState<Step>(step);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (step !== displayedStep && !isAnimating) {
      setIsAnimating(true);
      
      // After animation completes (260ms), update displayed step
      const timer = setTimeout(() => {
        setDisplayedStep(step);
        setIsAnimating(false);
      }, 260);

      return () => clearTimeout(timer);
    }
  }, [step, displayedStep, isAnimating, mounted]);

  // Before mounted: render only active step with no animation
  if (!mounted) {
    return (
      <div
        className="relative"
        style={{
          height: height,
        }}
      >
        {step === 'email' && (
          <div className="absolute inset-0 w-full">
            {emailStep}
          </div>
        )}
        {step === 'phone' && (
          <div className="absolute inset-0 w-full">
            {phoneStep}
          </div>
        )}
      </div>
    );
  }

  // After mounted: enable transition behavior
  const showEmail = displayedStep === 'email' || (step === 'email' && isAnimating);
  const showPhone = displayedStep === 'phone' || (step === 'phone' && isAnimating);

  return (
    <div
      className="relative"
      style={{
        height: height,
      }}
    >
      {showEmail && (
        <div
          className="absolute inset-0 w-full"
          style={{
            transform: step === 'phone' && isAnimating ? 'translateY(-24px)' : 'translateY(0)',
            opacity: step === 'phone' && isAnimating ? 0 : 1,
            transition: 'transform 260ms ease-out, opacity 260ms ease-out',
          }}
        >
          {emailStep}
        </div>
      )}
      {showPhone && (
        <div
          className="absolute inset-0 w-full"
          style={{
            transform: step === 'phone' && !isAnimating ? 'translateY(0)' : 'translateY(24px)',
            opacity: step === 'phone' && !isAnimating ? 1 : 0,
            transition: 'transform 260ms ease-out, opacity 260ms ease-out',
          }}
        >
          {phoneStep}
        </div>
      )}
    </div>
  );
}
