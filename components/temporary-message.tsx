import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function TemporaryMessage() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 max-w-lg mx-4 relative z-10"
          >
            <h2 className="text-2xl font-bold mb-4 text-gradient">Welcome to RepUp v1.0</h2>
            <p className="text-gray-700 mb-4">
              This is the initial version of our website. We're working on adding a feedback form
              where you can share your thoughts and suggest new features. For now, enjoy the basic
              but fully functional app!
            </p>
            <p className="text-sm text-gray-500">
              This message will disappear in a few seconds.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
