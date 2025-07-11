import { redirect } from "next/navigation"
import DashboardContent from "@/components/dashboard-content"
import { getSafeSessionServer } from "@/lib/supabase-server" // Import server-side session helper

export default async function DashboardPage() {
  // Check if Supabase is configured (important for both client and server)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // If not configured, redirect to login, indicating a missing setup
    redirect("/auth/login?redirect=/dashboard")
  }

  try {
    const session = await getSafeSessionServer() // Use server-side session helper

    if (!session) {
      // If no session, redirect to login with the current path as a redirect parameter
      redirect("/auth/login?redirect=/dashboard")
    }

    // If session exists, render the dashboard content
    return <DashboardContent user={session.user} />
  } catch (error) {
    console.error("Dashboard page error:", error)
    // In case of any unexpected error during session retrieval, redirect to login
    redirect("/auth/login?redirect=/dashboard")
  }
}
