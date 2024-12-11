'use client'

import { useState } from 'react'
import Button from '@/components/Button'
import Link from 'next/link'
import BusinessRegistrationModal from '@/components/BusinessRegistrationModal'

export default function Home() {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative pt-6 pb-16 sm:pb-24">
          <header className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Huubr</h2>
            <button
              onClick={() => setShowRegistration(true)}
              className="bg-[#FF4D00] text-white px-4 py-2 rounded-lg hover:bg-[#E64500] transition-colors"
            >
              List your Business
            </button>
          </header>

          <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Welcome to </span>
                <span className="block text-primary xl:inline">Huubr</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Your one-stop platform for local business directory management.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link href="/login">
                    <Button className="w-full flex items-center justify-center px-8 py-3">
                      Get Started
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link href="/register">
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3">
                      Register Business
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <BusinessRegistrationModal 
        key={showRegistration ? 'modal-open' : 'modal-closed'}
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
      />
    </div>
  )
}