import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {NextRequest} from 'next/server';
export async function POST(request: NextRequest) {
    try {
      const supabase = await createClient(); // Ensure this points to your Supabase setup
      const cookieStore = await cookies(); // Get cookies
      
      // Parse the request body
      const data = await request.json();
      console.log("Received Data:", data);
  
      // Check if `uid` cookie exists
      const uid = cookieStore.get("uid");
      if (!uid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // Process the data (e.g., inserting into Supabase)
      const { name, date, duration, Exercises } = data;
      console.log(data)
  
      const { error } = await supabase
        .from("workout_sessions")
        .insert([
          {
            name,
            // date: date || new Date().toISOString(),
            duration,
            user_id: uid.value,
            exercises: Exercises,
          },
        ]);
  
      if (error) {
        console.error("Error inserting workout:", error);
        return NextResponse.json({ error: "Error adding workout" }, { status: 500 });
      }
  
      return NextResponse.json({ message: "Workout added successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error in POST handler:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  