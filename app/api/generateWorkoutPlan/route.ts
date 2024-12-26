import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const cookies = req.cookies;
    const userId = cookies.get('uid')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in cookies' }, { status: 400 });
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || '',
    });

    // Generate the workout plan
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });

    const workoutPlan = response.choices[0]?.message?.content || '';

    // Insert the workout plan into Supabase
    const { error } = await supabase.from('users_workouts').insert([
      { user_id: userId, workout_plan: workoutPlan },
    ]);

    if (error) {
      console.error('Error storing workout plan in Supabase:', error);
      return NextResponse.json({ error: 'Failed to store workout plan' }, { status: 500 });
    }

    // Redirect user to the dashboard after successful operation
    return NextResponse.redirect(new URL('/auth/Dashboard', req.url));
  } catch (error) {
    console.error('Error generating or storing workout plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
