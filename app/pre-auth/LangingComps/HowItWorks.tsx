'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Dumbbell, Zap } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    title: "Input Your Goals",
    description: "Tell us about your fitness goals, experience level, and preferences."
  },
  {
    icon: Zap,
    title: "AI Generation",
    description: "Our AI analyzes your input and creates a personalized workout plan."
  },
  {
    icon: Dumbbell,
    title: "Start Working Out",
    description: "Follow your custom plan and track your progress as you achieve your goals."
  }
]

export default function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-white">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
          <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Getting started with RepUp is easy. Follow these simple steps to begin your AI-powered fitness journey.
          </p>
        </motion.div>
        <div className="grid gap-6 mt-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-4 bg-white rounded-full">
                <step.icon className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

