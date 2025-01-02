'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Dumbbell, ClipboardList, User, Calendar, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SquiggleButton } from '@/components/squiggle-button'
import type { UserInfo } from '@/types/user'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/supabaseClient'
import { AnimatedDumbbell } from '@/components/animated-dumbbell'
import { AnimatedPlate } from '@/components/animated-plate'

interface InfoCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

function InfoCard({ title, value, icon }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-800">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function HomePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastDate, setLastDate] = useState(null)
  const [goal, setGoal] = useState()
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0)  // For total workout count

  const router = useRouter()
  
  // Utility function to format date as dd-mm-yyyy
  const formatDate = (date: string | null): string => {
  if (!date) return 'N/A'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

  useEffect(() => {
    async function loadUserInfo() {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const session = sessionData?.session
        if (session) {
          const user = session.user
          const {data:userProfile, error:userProfileError} = await supabase.from('user_fitness_details').select('goal').eq('user_id', user.id).single()
          setGoal(userProfile?.goal)
          const { data: workoutData, error: workoutError } = await supabase
          .from('workout_sessions')
          .select('date')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(1)
          .single();
          setLastDate(workoutData?.date)

          // Fetch the total number of workouts
          const { count, error: countError } = await supabase
            .from('workout_sessions')
            .select('workout_id', { count: 'exact' })
            .eq('user_id', user.id)

          if (countError) throw new Error(countError.message)

          setTotalWorkouts(count || 0)
          // Fetch user info if session exists (mocked data for now)
          // setUserInfo({
          //   lastWorkout: '2024-12-20', // Replace with actual data fetch
          //   totalWorkouts: 10, // Replace with actual data fetch
          //   fitnessGoal: 'Build Muscle', // Replace with actual data fetch
          // })
        } else {
          // Clear state and redirect to login if no session
          setUserInfo(null)
          router.replace('/')
        }
      } catch (error) {
        console.error('Error loading user info:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUserInfo()
  }, [router])

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error('Error signing out: ' + error.message)

      // Clear all cookies
      const allCookies = Cookies.get()
      Object.keys(allCookies).forEach(cookieName => {
        Cookies.remove(cookieName)
      })

      // Clear user info from state
      setUserInfo(null)

      // Force a hard reload to clear cached session
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-2xl"
        >
          Loading...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AnimatedDumbbell />
        <div className="absolute top-1/4 right-1/4">
          <AnimatedDumbbell />
        </div>
        <div className="absolute bottom-1/4 left-1/3">
          <AnimatedPlate size={80} />
        </div>
        <div className="absolute top-1/3 right-1/3">
          <AnimatedPlate size={120} delay={2} />
        </div>
      </div>

      <header className="flex justify-end items-center py-6 px-4 relative z-10">
        <SquiggleButton onClick={handleLogout}>Logout</SquiggleButton>
      </header>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold pb-6 text-gradient">
            Welcome, {Cookies.get('uname')}
          </h1>
          <p className="text-xl text-gradient mb-12">
            Ready to crush your fitness goals today?
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <InfoCard
            title="Last Workout"
            // value={userInfo?.lastWorkout || 'N/A'}
            value={formatDate(lastDate) || 'N/A'}
            icon={<Calendar className="h-6 w-6 text-blue-400" />}
          />
          <InfoCard
            title="Total Workouts"
            // value={userInfo?.totalWorkouts?.toString() || '0'}
            value={totalWorkouts.toString()|| '0'}
            icon={<Dumbbell className="h-6 w-6 text-green-400" />}
          />
          <InfoCard
            title="Fitness Goal"
            value={goal || 'Not set'}
            icon={<Target className="h-6 w-6 text-purple-400" />}
          />
          <Link href={"/auth/Details"}>
          <InfoCard
            title="Profile"
            value="View Details"
            icon={<User className="h-6 w-6 text-yellow-400" />}
          />
          </Link>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/auth/WorkoutPlan">
            <SquiggleButton className="w-full sm:w-auto">
              <Dumbbell className="mr-2 h-5 w-5" /> Workout Plan
            </SquiggleButton>
          </Link>
          <Link href="/auth/WorkoutTrack">
            <SquiggleButton className="w-full sm:w-auto">
              <ClipboardList className="mr-2 h-5 w-5" /> Workout Track
            </SquiggleButton>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}