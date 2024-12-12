'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/Button'
import Link from 'next/link'
import { getRedirectUrl } from '@/lib/auth-utils'
import { AuthInput } from '@/components/auth/AuthInput'
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
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
        return
      }
  
      const response = await fetch('/api/auth/session')
      const session = await response.json()
  
      toast.success('Logged in successfully!')
      
      const redirectUrl = getRedirectUrl(session?.user?.role)
      router.push(redirectUrl)
      router.refresh()
  
    } catch (error) {
      console.error('Login failed:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
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
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              register={register}
              error={errors.email?.message}
              placeholder="your.email@example.com"
              autoComplete="email"
            />

            <AuthInput
              id="password"
              label="Password"
              type="password"
              register={register}
              error={errors.password?.message}
              placeholder="Enter your password"
              autoComplete="current-password"
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
        </form>

        <SocialLoginButtons />
      </div>
    </div>
  )
}