'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/utils/supabase/supabaseClient'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Set the UID cookie on successful sign-in
          Cookies.set('uid', session.user.id, { expires: 7 }) // Cookie expires in 7 days
          router.push('/auth/Profile') // Redirect to the profile page
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/Profile`, // Redirect to profile page after login
        },
      })
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div 
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to RepUp</h2>
        <motion.button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-gray-900 text-white rounded-full py-3 font-semibold transition duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Loading...' : 'Sign in with Google'}
        </motion.button>
      </motion.div>
    </div>
  )
}
