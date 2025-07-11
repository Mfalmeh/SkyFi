import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a safe Supabase client that handles missing environment variables and errors
export const createSafeSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase environment variables are not set for client-side. Some features may not work.")
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

export const supabase = createSafeSupabaseClient()
