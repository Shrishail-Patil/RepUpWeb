'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type SquiggleButtonProps = Omit<HTMLMotionProps<"button">, "ref" | "children"> & {
  variant?: 'default' | 'outline'
  children: ReactNode
}

export const SquiggleButton = ({ 
  variant = 'default', 
  children, 
  className,
  ...props 
}: SquiggleButtonProps) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className={cn(
        "relative px-6 py-3 rounded-full text-sm font-medium transition-all",
        variant === 'default' 
          ? "bg-black text-white hover:bg-gray-900" 
          : "border border-black/20 bg-white/50 text-black hover:bg-white/80",
        className
      )}
      {...props}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        whileHover={{
          opacity: [0, 1, 0],
          transition: {
            duration: 1,
            repeat: Infinity,
          },
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 0,50 C 20,40 30,60 50,50 C 70,40 80,60 100,50"
            stroke={variant === 'default' ? '#fff' : '#000'}
            strokeOpacity={0.2}
            strokeWidth={1}
            fill="none"
            initial={{
              pathLength: 0,
            }}
            animate={{
              pathLength: 1,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </svg>
      </motion.div>
      {children}
    </motion.button>
  )
}