// Mock subscription service - replace with real API calls
import { supabase } from "./supabase-client" // Import supabase client
import type { UserProfile, Package } from "./types" // Import UserProfile and Package types

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

class SupabaseService {
  // Use the pre-initialized client from lib/supabase-client.ts
  private supabaseClient = supabase

  // Add a check for supabaseClient availability
  private checkSupabaseClient() {
    if (!this.supabaseClient) {
      console.error("Supabase client is not initialized. Environment variables might be missing.")
      throw new Error("Supabase client not available.")
    }
    return this.supabaseClient
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const client = this.checkSupabaseClient()
      const { data, error } = await client.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getUserProfile:", error)
      return null
    }
  }

  async getPackages(): Promise<Package[]> {
    try {
      const client = this.checkSupabaseClient()
      const { data, error } = await client.from("packages").select("*").order("duration_days", { ascending: true })

      if (error) {
        console.error("Error fetching packages:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getPackages:", error)
      return []
    }
  }

  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    try {
      const client = this.checkSupabaseClient()
      const { data, error } = await client
        .from("subscriptions")
        .select(`
          *,
          package:packages(*)
        `)
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned
          return null
        }
        console.error("Error fetching current subscription:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getCurrentSubscription:", error)
      return null
    }
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    try {
      const client = this.checkSupabaseClient()
      const { data, error } = await client
        .from("subscriptions")
        .select(`
          *,
          package:packages(*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching user subscriptions:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getUserSubscriptions:", error)
      return []
    }
  }

  async getPaymentHistory(userId: string): Promise<Payment[]> {
    try {
      const client = this.checkSupabaseClient()
      const { data, error } = await client
        .from("payments")
        .select(`
          *,
          subscription:subscriptions(
            package:packages(*)
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching payment history:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getPaymentHistory:", error)
      return []
    }
  }

  async createSubscription(
    userId: string,
    packageId: number,
    paymentMethod: string,
    paymentReference: string,
  ): Promise<Subscription | null> {
    try {
      const client = this.checkSupabaseClient()
      // First get the package to calculate end date
      const { data: packageData, error: packageError } = await client
        .from("packages")
        .select("*")
        .eq("id", packageId)
        .single()

      if (packageError || !packageData) {
        console.error("Error fetching package:", packageError)
        return null
      }

      const startDate = new Date()
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + packageData.duration_days)

      const { data, error } = await client
        .from("subscriptions")
        .insert({
          user_id: userId,
          package_id: packageId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: "active",
          payment_method: paymentMethod,
          payment_reference: paymentReference,
        })
        .select(`
          *,
          package:packages(*)
        `)
        .single()

      if (error) {
        console.error("Error creating subscription:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in createSubscription:", error)
      return null
    }
  }

  async createPayment(
    userId: string,
    subscriptionId: number | null,
    amount: number,
    paymentMethod: string,
    paymentReference: string,
    status: "completed" | "pending" | "failed" = "pending",
  ): Promise<Payment | null> {
    try {
      const client = this.checkSupabaseClient()
      const { data, error } = await client
        .from("payments")
        .insert({
          user_id: userId,
          subscription_id: subscriptionId,
          amount,
          currency: "UGX",
          payment_method: paymentMethod,
          payment_reference: paymentReference,
          status,
        })
        .select("*")
        .single()

      if (error) {
        console.error("Error creating payment:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in createPayment:", error)
      return null
    }
  }

  async updatePaymentStatus(paymentId: number, status: "completed" | "pending" | "failed"): Promise<boolean> {
    try {
      const client = this.checkSupabaseClient()
      const { error } = await client.from("payments").update({ status }).eq("id", paymentId)

      if (error) {
        console.error("Error updating payment status:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in updatePaymentStatus:", error)
      return false
    }
  }

  async updatePaymentSubscription(paymentId: number, subscriptionId: number): Promise<Payment | null> {
    try {
      const client = this.checkSupabaseClient()
      const { data, error } = await client
        .from("payments")
        .update({ subscription_id: subscriptionId })
        .eq("id", paymentId)
        .select(`
          *,
          subscription:subscriptions(
            package:packages(*)
          )
        `)
        .single()

      if (error) {
        // Handle "no rows returned" specifically for updates by ID
        if (error.code === "PGRST116") {
          // [^1]
          console.warn(`Payment with ID ${paymentId} not found for subscription update.`)
          return null
        }
        console.error("Error updating payment subscription:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in updatePaymentSubscription:", error)
      return null
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const client = this.checkSupabaseClient()
      const { error } = await client
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("Error updating user profile:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in updateUserProfile:", error)
      return false
    }
  }

  // Real-time subscription for payments
  subscribeToPayments(userId: string, callback: (payload: any) => void) {
    const client = this.checkSupabaseClient()
    return client
      .channel("payments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe()
  }

  // Real-time subscription for subscriptions
  subscribeToSubscriptions(userId: string, callback: (payload: any) => void) {
    const client = this.checkSupabaseClient()
    return client
      .channel("subscriptions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe()
  }
}

export const supabaseService = new SupabaseService()
