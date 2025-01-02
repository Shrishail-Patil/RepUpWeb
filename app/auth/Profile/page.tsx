"use client";

import { useState, useEffect } from "react";
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
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { AnimatedDumbbell } from "@/components/animated-dumbbell";
import { AnimatedPlate } from "@/components/animated-plate";
import { SquiggleButton } from "@/components/squiggle-button";
import { Switch } from "@/components/ui/switch";
import Cookies from "js-cookie";
import { supabase } from "@/utils/supabase/supabaseClient";
import { UUID } from "crypto";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user session and set cookies
    // async function checkUser(uid:string) {
    //   const { data, error } = await supabase.auth.getSession();
    //   if (error) {
    //     console.error(error);
    //     }
    //   else {
    //       const user = await supabase.from("users_workouts").select("*").eq("user_id", uid).single();
    //       if (user) {
    //         setTimeout(() => {
    //           router.push("/auth/Dashboard");
    //         }, 1000); // Add 3-second delay
    //       }
    //       else{
    //         setTimeout(() => {
    //           setLoading(false);
    //         }, 1000); // Add 3-second delay
    //         // setLoading(false)
    //       }
    //     }
    // }
    async function checkUser(uid: string) {
      try {
        const { data: user, error } = await supabase
          .from("users_workouts")
          .select("*")
          .eq("user_id", uid)
          .single();
    
        // if (error) {
        //   console.error("Error fetching user workouts:", error);
        //   setLoading(false);
        //   return;
        // }
    
        if (user) {
          router.push("/auth/Dashboard"); // Redirect if user data exists
        } else {
          setLoading(false); // Stop loading if no data exists
        }
      } catch (err) {
        console.log("Error in checkUser:", err);
        setLoading(false); // Ensure loading state ends on error
      }
    }
    
    async function fetchSession() {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = sessionData?.session;
        if (session) {
          const user = session.user;
          checkUser(user.id);
          

          // Set cookies for uid and uname
          Cookies.set("uid", user.id, { expires: 7 }); // Expires in 7 days
          Cookies.set("uname", user.user_metadata?.name || "User", { expires: 7 });
        } else {
          router.replace("/"); // Redirect to login if no session
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        router.replace("/"); // Redirect to login on error
      }
    }

    fetchSession();
  }, [router]);

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
    const promptText = `Generate a comprehensive, 90-day personalized workout plan tailored to the following profile:

### User Profile:
- **Age:** ${formData.age} years
- **Gender:** ${formData.gender}
- **Height:** ${formData.height} cm
- **Weight:** ${formData.weight} kg
- **Equipment Access:** ${formData.hasEquipment ? "Fully equipped gym" : "No gym equipment"}
- **Available Workout Days:** ${formData.activeDays} days per week
- **Goal:** ${formData.goal} (Target Weight: ${formData.goalWeight} kg)
- **Fitness Level:** ${formData.fitnessLevel}
${formData.injuries ? `- **Medical Conditions/Injuries:** ${formData.injuries}` : ""}
- **Preferred Workout Split:** ${formData.workoutSplit}

### Requirements:
1. **Markdown Format:** Deliver the entire workout plan in a clean and professional markdown format for ease of understanding and readability. Avoid using tables.
2. **Research-Based Plan:** Base all exercise recommendations on the latest fitness and exercise science. Ensure accuracy and efficacy for achieving the stated goals.
3. **Customization:** Adapt exercises to the user’s fitness level, available equipment, and any medical conditions/injuries if applicable. Include modifications for safety and progression.
4. **Detail-Oriented:** Specify workout splits, exercise names, sets, repetitions, rest times, and recommended weights/intensities (using RPE or percentage of 1RM where appropriate).
5. **Clarity:** The plan should be clean, easy to follow, and entirely focused on delivering results. Avoid any additional advice, unnecessary text, or extraneous formatting.

### Additional Notes:
- **Consistency:** Ensure that the workout progression aligns with the user’s fitness level and goals, incorporating progressive overload principles.
- **Variety:** Include an engaging variety of exercises to maintain motivation while still focusing on the target goal.
- **Periodization:** Structure the plan across the 90 days to ensure steady progress with appropriate recovery periods.

**Output Example:**  
Deliver the plan in a markdown format similar to this structure:

\`\`\`markdown
# 90-Day Personalized Workout Plan

## Week 1-4: Foundation Phase
### Day 1: Upper Body Strength
- **Warm-Up:** 5 minutes of dynamic stretching and light cardio
- **Workout:**
  - Bench Press: 4 sets of 8 reps @ 70% 1RM
  - Dumbbell Rows: 4 sets of 10 reps
  - Shoulder Press: 3 sets of 12 reps
  - Plank: 3 sets of 1 minute hold
- **Cooldown:** 5 minutes of static stretching

...

## Week 5-8: Progression Phase
...

## Week 9-12: Peak Phase
...
\`\`\`

Focus on precision, readability, and a logical structure to ensure the plan is actionable and effective.`;

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    const { error } = await supabase.from("user_fitness_details").insert({
    user_id: userId,
    gender: formData.gender,
    age: formData.age,
    height: formData.height,
    weight: formData.weight,
    active_days: formData.activeDays,
    has_equipment: formData.hasEquipment,
    goal:  formData.goal,
    goal_weight: formData.goalWeight,
    injuries: formData.injuries,
    fitness_level: formData.fitnessLevel,
    workout_split: formData.workoutSplit,
  })
  if (error) {
    console.error("Supabase Insert Error:", error.message);
  }
  // console.log(error);
    // if (error) {
    //   console.error("Error inserting user fitness details:", error);
    // }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-2xl font-medium text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Logging you in 😊
        </motion.div>
      </div>
    )
  }

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
