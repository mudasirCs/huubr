import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import { getRedirectUrl } from '@/lib/auth-utils'

interface SocialLoginButtonsProps {
  callbackUrl?: string
}

export function SocialLoginButtons({ callbackUrl = '/dashboard' }: SocialLoginButtonsProps) {
  const router = useRouter()

  const handleSocialLogin = async (provider: string) => {
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl
      })
    
      if (result?.error) {
        if (result.error === 'AccessDenied') {
          toast.error('Please allow access to your email address')
        } else {
          toast.error(result.error)
        }
        return
      }
      
      
      if (result?.ok) {
        // Wait a bit for the session to be available
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const session = await getSession()
        if (session?.user) {
          const redirectUrl = getRedirectUrl(session.user.role)
          router.push(redirectUrl)
          router.refresh()
          toast.success('Signed in successfully!')
        }
      }
    } catch (error) {
      console.error('Social login error:', error)
      toast.error('Failed to sign in with social provider')
    }
  }
  
  return (
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
          onClick={() => handleSocialLogin('google')}
          className="w-full flex items-center justify-center"
        >
          <span className="sr-only">Sign in with Google</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('facebook')}
          className="w-full flex items-center justify-center"
        >
          <span className="sr-only">Sign in with Facebook</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </Button>
      </div>
    </div>
  )
}