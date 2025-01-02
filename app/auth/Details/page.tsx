'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2, Save } from 'lucide-react'
import { supabase } from '@/utils/supabase/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'

interface UserFitnessDetails {
  gender: string
  age: number
  height: number
  weight: number
  active_days: number
  has_equipment: boolean
  goal: string
  goal_weight: number
  injuries: string
  fitness_level: string
  workout_split: string
}

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState<UserFitnessDetails | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const fetchUserDetails = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      const userId = sessionData?.session?.user?.id
      if (!userId) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('user_fitness_details')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error

      setUserDetails(data)
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch user details. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setUserDetails(prev => ({
      ...prev!,
      [name]: type === 'number' ? parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setUserDetails(prev => ({
      ...prev!,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setUserDetails(prev => ({
      ...prev!,
      [name]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      const userId = sessionData?.session?.user?.id
      if (!userId) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('user_fitness_details')
        .update(userDetails!)
        .eq('user_id', userId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user details:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <motion.div
          className="text-2xl font-medium text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading your profile...
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
              <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-900 transition-colors"
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" onClick={handleSubmit}/> : <Edit2 className="h-4 w-4 mr-2" />}
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </header>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    disabled={!isEditing}
                    value={userDetails?.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={userDetails?.age}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={userDetails?.height}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={userDetails?.weight}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="active_days">Active Days per Week</Label>
                  <Input
                    id="active_days"
                    name="active_days"
                    type="number"
                    value={userDetails?.active_days}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="has_equipment" className='px-5'>Has Equipment</Label>
                  <Switch
                    id="has_equipment"
                    checked={userDetails?.has_equipment}
                    onCheckedChange={(checked) => handleSwitchChange('has_equipment', checked)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="goal">Fitness Goal</Label>
                  <Select
                    disabled={!isEditing}
                    value={userDetails?.goal}
                    onValueChange={(value) => handleSelectChange('goal', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="goal_weight">Goal Weight (kg)</Label>
                  <Input
                    id="goal_weight"
                    name="goal_weight"
                    type="number"
                    value={userDetails?.goal_weight}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="injuries">Injuries</Label>
                  <Input
                    id="injuries"
                    name="injuries"
                    value={userDetails?.injuries}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="fitness_level">Fitness Level</Label>
                  <Select
                    disabled={!isEditing}
                    value={userDetails?.fitness_level}
                    onValueChange={(value) => handleSelectChange('fitness_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fitness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workout_split">Workout Split</Label>
                  <Select
                    disabled={!isEditing}
                    value={userDetails?.workout_split}
                    onValueChange={(value) => handleSelectChange('workout_split', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select workout split" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_body">Full Body</SelectItem>
                      <SelectItem value="upper_lower">Upper/Lower</SelectItem>
                      <SelectItem value="push_pull_legs">Push/Pull/Legs</SelectItem>
                      <SelectItem value="bro_split">Bro Split</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {isEditing && (
                <Button type="submit" className="mt-6 w-full">
                  Save Changes
                </Button>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

