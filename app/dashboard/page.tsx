import { redirect } from "next/navigation"
import DashboardContent from "@/components/dashboard-content"
import { getSafeSession } from "@/lib/supabase"

export default async function DashboardPage() {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/auth/login?redirect=/dashboard")
  }

  try {
    const session = await getSafeSession()

    if (!session) {
      redirect("/auth/login?redirect=/dashboard")
    }

    return <DashboardContent user={session.user} />
  } catch (error) {
    console.error("Dashboard error:", error)
    redirect("/auth/login?redirect=/dashboard")
  }
}
