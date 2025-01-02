'use client'

import { Fragment, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ArrowLeft, ChevronDown, ChevronUp, X, Loader } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { motion } from 'framer-motion'
import { useRouter } from "next/navigation"

interface Exercise {
  exercise_name: string
  sets: number
  reps: number
  weight: number
}

interface Workout {
  id: number
  date: string
  name: string
  duration: string
  Exercises: Exercise[]
}

export default function WorkoutTrackingPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [newWorkout, setNewWorkout] = useState<Workout>({
    id: 0,
    date: "",
    name: "",
    duration: "",
    Exercises: [],
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const fetchWorkouts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/getWorkouts")
      const data = await response.json()

      if (response.ok) {
        console.log("Fetched workouts:", data)
        setWorkouts(data)
      } else {
        console.error("Error fetching workouts:", data.error)
      }
    } catch (error) {
      console.error("Error fetching workouts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewWorkout((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddExercise = () => {
    setNewWorkout((prev) => ({
      ...prev,
      Exercises: [
        ...prev.Exercises,
        { exercise_name: "", sets: 0, reps: 0, weight: 0 },
      ],
    }))
  }

  const handleExerciseChange = (
    index: number,
    field: keyof Exercise,
    value: string
  ) => {
    setNewWorkout((prev) => ({
      ...prev,
      Exercises: prev.Exercises.map((ex, i) =>
        i === index
          ? { ...ex, [field]: field === "exercise_name" ? value : Number(value) }
          : ex
      ),
    }))
  }

  const handleRemoveExercise = (index: number) => {
    setNewWorkout((prev) => ({
      ...prev,
      Exercises: prev.Exercises.filter((_, i) => i !== index),
    }))
  }

  const handleAddWorkout = async () => {
    if (newWorkout.name && newWorkout.duration && newWorkout.Exercises.length > 0) {
      try {
        const response = await fetch("/api/logWorkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newWorkout),
        })
  
        if (response.ok) {
          const result = await response.json()
          console.log("Workout added successfully:", result)
  
          setNewWorkout({
            id: 0,
            date: "",
            name: "",
            duration: "",
            Exercises: [],
          })
          setIsDialogOpen(false)
  
          toast({
            title: "Workout Added",
            description: "Your workout has been successfully added.",
          })
  
          fetchWorkouts()
        } else {
          const error = await response.json()
          console.error("Error adding workout:", error.error)
        }
      } catch (error) {
        console.error("Error adding workout:", error)
      }
    }
  }

  const toggleWorkoutExpansion = (id: number) => {
    setExpandedWorkout(expandedWorkout === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Button 
          onClick={() => router.replace("/auth/Dashboard")}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Workout Tracker</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900">Your Workouts</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black text-white hover:bg-gray-900">
                    <Plus className="mr-2 h-4 w-4" /> Add Workout
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Add New Workout</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-700">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newWorkout.name}
                          onChange={handleInputChange}
                          className="bg-white text-gray-900 border-gray-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration" className="text-gray-700">Duration (hrs)</Label>
                        <Input
                          id="duration"
                          name="duration"
                          type="number"
                          value={newWorkout.duration}
                          onChange={handleInputChange}
                          className="bg-white text-gray-900 border-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-700">Exercises</Label>
                      {newWorkout.Exercises.map((exercise, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                          <Input
                            placeholder="Exercise name"
                            value={exercise.exercise_name}
                            onChange={(e) =>
                              handleExerciseChange(
                                index,
                                "exercise_name",
                                e.target.value
                              )
                            }
                            className="bg-white text-gray-900 border-gray-300"
                          />
                          <Input
                            type="number"
                            placeholder="Sets"
                            value={exercise.sets || ""}
                            onChange={(e) =>
                              handleExerciseChange(index, "sets", e.target.value)
                            }
                            className="w-20 bg-white text-gray-900 border-gray-300"
                          />
                          <Input
                            type="number"
                            placeholder="Reps"
                            value={exercise.reps || ""}
                            onChange={(e) =>
                              handleExerciseChange(index, "reps", e.target.value)
                            }
                            className="w-20 bg-white text-gray-900 border-gray-300"
                          />
                          <Input
                            type="number"
                            placeholder="Weight"
                            value={exercise.weight || ""}
                            onChange={(e) =>
                              handleExerciseChange(index, "weight", e.target.value)
                            }
                            className="w-24 bg-white text-gray-900 border-gray-300"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveExercise(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={handleAddExercise} className="mt-2 bg-gray-100 text-gray-900 hover:bg-gray-200">
                        <Plus className="mr-2 h-4 w-4" /> Add Exercise
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleAddWorkout} className="bg-black text-white hover:bg-gray-900">Add Workout</Button>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="animate-spin h-10 w-10 text-gray-900" />
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">Date</TableHead>
                    <TableHead className="text-gray-700">Workout Name</TableHead>
                    <TableHead className="text-gray-700">Duration</TableHead>
                    <TableHead className="text-gray-700">Exercises</TableHead>
                    <TableHead className="text-gray-700"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workouts.map((workout) => (
                    <Fragment key={workout.id}>
                      <TableRow
                        className="cursor-pointer border-gray-200 hover:bg-gray-50"
                        onClick={() => toggleWorkoutExpansion(workout.id)}
                      >
                        <TableCell className="text-gray-900">{workout.date}</TableCell>
                        <TableCell className="text-gray-900">{workout.name}</TableCell>
                        <TableCell className="text-gray-900">{parseFloat(workout.duration) > 1 ? workout.duration + " Hours" : workout.duration + " Hour"}</TableCell>
                        <TableCell className="text-gray-900">{workout.Exercises.length || 0}</TableCell>
                        <TableCell className="text-gray-900">
                          {expandedWorkout === workout.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedWorkout === workout.id && (
                        <TableRow className="border-gray-200">
                          <TableCell colSpan={5}>
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-200">
                                  <TableHead className="text-gray-700">Exercise</TableHead>
                                  <TableHead className="text-gray-700">Sets</TableHead>
                                  <TableHead className="text-gray-700">Reps</TableHead>
                                  <TableHead className="text-gray-700">Weight</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {workout.Exercises.map((exercise, index) => (
                                  <TableRow key={index} className="border-gray-200">
                                    <TableCell className="text-gray-900">{exercise.exercise_name}</TableCell>
                                    <TableCell className="text-gray-900">{exercise.sets}</TableCell>
                                    <TableCell className="text-gray-900">{exercise.reps}</TableCell>
                                    <TableCell className="text-gray-900">{exercise.weight}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>)}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

