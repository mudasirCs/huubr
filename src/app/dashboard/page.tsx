'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRedirectUrl } from '@/lib/auth-utils'

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.role) {
      const redirectUrl = getRedirectUrl(session.user.role)
      if (redirectUrl !== '/dashboard') {
        router.replace(redirectUrl)
      }
    }
  }, [session, router])

  if (!session) {
    return null // Or loading state
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Welcome, {session.user.name}</p>
        <p>Role: {session.user.role}</p>
      </div>
    </div>
  )
}
