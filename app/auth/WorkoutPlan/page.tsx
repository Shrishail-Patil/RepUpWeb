'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { supabase } from '@/utils/supabase/supabaseClient'
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import jsPDF from 'jspdf'
import { useRouter } from 'next/navigation'

export default function WorkoutPlanPage() {
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

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
    if (!workoutPlan) return;
  
    const doc = new jsPDF();
  
    // Set font and size
    doc.setFont('helvetica');
    doc.setFontSize(12);
  
    // Title
    doc.setFontSize(16);
    doc.text('RepUp Workout Plan', 105, 20, { align: 'center' });
  
    // Define variables for positioning
    let yPosition = 30; // Start below the title
    const lineHeight = 10; // Line height
    const pageHeight = doc.internal.pageSize.height; // Height of the PDF page
    const marginBottom = 20; // Bottom margin
  
    // Split the markdown text into lines that fit the PDF width
    const splitText = doc.splitTextToSize(workoutPlan, 180);
  
    // Loop through lines and handle page breaks
    splitText.forEach((line: string | string[]) => {
      if (yPosition + lineHeight > pageHeight - marginBottom) {
        // If content exceeds the current page, add a new page
        doc.addPage();
        yPosition = 20; // Reset yPosition for new page
      }
      doc.text(line, 15, yPosition);
      yPosition += lineHeight; // Move to the next line
    });
  
    // Save the PDF
    doc.save('RepUp Workout Plan.pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <motion.div
          className="text-white text-2xl"
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <motion.div
          className="text-red-500 text-2xl text-center"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <motion.div 
        className="container mx-auto px-4 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
        {/* Back Arrow */}
        <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-300 hover:text-white"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className="text-4xl font-bold">Your Workout Plan</h1>
          <Button 
            onClick={downloadPDF}
            className="bg-white text-gray-900 hover:bg-gray-200"
          >
            Download PDF
          </Button>
        </div>
        <div className="bg-gray-800 rounded-lg p-8 prose prose-invert max-w-none">
          <ReactMarkdown>{workoutPlan || ''}</ReactMarkdown>
        </div>
      </motion.div>
    </div>
  )
}

