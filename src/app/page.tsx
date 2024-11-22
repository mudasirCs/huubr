'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="w-[120px] h-[40px] relative">
                <div className="text-xl font-bold text-[#333]">Huubr</div>
              </div>
              <div className="hidden md:flex space-x-6">
                <Link href="#" className="text-[#333] font-medium hover:text-[#FF4D00]">For Businesses</Link>
                <Link href="#" className="text-[#333] font-medium hover:text-[#FF4D00]">Business Hub</Link>
                <Link href="#" className="text-[#333] font-medium hover:text-[#FF4D00]">How it Works</Link>
                <Link href="#" className="text-[#333] font-medium hover:text-[#FF4D00]">About Us</Link>
                <Link href="#" className="text-[#333] font-medium hover:text-[#FF4D00]">Features</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-[#333] font-medium hover:text-[#FF4D00]">PRICING</Link>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 text-[#333] font-medium rounded px-3 py-1">
                  <option>Select Language</option>
                  <option>English</option>
                  <option>Irish</option>
                </select>
              </div>
              <button className="text-[#333] font-medium hover:text-[#FF4D00]">FONT SIZE</button>
              <Link href="/login" className="text-[#333] font-medium hover:text-[#FF4D00]">LOGIN</Link>
              <button 
                onClick={() => setShowSignup(true)}
                className="bg-[#FF4D00] text-white font-medium px-4 py-2 rounded hover:bg-[#E64500] transition-colors"
              >
                List your Business
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl font-bold text-[#333] mb-4">Local Businesses at your Fingertips</h1>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="I'm looking for..."
                className="flex-1 p-3 border border-gray-300 rounded-lg text-[#333] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A4C639] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-[#A4C639] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#93B233] transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sign Up Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#333]">Business Owner Information</h2>
              <button 
                onClick={() => setShowSignup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-6">
              <div>
                <label className="block text-[#333] font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg text-[#333] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A4C639] focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-[#333] font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg text-[#333] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A4C639] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-[#333] font-medium mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg text-[#333] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A4C639] focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              
              <div>
                <label className="block text-[#333] font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg text-[#333] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A4C639] focus:border-transparent"
                  placeholder="Confirm password"
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowSignup(false)}
                  className="text-[#333] font-medium hover:text-[#FF4D00]"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-[#A4C639] text-white font-medium px-8 py-2 rounded-lg hover:bg-[#93B233] transition-colors"
                >
                  Next →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}