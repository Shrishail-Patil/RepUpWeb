"use client";

import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, ChevronDown, ChevronUp, X, Loader } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";

interface Exercise {
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  id: number;
  date: string;
  name: string;
  duration: string;
  Exercises: Exercise[];
}

export default function WorkoutTrackingPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [newWorkout, setNewWorkout] = useState<Workout>({
    id: 0,
    date: "",
    name: "",
    duration: "",
    Exercises: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const fetchWorkouts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/getWorkouts");
      const data = await response.json();

      if (response.ok) {
        console.log("Fetched workouts:", data);
        setWorkouts(data);
      } else {
        console.error("Error fetching workouts:", data.error);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWorkout((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExercise = () => {
    setNewWorkout((prev) => ({
      ...prev,
      Exercises: [
        ...prev.Exercises,
        { exercise_name: "", sets: 0, reps: 0, weight: 0 },
      ],
    }));
  };

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
    }));
  };

  const handleRemoveExercise = (index: number) => {
    setNewWorkout((prev) => ({
      ...prev,
      Exercises: prev.Exercises.filter((_, i) => i !== index),
    }));
  };

  const handleAddWorkout = async () => {
    if (newWorkout.name && newWorkout.duration && newWorkout.Exercises.length > 0) {
      try {
        const response = await fetch("/api/logWorkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newWorkout),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log("Workout added successfully:", result);
  
          setNewWorkout({
            id: 0,
            date: "",
            name: "",
            duration: "",
            Exercises: [],
          });
          setIsDialogOpen(false);
  
          toast({
            title: "Workout Added",
            description: "Your workout has been successfully added.",
          });
  
          fetchWorkouts();
        } else {
          const error = await response.json();
          console.error("Error adding workout:", error.error);
        }
      } catch (error) {
        console.error("Error adding workout:", error);
      }
    }
  };

  const toggleWorkoutExpansion = (id: number) => {
    setExpandedWorkout(expandedWorkout === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* <Link
          href="/auth/Dashboard"
          className="text-gray-300 hover:text-white flex items-center transition-colors duration-200"
        >
          <ArrowLeft className="mr-2" /> Back to Home
        </Link> */}
        <Button onClick={()=>
          router.replace("/auth/Dashboard")
        }>
          <ArrowLeft className="mr-2" /> Back to Home
        </Button>
        <h1 className="text-2xl  font-bold">Workout Tracker</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-50">Your Workouts</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-gray-900 hover:bg-gray-200">
                    <Plus className="mr-2 h-4 w-4" /> Add Workout
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl bg-gray-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Workout</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newWorkout.name}
                          onChange={handleInputChange}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (hrs)</Label>
                        <Input
                          id="duration"
                          name="duration"
                          type="number"
                          value={newWorkout.duration}
                          onChange={handleInputChange}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Exercises</Label>
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
                            className="bg-gray-700 text-white border-gray-600"
                          />
                          <Input
                            type="number"
                            placeholder="Sets"
                            value={exercise.sets || ""}
                            onChange={(e) =>
                              handleExerciseChange(index, "sets", e.target.value)
                            }
                            className="w-20 bg-gray-700 text-white border-gray-600"
                          />
                          <Input
                            type="number"
                            placeholder="Reps"
                            value={exercise.reps || ""}
                            onChange={(e) =>
                              handleExerciseChange(index, "reps", e.target.value)
                            }
                            className="w-20 bg-gray-700 text-white border-gray-600"
                          />
                          <Input
                            type="number"
                            placeholder="Weight"
                            value={exercise.weight || ""}
                            onChange={(e) =>
                              handleExerciseChange(index, "weight", e.target.value)
                            }
                            className="w-24 bg-gray-700 text-white border-gray-600"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveExercise(index)}
                            className="text-gray-300 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={handleAddExercise} className="mt-2 bg-gray-700 text-white hover:bg-gray-600">
                        <Plus className="mr-2 h-4 w-4" /> Add Exercise
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleAddWorkout} className="bg-white text-gray-900 hover:bg-gray-200">Add Workout</Button>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="animate-spin h-10 w-10 text-white" />
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Workout Name</TableHead>
                    <TableHead className="text-gray-300">Duration</TableHead>
                    <TableHead className="text-gray-300">Exercises</TableHead>
                    <TableHead className="text-gray-300"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workouts.map((workout) => (
                    <Fragment key={workout.id}>
                      <TableRow
                        className="cursor-pointer border-gray-700 hover:bg-gray-700 text-white"
                        onClick={() => toggleWorkoutExpansion(workout.id)}
                      >
                        <TableCell className="text-white">{workout.date}</TableCell>
                        <TableCell className="text-white">{workout.name}</TableCell>
                        <TableCell className="text-white">{parseFloat(workout.duration)>1?workout.duration+" Hours":workout.duration+" Hour"}</TableCell>
                        <TableCell className="text-white">{workout.Exercises.length || 0}</TableCell>
                        <TableCell className="text-white">
                          {expandedWorkout === workout.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedWorkout === workout.id && (
                        <TableRow className="border-gray-700">
                          <TableCell colSpan={5}>
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-700">
                                  <TableHead className="text-gray-300">Exercise</TableHead>
                                  <TableHead className="text-gray-300">Sets</TableHead>
                                  <TableHead className="text-gray-300">Reps</TableHead>
                                  <TableHead className="text-gray-300">Weight</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {workout.Exercises.map((exercise, index) => (
                                  <TableRow key={index} className="border-gray-700">
                                    <TableCell className="text-white">{exercise.exercise_name}</TableCell>
                                    <TableCell className="text-white">{exercise.sets}</TableCell>
                                    <TableCell className="text-white">{exercise.reps}</TableCell>
                                    <TableCell className="text-white">{exercise.weight}</TableCell>
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
  );
}

