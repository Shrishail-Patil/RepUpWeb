'use client'

import { motion } from 'framer-motion';
import { AnimatedDumbbell } from '@/components/animated-dumbbell';
import { AnimatedPlate } from '@/components/animated-plate';
import { SquiggleButton } from '@/components/squiggle-button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { supabase } from '@/utils/supabase/client';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
      checkLogin();
    },[router]);
    const checkLogin = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) throw error;
  
      const session = sessionData?.session;
      if (session) {
        router.replace('/auth/Dashboard');
      }
    }
  return (
    <div className="min-h-screen">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AnimatedDumbbell />
        <div className="absolute top-1/4 right-1/4">
          <AnimatedDumbbell />
        </div>
        <div className="absolute bottom-1/4 left-1/3">
          <AnimatedDumbbell />
        </div>
        <div className="absolute top-1/3 right-1/3">
          <AnimatedPlate size={80} />
        </div>
        <div className="absolute bottom-1/3 right-1/4">
          <AnimatedPlate size={120} delay={2} />
        </div>
        <div className="absolute top-1/2 left-1/4">
          <AnimatedPlate size={60} delay={4} />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold text-black"
        >
          RepUp
        </motion.div>
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex items-center space-x-8"
        >
          <a href="#features" className="text-sm text-gray-600 hover:text-black transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-gray-600 hover:text-black transition-colors">
            How it Works
          </a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-black transition-colors">
            Pricing
          </a>
          <SquiggleButton>
            Sign In
          </SquiggleButton>
        </motion.nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wider"
          >
            Welcome to the Future of Fitness
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-4xl pb-3 md:text-6xl lg:text-7xl font-bold mb-6 text-gradient tracking-tight"
          >
            Transform your
            <br />
            fitness journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Get personalized AI workout plans that adapt to your progress, 
            equipment, and fitness goals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <SquiggleButton onClick={() => router.push('/pre-auth/Login')}>
              Get started free
            </SquiggleButton>
            <SquiggleButton variant="outline">
              Watch demo
            </SquiggleButton>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Intelligent Fitness Planning
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI understands your body, goals, and limitations to create the perfect workout plan.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Personalized Plans",
              description: "Get workout plans tailored to your specific goals and fitness level."
            },
            {
              title: "Progress Tracking",
              description: "Monitor your improvements and adjust your plan automatically."
            },
            {
              title: "Smart Adaptation",
              description: "Plans that evolve as you grow stronger and more capable."
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-3 text-black">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Ready to Transform?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already achieved their fitness goals with RepUp.
          </p>
          <SquiggleButton>
            Start your journey
          </SquiggleButton>
        </motion.div>
      </section>
    </div>
  )
}

