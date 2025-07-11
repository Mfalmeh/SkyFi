import { redirect } from "next/navigation"
import PaymentContent from "@/components/payment-content"
import { getSafeSessionServer } from "@/lib/supabase-server" // Corrected import path and function name

export default async function PaymentPage() {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/auth/login?redirect=/payment")
  }

  try {
    const session = await getSafeSessionServer() // Use the server-side session helper

    if (!session) {
      redirect("/auth/login?redirect=/payment")
    }

    return <PaymentContent />
  } catch (error) {
    console.error("Payment error:", error)
    redirect("/auth/login?redirect=/payment")
  }
}
