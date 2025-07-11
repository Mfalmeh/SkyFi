"use client"

import { useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useAppState } from "@/lib/app-state"
import { supabaseService } from "@/lib/supabase-service"

export function useRealtimeUpdates() {
  const { user } = useAuth()
  const { actions } = useAppState()

  useEffect(() => {
    if (!user) return

    // Subscribe to payment updates
    const paymentsSubscription = supabaseService.subscribeToPayments(user.id, (payload) => {
      console.log("Payment update received:", payload)

      if (payload.eventType === "INSERT") {
        // New payment created
        actions.loadPayments()
      } else if (payload.eventType === "UPDATE") {
        // Payment status updated
        actions.updatePayment(payload.new.id, payload.new)

        // If payment completed, refresh subscription data
        if (payload.new.status === "completed") {
          actions.loadSubscription()
        }
      }
    })

    // Subscribe to subscription updates
    const subscriptionsSubscription = supabaseService.subscribeToSubscriptions(user.id, (payload) => {
      console.log("Subscription update received:", payload)

      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        // New subscription or subscription updated
        actions.loadSubscription()
      }
    })

    // Cleanup subscriptions
    return () => {
      paymentsSubscription.unsubscribe()
      subscriptionsSubscription.unsubscribe()
    }
  }, [user, actions])
}
