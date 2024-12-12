// src/app/layout.tsx
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/providers/session-provider'
import './globals.css'

export const metadata = {
  title: 'Huubr - Business Directory',
  description: 'Your one-stop platform for local business directory management.',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Huubr',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Huubr'
      }
    ]
  }
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}