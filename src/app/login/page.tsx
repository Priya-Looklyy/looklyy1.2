'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      {/* Login Panel */}
      <div className="bg-white rounded-3xl shadow-xl p-12 w-full max-w-md">
        {/* Looklyy Logo - Centered between button and bottom */}
        <div className="flex flex-col items-center justify-between h-full min-h-[400px]">
          {/* Top spacing */}
          <div></div>
          
          {/* Login Button */}
          <button className="w-full bg-white border-2 border-gray-200 rounded-full py-4 px-6 shadow-md hover:shadow-lg transition-shadow">
            <span className="text-gray-900 font-normal text-sm">
              Login with Instagram
            </span>
          </button>

          {/* Looklyy Logo - Centered between button and bottom */}
          <div className="flex-1 flex items-center justify-center py-8">
            <h1 className="text-purple-600 font-bold text-3xl tracking-tight">
              LOOKLYY
            </h1>
          </div>

          {/* Terms and Privacy */}
          <p className="text-gray-400 text-xs text-center mt-4">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-gray-600 hover:text-gray-800 underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-gray-600 hover:text-gray-800 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
