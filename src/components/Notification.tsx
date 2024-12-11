'use client'

import { useEffect, useState } from 'react'

interface NotificationProps {
  message: string
  type: 'success' | 'error'
  duration?: number
  onClose: () => void
}

export default function Notification({ 
  message, 
  type, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const baseClasses = `
    fixed top-4 right-4 max-w-sm w-full 
    p-4 rounded-lg shadow-lg 
    transform transition-all duration-300
    ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
  `

  const typeClasses = {
    success: 'bg-[#A4C639] text-white',
    error: 'bg-red-500 text-white',
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">{message}</div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  )
}