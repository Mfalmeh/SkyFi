import { supabaseService } from "@/lib/supabase-service" // Import the real Supabase service
import type { SubscriptionType, PaymentType } from "@/lib/supabase-service" // Import types from supabase-service

// Mock subscription service - replace with real API calls
export interface Subscription {
  id: string
  package: {
    name: string
    price: number
    features: string[]
  }
  packageName: string
  packageType: "daily" | "weekly" | "monthly"
  price: number
  start_date: string
  end_date: string
  status: "active" | "expired" | "cancelled"
  autoRenew: boolean
  payment_method?: string
  payment_reference?: string
}

export interface Payment {
  id: string
  amount: number
  currency: string
  created_at: string
  status: "completed" | "pending" | "failed"
  method: "mobile_money" | "card"
  description: string
  reference: string
  subscription?: {
    package: {
      name: string
    }
  }
}

export const subscriptionService = {
  async getCurrentSubscription(userId: string): Promise<SubscriptionType | null> {
    // Fetch real subscription data from Supabase
    try {
      const subscription = await supabaseService.getCurrentSubscription(userId)
      // Map the Supabase data structure to the expected Subscription interface if necessary
      // For now, assuming the types are compatible.
      return subscription
    } catch (error) {
      console.error("Error fetching current subscription from Supabase:", error)
      return null
    }
  },

  async getPaymentHistory(userId: string): Promise<PaymentType[]> {
    // Fetch real payment history from Supabase
    try {
      const payments = await supabaseService.getPaymentHistory(userId)
      // Map the Supabase data structure to the expected Payment interface if necessary
      // For now, assuming the types are compatible.
      return payments
    } catch (error) {
      console.error("Error fetching payment history from Supabase:", error)
      return []
    }
  },
}
