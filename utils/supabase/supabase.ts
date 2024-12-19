// import { supabase } from './supabaseClient'
// import type { UserStats, WorkoutHistory } from '@/types/dashboard'

// export async function getUserStats(userId: string): Promise<UserStats> {
//   const { data, error } = await supabase
//     .from('user_stats')
//     .select('*')
//     .eq('user_id', userId)
//     .single()
    
//   if (error) throw error
  
//   return data
// }

// export async function getWorkoutHistory(userId: string): Promise<WorkoutHistory[]> {
//   const { data, error } = await supabase
//     .from('workout_history')
//     .select('*')
//     .eq('user_id', userId)
//     .order('date', { ascending: false })
//     .limit(7)
    
//   if (error) throw error
  
//   return data
// }

// export async function getUserName(userId: string): Promise<string> {
//   const { data, error } = await supabase
//     .from('profiles')
//     .select('full_name')
//     .eq('id', userId)
//     .single()
    
//   if (error) throw error
  
//   return data?.full_name || 'User'
// }

