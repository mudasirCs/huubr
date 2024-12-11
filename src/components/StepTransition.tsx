'use client'

import { motion } from 'framer-motion'

interface StepTransitionProps {
  children: React.ReactNode
  direction?: 'forward' | 'backward'
}

export default function StepTransition({ 
  children, 
  direction = 'forward' 
}: StepTransitionProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: direction === 'forward' ? 50 : -50 
      }}
      animate={{ 
        opacity: 1, 
        x: 0 
      }}
      exit={{ 
        opacity: 0, 
        x: direction === 'forward' ? -50 : 50 
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      {children}
    </motion.div>
  )
}