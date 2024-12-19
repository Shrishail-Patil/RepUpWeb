'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Dumbbell, ClipboardList, User, Calendar, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { getUserInfo } from '@/utils/supabase/supabase'
import type { UserInfo } from '@/types/user'
import { cookies } from 'next/headers'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

interface HomePageProps {
  userId: string
}

interface InfoCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

function InfoCard({ title, value, icon }: InfoCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

export default function HomePage({ userId }: HomePageProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserInfo() {
      try {
      } catch (error) {
        console.error('Error loading user info:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserInfo()
  }, [userId])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="header flex-1 pr-4 py-6">
        <div className="logout justify-self-end">
          <button className="text-sm font-medium text-slate-200" onClick={()=>{Cookies.remove("uid")
            Cookies.remove("uname")
            router.replace("/")
          }}>
            Logout
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-4">Welcome, {Cookies.get("uname")}</h1>
          <p className="text-xl text-slate-300 mb-12">Ready to crush your fitness goals today?</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <InfoCard
            title="Last Workout"
            value={userInfo?.lastWorkout || 'N/A'}
            icon={<Calendar className="h-6 w-6 text-blue-400" />}
          />
          <InfoCard
            title="Total Workouts"
            value={userInfo?.totalWorkouts.toString() || '0'}
            icon={<Dumbbell className="h-6 w-6 text-green-400" />}
          />
          <InfoCard
            title="Fitness Goal"
            value={userInfo?.fitnessGoal || 'Not set'}
            icon={<Target className="h-6 w-6 text-purple-400" />}
          />
          <InfoCard
            title="Profile"
            value="View Details"
            icon={<User className="h-6 w-6 text-yellow-400" />}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/auth/WorkoutPlan">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              <Dumbbell className="mr-2 h-5 w-5" /> Workout Plan
            </Button>
          </Link>
          <Link href="/workout-track">
            <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              <ClipboardList className="mr-2 h-5 w-5" /> Workout Track
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

