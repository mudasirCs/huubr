'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'AccessDenied':
        return 'Please allow access to your email address to continue'
      case 'Configuration':
        return 'There is a problem with the server configuration'
      case 'Callback':
        return 'Failed to complete sign in with Facebook'
      default:
        return 'An error occurred during authentication'
    }
  }

  return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error ? getErrorMessage(error) : 'An error occurred during authentication.'}
          </p>
          <div className="mt-4 text-center">
            <Link 
              href="/login"
              className="text-primary hover:text-primary-dark"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}