'use client';

import { useEffect, useState } from 'react';

export default function SuccessStep() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay appearance 200ms after submit
    const timer = setTimeout(() => {
      setShow(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex items-center justify-center" style={{ minHeight: '120px' }}>
      <p
        className="text-center text-xl font-medium"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
        }}
      >
        You&apos;re on the list.
      </p>
    </div>
  );
}
