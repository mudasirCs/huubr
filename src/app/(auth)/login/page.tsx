// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
// import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import InputField from '@/components/InputField'
import Button from '@/components/Button'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        window.location.href = '/dashboard'
      }
    } catch (error) {
        console.error('Login failed:', error);
        toast.error(
          error instanceof Error 
            ? error.message 
            : 'Login failed. Please try again.'
        );
      }  finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (name: string, value: string) => {
    setValue(name as keyof LoginFormData, value)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/90"
            >
              create a new account
            </Link>
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

            <InputField
              label="Password"
              name="password"
              type="password"
              required
              value={getValues('password')}
              onChange={handleFieldChange}
              error={errors.password?.message}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary hover:text-primary/90"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={loading}
          >
            Sign in
          </Button>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn('google')}
                className="w-full"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn('apple')}
                className="w-full"
              >
                <span className="sr-only">Sign in with Apple</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152,6.896c-0.948,0-2.415-1.078-3.96-1.04c-2.04,0.027-3.91,1.183-4.961,3.014c-2.117,3.675-0.546,9.103,1.519,12.087c1.013,1.454,2.208,3.09,3.792,3.039c1.52-0.065,2.09-0.987,3.935-0.987c1.831,0,2.35,0.987,3.96,0.948c1.637-0.026,2.676-1.48,3.676-2.948c1.156-1.688,1.636-3.325,1.662-3.415c-0.039-0.013-3.182-1.221-3.22-4.857c-0.026-3.04,2.48-4.494,2.597-4.559c-1.429-2.09-3.623-2.324-4.39-2.376C14.725,5.772,13.192,6.896,12.152,6.896z"/>
                </svg>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn('facebook')}
                className="w-full"
              >
                <span className="sr-only">Sign in with Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}