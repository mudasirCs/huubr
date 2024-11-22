import './globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/providers/session-provider'

export const metadata: Metadata = {
  title: 'Huubr Business Directory',
  description: 'Local business directory and community platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}