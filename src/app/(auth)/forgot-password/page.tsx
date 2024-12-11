'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import InputField from '@/components/InputField'
import Button from '@/components/Button'
import Link from 'next/link'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to send reset instructions')
      }

      setEmailSent(true)
      toast.success('Password reset instructions have been sent to your email')
    } catch {
      toast.error('Failed to send reset instructions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (name: string, value: string) => {
    setValue(name as keyof ForgotPasswordFormData, value)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto w-12 h-12 text-green-500 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-gray-600">
              We&apos;ve sent password reset instructions to {getValues('email')}
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="text-primary hover:text-primary/90 font-medium"
              >
                Back to login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              required
              value={getValues('email')}
              onChange={handleFieldChange}
              error={errors.email?.message}
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
            >
              Send reset instructions
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:text-primary/90 font-medium"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}