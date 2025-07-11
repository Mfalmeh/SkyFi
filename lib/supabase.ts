import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a safe Supabase client that handles missing environment variables and errors
export const createSafeSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  try {
    return createClientComponentClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return null
  }
}

// Helper function to safely get session without throwing errors
export const getSafeSession = async () => {
  const supabase = createSafeSupabaseClient()
  if (!supabase) return null

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    if (error) {
      console.error("Session error:", error)
      return null
    }
    return session
  } catch (error) {
    console.error("Failed to get session:", error)
    return null
  }
}

export const supabase = createSafeSupabaseClient()
