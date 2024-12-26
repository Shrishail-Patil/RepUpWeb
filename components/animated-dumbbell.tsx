'use client'

import { motion } from 'framer-motion'
import { Dumbbell } from 'lucide-react'

export const AnimatedDumbbell = () => {
  return (
    <motion.div
      className="absolute"
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Dumbbell className="w-20 h-20 text-purple-300/20" />
    </motion.div>
  )
}

