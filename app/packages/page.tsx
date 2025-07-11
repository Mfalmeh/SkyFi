import { redirect } from "next/navigation"
import PackagesContent from "@/components/packages-content"
import { getSafeSession } from "@/lib/supabase"

export default async function PackagesPage() {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/auth/login?redirect=/packages")
  }

  try {
    const session = await getSafeSession()

    if (!session) {
      redirect("/auth/login?redirect=/packages")
    }

    return <PackagesContent />
  } catch (error) {
    console.error("Packages error:", error)
    redirect("/auth/login?redirect=/packages")
  }
}
