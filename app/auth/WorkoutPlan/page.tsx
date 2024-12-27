'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { supabase } from '@/utils/supabase/supabaseClient'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import { useRouter } from 'next/navigation'

export default function WorkoutPlanPage() {
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const userId = Cookies.get('uid')
        
        if (!userId) {
          setError('User ID not found. Please log in.')
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('users_workouts')
          .select('workout_plan')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error) {
          throw error
        }

        if (data) {
          setWorkoutPlan(data.workout_plan)
        } else {
          setError('No workout plan found.')
        }
      } catch (err) {
        console.error('Error fetching workout plan:', err)
        setError('Failed to fetch workout plan')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkoutPlan()
  }, [])

  const downloadPDF = () => {
    if (!workoutPlan) return
  
    const doc = new jsPDF()
    
    doc.setFont('helvetica')
    doc.setFontSize(12)
  
    doc.setFontSize(16)
    doc.text('RepUp Workout Plan', 105, 20, { align: 'center' })
  
    let yPosition = 30
    const lineHeight = 10
    const pageHeight = doc.internal.pageSize.height
    const marginBottom = 20
  
    const splitText = doc.splitTextToSize(workoutPlan, 180)
  
    splitText.forEach((line: string | string[]) => {
      if (yPosition + lineHeight > pageHeight - marginBottom) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(line, 15, yPosition)
      yPosition += lineHeight
    })
  
    doc.save('RepUp Workout Plan.pdf')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <motion.div
          className="text-2xl font-medium text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading your workout plan...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <motion.div
          className="text-red-500 text-2xl text-center font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => router.back()} 
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Your Workout Plan</h1>
            </div>
            <button 
              onClick={downloadPDF}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-900 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </header>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="prose max-w-none">
              <ReactMarkdown>{workoutPlan || ''}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
