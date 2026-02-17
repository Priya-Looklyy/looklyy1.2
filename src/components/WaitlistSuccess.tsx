'use client';

type WaitlistSuccessProps = {
  stepState: 'email' | 'phone' | 'submitting' | 'success';
};

export default function WaitlistSuccess({ stepState }: WaitlistSuccessProps) {
  if (stepState !== 'success') {
    return null;
  }

  return (
    <div className="w-full text-center">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-light text-gray-900 mb-3">
        You&apos;re on the list!
      </h3>
      <p className="text-base text-gray-600 leading-relaxed">
        Thank you for joining. We&apos;ll be in touch soon.
      </p>
    </div>
  );
}
