// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// import type { Database } from '@/types/supabase'

// const supabase = createClientComponentClient<Database>()

// export async function getWorkoutSessions(userId: string) {
//   const { data, error } = await supabase
//     .from('workout_sessions')
//     .select(`
//       *,
//       workout_logs (
//         *,
//         exercises (name)
//       )
//     `)
//     .eq('user_id', userId)
//     .order('date', { ascending: false })
  
//   if (error) throw error
//   return data
// }

// export async function createWorkoutSession(userId: string, date: string, exercise: string, sets: number, reps: number, weight: number) {
//   const { data: sessionData, error: sessionError } = await supabase
//     .from('workout_sessions')
//     .insert({ user_id: userId, date })
//     .select()
//     .single()
  
//   if (sessionError) throw sessionError

//   const { data: exerciseData, error: exerciseError } = await supabase
//     .from('exercises')
//     .select('id')
//     .eq('name', exercise)
//     .single()

//   if (exerciseError) throw exerciseError

//   const { error: logError } = await supabase
//     .from('workout_logs')
//     .insert({
//       session_id: sessionData.id,
//       exercise_id: exerciseData.id,
//       sets,
//       reps,
//       weight
//     })

//   if (logError) throw logError

//   return sessionData
// }

