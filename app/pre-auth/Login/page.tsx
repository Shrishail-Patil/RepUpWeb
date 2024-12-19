'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/utils/supabase/supabaseClient'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/Profile`, // Redirect after login
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      // Wait for session data
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData?.session

      if (session) {
        const { user } = session
        const { email, user_metadata } = user
        const name = user_metadata?.name || 'Unknown User'

        // Insert user data into the 'users' table
        const { error: insertError } = await supabase.from('users').insert({
          uid: user.id, // Ensure unique ID
          Username:name,
          Email:email,
        })

        if (insertError) {
          console.error('Error inserting user:', insertError.message)
        } else {
          console.log('User inserted/updated successfully.')
        }

        // Set cookies
        Cookies.set('uid', user.id, { expires: 7 }) // UID cookie
        Cookies.set('uname', name, { expires: 7 }) // User name cookie

        // Redirect to the profile page
        router.push('/auth/WorkoutPlan')
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login error:', error.message)
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