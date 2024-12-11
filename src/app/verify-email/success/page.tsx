// src/app/verify-email/success/page.tsx
import Link from 'next/link';

export default function VerificationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="rounded-full bg-green-100 p-3 mx-auto w-16 h-16">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Email Verified Successfully!
        </h2>
        
        <p className="mt-2 text-sm text-gray-600">
          Thank you for verifying your email. You can now log in to your account.
        </p>

        <div className="mt-5">
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}