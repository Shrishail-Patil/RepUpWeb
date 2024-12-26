'use client'

import { motion } from 'framer-motion'

export const AnimatedPlate = ({ size = 100, delay = 0 }) => {
  return (
    <motion.div
      className="absolute"
      animate={{
        y: [0, -30, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div 
        className="rounded-full border-8 border-purple-300/20"
        style={{
          width: size,
          height: size,
        }}
      />
    </motion.div>
  )
}

