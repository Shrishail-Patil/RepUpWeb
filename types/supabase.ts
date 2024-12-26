export interface Database {
    public: {
      Tables: {
        users: {
          Row: {
            id: string
            name: string
            email: string
            created_at: string
          }
          Insert: {
            id?: string
            name: string
            email: string
            created_at?: string
          }
          Update: {
            id?: string
            name?: string
            email?: string
            created_at?: string
          }
        }
        workout_plans: {
          Row: {
            id: string
            user_id: string
            name: string
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            name: string
            created_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            name?: string
            created_at?: string
          }
        }
        exercises: {
          Row: {
            id: string
            name: string
            category: string
            muscle_group: string
            created_at: string
          }
          Insert: {
            id?: string
            name: string
            category: string
            muscle_group: string
            created_at?: string
          }
          Update: {
            id?: string
            name?: string
            category?: string
            muscle_group?: string
            created_at?: string
          }
        }
        workout_sessions: {
          Row: {
            id: string
            user_id: string
            date: string
            notes: string | null
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            date: string
            notes?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            date?: string
            notes?: string | null
            created_at?: string
          }
        }
        workout_logs: {
          Row: {
            id: string
            session_id: string
            exercise_id: string
            sets: number
            reps: number
            weight: number | null
            duration: number | null
            created_at: string
          }
          Insert: {
            id?: string
            session_id: string
            exercise_id: string
            sets: number
            reps: number
            weight?: number | null
            duration?: number | null
            created_at?: string
          }
          Update: {
            id?: string
            session_id?: string
            exercise_id?: string
            sets?: number
            reps?: number
            weight?: number | null
            duration?: number | null
            created_at?: string
          }
        }
      }
    }
  }
  
  export type Exercise = Database['public']['Tables']['exercises']['Row']
  export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row'] & {
    workout_logs: (Database['public']['Tables']['workout_logs']['Row'] & {
      exercises: Pick<Exercise, 'name' | 'category' | 'muscle_group'>
    })[]
  }
  
  