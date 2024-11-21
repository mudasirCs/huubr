import './globals.css'
import type { Metadata } from 'next'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}