import { createServerComponentClient } from "@supabase/auth-helpers-nextjs/server"
import { cookies } from "next/headers"

// Create a safe Supabase client for server components
export const createSupabaseServerClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase environment variables are not set for server-side. Authentication may fail.")
    return null
  }

  try {
    return createServerComponentClient({ cookies })
  } catch (error) {
    console.error("Failed to create Supabase server client:", error)
    return null
  }
}

// Helper function to safely get session for server components
export const getSafeSessionServer = async () => {
  const supabase = createSupabaseServerClient()
  if (!supabase) return null

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    if (error) {
      console.error("Server session error:", error)
      return null
    }
    return session
  } catch (error) {
    console.error("Failed to get server session:", error)
    return null
  }
}
