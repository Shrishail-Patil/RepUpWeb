"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { AnimatedDumbbell } from "@/components/animated-dumbbell";
import { AnimatedPlate } from "@/components/animated-plate";
import { SquiggleButton } from "@/components/squiggle-button";
import SwitchBase from "@mui/material/internal/SwitchBase";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    activeDays: "",
    hasEquipment: false,
    goal: "",
    goalWeight: "",
    injuries: "",
    fitnessLevel: "",
    workoutSplit: "",
  });
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, hasEquipment: checked }));
  };

  const generatePrompt = async () => {
    const promptText = `Generate a personalized 90-day workout plan based on my profile:
    
    I am a ${formData.age} year old ${formData.gender}, ${formData.height}cm tall, weighing ${formData.weight}kg. I have ${formData.hasEquipment ? "access to a fully equipped gym" : "no gym equipment"}. I can work out ${formData.activeDays} days per week. My goal is ${formData.goal} with a target weight of ${formData.goalWeight}kg. My fitness level is ${formData.fitnessLevel}. ${
      formData.injuries
        ? `I have the following medical conditions/injuries to consider: ${formData.injuries}`
        : ""
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
      const response = await axios.post("/api/generateWorkoutPlan", {
        prompt: promptText,
      });
      setWorkoutPlan(response.data.content);
      router.push("/auth/Dashboard");
    } catch (error) {
      console.error("Error generating workout plan:", error);
      setWorkoutPlan("Error generating workout plan. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
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

      <motion.div
        className="container mx-auto px-4 max-w-2xl py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-gradient">
          Create Your Profile
        </h1>
        <div className="glass-card p-8 rounded-2xl shadow-xl">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-800">
                  Gender
                </Label>
                <Select
                  name="gender"
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger className="bg-white/70 border-gray-300 rounded-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 rounded-lg">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-800">
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  className="bg-white/70 border-gray-300 rounded-full"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-gray-800">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  className="bg-white/70 border-gray-300 rounded-full"
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-gray-800">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  className="bg-white/70 border-gray-300 rounded-full"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activeDays" className="text-gray-800">
                Active Days per Week
              </Label>
              <Select
                name="activeDays"
                onValueChange={(value) =>
                  handleSelectChange("activeDays", value)
                }
              >
                <SelectTrigger className="bg-white/70 border-gray-300 rounded-full">
                  <SelectValue placeholder="Select active days" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 rounded-lg">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="hasEquipment"
                onCheckedChange={handleSwitchChange}
                className="bg-purple-500  data-[state=checked]:bg-purple-300/20 border-2 border-purple-300/20"
              />
              <Label htmlFor="hasEquipment" className="text-gray-800">
                I have access to gym equipment
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-gray-800">
                Fitness Goal
              </Label>
              <Select
                name="goal"
                onValueChange={(value) => handleSelectChange("goal", value)}
              >
                <SelectTrigger className="bg-white/70 border-gray-300 rounded-full">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 rounded-lg">
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalWeight" className="text-gray-800">
                Goal Weight (kg)
              </Label>
              <Input
                id="goalWeight"
                name="goalWeight"
                className="bg-white/70 border-gray-300 rounded-full"
                type="number"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="injuries" className="text-gray-800">
                Injuries or Medical Conditions (if any)
              </Label>
              <Input
                id="injuries"
                name="injuries"
                className="bg-white/70 border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fitnessLevel" className="text-gray-800">
                Fitness Level
              </Label>
              <Select
                name="fitnessLevel"
                onValueChange={(value) =>
                  handleSelectChange("fitnessLevel", value)
                }
              >
                <SelectTrigger className="bg-white/70 border-gray-300 rounded-full">
                  <SelectValue placeholder="Select your fitness level" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 rounded-lg">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workoutSplit" className="text-gray-800">
                Preferred Workout Split
              </Label>
              <Select
                name="workoutSplit"
                onValueChange={(value) =>
                  handleSelectChange("workoutSplit", value)
                }
              >
                <SelectTrigger className="bg-white/70 border-gray-300 rounded-full">
                  <SelectValue placeholder="Select workout split" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 rounded-lg">
                  <SelectItem value="full_body">Full Body</SelectItem>
                  <SelectItem value="upper_lower">Upper/Lower</SelectItem>
                  <SelectItem value="push_pull_legs">Push/Pull/Legs</SelectItem>
                  <SelectItem value="body_part">Body Part Split</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SquiggleButton
              onClick={(e) => {
                e.preventDefault(); // Prevent default form behavior
                generatePrompt();
              }}
              className="w-full"
            >
              Generate Workout Plan
            </SquiggleButton>
            {/* <Button
              type="button"
              onClick={generatePrompt}
              className="w-full px-6 py-3 bg-white/70 border-gray-300  text-gray-800 font-bold text-lg rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Generate Workout Plan
            </Button> */}
          </form>
        </div>
        {prompt && (
          <motion.div
            className="mt-8 p-4 glass-card rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gradient">
              Generated Prompt:
            </h2>
            <pre className="whitespace-pre-wrap text-gray-800">{prompt}</pre>
          </motion.div>
        )}
        {workoutPlan && (
          <motion.div
            className="mt-8 p-4 glass-card rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gradient">
              Generated Workout Plan:
            </h2>
            <div className="prose max-w-none text-gray-800">
              <ReactMarkdown>{workoutPlan}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
