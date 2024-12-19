'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Target } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "AI-Powered Plans",
    description: "Our advanced AI creates personalized workout plans tailored to your goals and fitness level."
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Get your custom workout plan in seconds, allowing you to start your fitness journey immediately."
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    description: "Whether you're aiming to build muscle, lose weight, or improve endurance, RepUp has you covered."
  }
]

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">Features</h2>
          <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover how RepUp revolutionizes your workout routine with cutting-edge AI technology.
          </p>
        </motion.div>
        <div className="grid gap-6 mt-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-4 bg-gray-900 rounded-full">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

