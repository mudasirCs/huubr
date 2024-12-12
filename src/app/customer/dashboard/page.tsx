'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CustomerDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session?.user || session.user.role !== 'CUSTOMER') {
    router.replace('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Welcome, {session.user.name}</p>
        <p>Role: {session.user.role}</p>
      </div>
    </div>
  )
}