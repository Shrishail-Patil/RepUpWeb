'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation'


export default function ProfilePage() {

  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
    activeDays: '',
    hasEquipment: false,
    goal: '',
    goalWeight: '',
    injuries: '',
    fitnessLevel: '',
    workoutSplit: ''
  })
  const router = useRouter();
  const [prompt, setPrompt] = useState('')
  const [workoutPlan, setWorkoutPlan] = useState('');

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: any) => {
    setFormData(prev => ({ ...prev, hasEquipment: checked }))
  }

  const generatePrompt = async () => {
    const promptText = `Generate a personalized 90-day workout plan based on my profile:
  
  I am a ${formData.age} year old ${formData.gender}, ${formData.height}cm tall, weighing ${formData.weight}kg. I have ${formData.hasEquipment ? "access to a fully equipped gym" : "no gym equipment"}. I can work out ${formData.activeDays} days per week. My goal is ${formData.goal} with a target weight of ${formData.goalWeight}kg. My fitness level is ${formData.fitnessLevel}. ${
      formData.injuries ? `I have the following medical conditions/injuries to consider: ${formData.injuries}` : ''
    } I prefer a ${formData.workoutSplit} workout split.
  
  Requirements:
  1. Provide a markdown-formatted workout plan.
  2. Base all recommendations on recent fitness research.
  3. Adjust exercises for my fitness level and equipment access.
  4. Include specific weights/intensities.
  5. The plan should be perfect and easily understandable. Give the plan in markdown format and don't use tables (mandatory).
  
  Note: Do not give any extra advice and keep the whole plan clean and easy to read. Don't make it too long.`;
  
    setPrompt(promptText);
  
    try {
      const response = await axios.post('/api/generateWorkoutPlan', { prompt: promptText });
      setWorkoutPlan(response.data.content);
      // router.push("/auth/WorkoutPlan")
    } catch (error) {
      console.error('Error generating workout plan:', error);
      setWorkoutPlan('Error generating workout plan. Please try again.');
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <motion.div 
        className="container mx-auto px-4 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Create Your Profile</h1>
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" onValueChange={(value: any) => handleSelectChange("gender", value)}>
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
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" className="bg-transparent" onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" name="height" type="number" className="bg-transparent" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" name="weight" type="number" className="bg-transparent" onChange={handleInputChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activeDays">Active Days per Week</Label>
            <Select name="activeDays" onValueChange={(value: any) => handleSelectChange("activeDays", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select active days" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="hasEquipment" onCheckedChange={handleSwitchChange} />
            <Label htmlFor="hasEquipment">I have access to gym equipment</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Fitness Goal</Label>
            <Select name="goal" onValueChange={(value: any) => handleSelectChange("goal", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
            <Input id="goalWeight" name="goalWeight" className="bg-transparent" type="number" onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="injuries">Injuries or Medical Conditions (if any)</Label>
            <Input id="injuries" name="injuries" className="bg-transparent" onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fitnessLevel">Fitness Level</Label>
            <Select name="fitnessLevel" onValueChange={(value: any) => handleSelectChange("fitnessLevel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your fitness level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workoutSplit">Preferred Workout Split</Label>
            <Select name="workoutSplit" onValueChange={(value: any) => handleSelectChange("workoutSplit", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select workout split" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_body">Full Body</SelectItem>
                <SelectItem value="upper_lower">Upper/Lower</SelectItem>
                <SelectItem value="push_pull_legs">Push/Pull/Legs</SelectItem>
                <SelectItem value="body_part">Body Part Split</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={generatePrompt} className="w-full">Generate Workout Plan</Button>
        </form>
        {prompt && (
          <motion.div 
            className="mt-8 p-4 bg-gray-700 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Generated Prompt:</h2>
            <pre className="whitespace-pre-wrap">{prompt}</pre>
          </motion.div>
        )}
        {workoutPlan && (
          <motion.div 
            className="mt-8 p-4 bg-gray-700 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Generated Workout Plan:</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{workoutPlan}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

