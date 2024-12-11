'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export default function StepIndicator({ 
  currentStep, 
  totalSteps, 
  labels = [] 
}: StepIndicatorProps) {
  // Add local state to handle the animation
  const [animatedStep, setAnimatedStep] = useState(1)

  useEffect(() => {
    // Update animated step after mount
    setAnimatedStep(currentStep)
  }, [currentStep])

  return (
    <div className="flex items-center justify-center w-full mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div className="relative">
            <motion.div
              key={`step-${index}-${animatedStep}`}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${animatedStep > index 
                  ? 'bg-[#A4C639] text-white' 
                  : animatedStep === index + 1
                  ? 'bg-[#A4C639] text-white' 
                  : 'bg-gray-200 text-gray-500'}
              `}
              initial={{ scale: 1 }}
              animate={{
                scale: animatedStep === index + 1 ? [1, 1.1, 1] : 1
              }}
              transition={{
                duration: 0.3
              }}
            >
              {index + 1}
            </motion.div>
            {labels[index] && (
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
                {labels[index]}
              </span>
            )}
          </div>
          {index < totalSteps - 1 && (
            <div className="w-16 h-1 mx-1">
              <div className="h-full bg-gray-200">
                <motion.div
                  key={`line-${index}-${animatedStep}`}
                  className="h-full bg-[#A4C639]"
                  initial={{ width: "0%" }}
                  animate={{
                    width: animatedStep > index + 1 ? "100%" : "0%"
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}