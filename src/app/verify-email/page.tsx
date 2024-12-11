// src/app/verify-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // console.log('Starting verification process');
        // console.log('Token to verify:', token);

        if (!token) {
          throw new Error('No verification token provided');
        }

        const response = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        const data = await response.json();
        // console.log('Server response:', { status: response.status, data });

        if (!response.ok) {
          throw new Error(data.error || data.details || 'Verification failed');
        }

        setStatus('success');
        toast.success('Email verified successfully!');

        // Redirect to login after success
        setTimeout(() => {
          router.push('/login');
        }, 2000);

      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setErrorMessage(
          error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred'
        );
        toast.error('Failed to verify email');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {status === 'loading' && (
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifying your email...
            </h2>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email has been verified successfully. Redirecting to login...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {errorMessage}
            </p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}