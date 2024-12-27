import { UUID } from "crypto";

export interface UserInfo {
    uid:UUID;
    name:string;
    email:string;
    fullName: string;
    lastWorkout?: string;
    totalWorkouts?: number;
    fitnessGoal?: string;
  }
  
  