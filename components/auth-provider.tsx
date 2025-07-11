"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/auth-helpers-nextjs"
import { supabase } from "@/lib/supabase-client" // Import the client-side instance

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  // Use the pre-initialized client from lib/supabase-client.ts
  // If supabase is null, it means env vars are not configured.
  const supabaseClient = supabase

  useEffect(() => {
    // Check if Supabase is configured
    if (!supabaseClient) {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabaseClient.auth.getSession()
        if (error) {
          console.error("Session error:", error)
          setUser(null)
        } else {
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("Failed to get session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle sign out
      if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabaseClient])

  const signOut = async () => {
    if (!supabaseClient) return // Cannot sign out if client is not configured
    try {
      // Clear local storage first
      if (typeof window !== "undefined") {
        const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]
        if (projectRef) {
          localStorage.removeItem(`sb-${projectRef}-auth-token`)
        }
      }
      await supabaseClient.auth.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
}
