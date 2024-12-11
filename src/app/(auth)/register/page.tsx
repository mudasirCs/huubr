'use client'

import { useState } from 'react'
import BusinessRegistrationModal from '@/components/BusinessRegistrationModal'

export default function Home() {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">Huubr</h1>
          <button
            onClick={() => setShowRegistration(true)}
            className="bg-[#FF4D00] text-white px-4 py-2 rounded-lg"
          >
            List your Business
          </button>
        </header>

        {/* Reset key when modal closes to ensure fresh state */}
        <BusinessRegistrationModal 
          key={showRegistration ? 'open' : 'closed'}
          isOpen={showRegistration}
          onClose={() => setShowRegistration(false)}
        />
      </div>
    </div>
  )
}