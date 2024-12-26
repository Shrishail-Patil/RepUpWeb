import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Retrieve the uid cookie using 'cookies' from 'next/headers'
    const cookieStore = await cookies();
    const uid = cookieStore.get('uid')?.value;

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID not found in cookies' },
        { status: 400 }
      );
    }

    // Query the workout_sessions table
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('workout_id, user_id, name, date, duration, exercises')
      .eq('user_id', uid)
      .order('date',{ascending:false});

    const transformedData = data!.map((workout) => ({
        id: workout.workout_id,
        userId: workout.user_id,
        name: workout.name,
        date: workout.date,
        duration: workout.duration,
        Exercises: workout.exercises, // Assuming exercises is directly usable
      }));

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workout sessions' },
        { status: 500 }
      );
    }
    console.log(transformedData)

    // Return the fetched data
    return new Response(JSON.stringify(transformedData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}