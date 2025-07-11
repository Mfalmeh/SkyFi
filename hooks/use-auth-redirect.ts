"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export function useAuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!loading && user) {
      // Get the redirect URL from query params or default to dashboard
      const redirectTo = searchParams.get("redirect") || "/dashboard"

      // Only redirect if we're currently on an auth page
      if (window.location.pathname.startsWith("/auth/")) {
        router.push(redirectTo)
        router.refresh()
      }
    }
  }, [user, loading, router, searchParams])

  return { user, loading }
}
