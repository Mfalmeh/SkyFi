"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { supabaseService, type Subscription, type Payment, type Package } from "@/lib/supabase-service"
import { useAuth } from "@/components/auth-provider"

interface AppState {
  user: {
    profile: any | null
    subscription: Subscription | null
    payments: Payment[]
    packages: Package[]
  }
  ui: {
    loading: {
      subscription: boolean
      payments: boolean
      packages: boolean
    }
    error: string | null
  }
}

type AppAction =
  | { type: "SET_LOADING"; payload: { key: keyof AppState["ui"]["loading"]; value: boolean } }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUBSCRIPTION"; payload: Subscription | null }
  | { type: "SET_PAYMENTS"; payload: Payment[] }
  | { type: "SET_PACKAGES"; payload: Package[] }
  | { type: "ADD_PAYMENT"; payload: Payment }
  | { type: "UPDATE_PAYMENT"; payload: { id: number; updates: Partial<Payment> } }
  | { type: "RESET_STATE" }

const initialState: AppState = {
  user: {
    profile: null,
    subscription: null,
    payments: [],
    packages: [],
  },
  ui: {
    loading: {
      subscription: false,
      payments: false,
      packages: false,
    },
    error: null,
  },
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: {
            ...state.ui.loading,
            [action.payload.key]: action.payload.value,
          },
        },
      }

    case "SET_ERROR":
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
        },
      }

    case "SET_SUBSCRIPTION":
      return {
        ...state,
        user: {
          ...state.user,
          subscription: action.payload,
        },
      }

    case "SET_PAYMENTS":
      return {
        ...state,
        user: {
          ...state.user,
          payments: action.payload,
        },
      }

    case "SET_PACKAGES":
      return {
        ...state,
        user: {
          ...state.user,
          packages: action.payload,
        },
      }

    case "ADD_PAYMENT":
      return {
        ...state,
        user: {
          ...state.user,
          payments: [action.payload, ...state.user.payments],
        },
      }

    case "UPDATE_PAYMENT":
      return {
        ...state,
        user: {
          ...state.user,
          payments: state.user.payments.map((payment) =>
            payment.id === action.payload.id ? { ...payment, ...action.payload.updates } : payment,
          ),
        },
      }

    case "RESET_STATE":
      return initialState

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  actions: {
    loadSubscription: () => Promise<void>
    loadPayments: () => Promise<void>
    loadPackages: () => Promise<void>
    refreshAllData: () => Promise<void>
    addPayment: (payment: Payment) => void
    updatePayment: (id: number, updates: Partial<Payment>) => void
    processPayment: (packageId: number, paymentMethod: string, phoneNumber: string) => Promise<boolean>
    setError: (error: string | null) => void
  }
}

const AppContext = createContext<AppContextType | null>(null)

export function useAppState() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider")
  }
  return context
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { user } = useAuth()

  // Load subscription data
  const loadSubscription = async () => {
    if (!user) return

    dispatch({ type: "SET_LOADING", payload: { key: "subscription", value: true } })
    try {
      const subscription = await supabaseService.getCurrentSubscription(user.id)
      dispatch({ type: "SET_SUBSCRIPTION", payload: subscription })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (error) {
      console.error("Failed to load subscription:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load subscription data" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "subscription", value: false } })
    }
  }

  // Load payment history
  const loadPayments = async () => {
    if (!user) return

    dispatch({ type: "SET_LOADING", payload: { key: "payments", value: true } })
    try {
      const payments = await supabaseService.getPaymentHistory(user.id)
      dispatch({ type: "SET_PAYMENTS", payload: payments })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (error) {
      console.error("Failed to load payments:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load payment history" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "payments", value: false } })
    }
  }

  // Load packages
  const loadPackages = async () => {
    dispatch({ type: "SET_LOADING", payload: { key: "packages", value: true } })
    try {
      const packages = await supabaseService.getPackages()
      dispatch({ type: "SET_PACKAGES", payload: packages })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (error) {
      console.error("Failed to load packages:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load packages" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "packages", value: false } })
    }
  }

  // Refresh all data
  const refreshAllData = async () => {
    await Promise.all([loadSubscription(), loadPayments(), loadPackages()])
  }

  // Add new payment to state
  const addPayment = (payment: Payment) => {
    dispatch({ type: "ADD_PAYMENT", payload: payment })
  }

  // Update payment in state
  const updatePayment = (id: number, updates: Partial<Payment>) => {
    dispatch({ type: "UPDATE_PAYMENT", payload: { id, updates } })
  }

  // Process payment with real-time updates
  const processPayment = async (packageId: number, paymentMethod: string, phoneNumber: string): Promise<boolean> => {
    if (!user) return false

    try {
      // Get package details from state
      const selectedPackage = state.user.packages.find((pkg) => pkg.id === packageId)
      if (!selectedPackage) {
        throw new Error("Package not found")
      }

      // 1. Initiate payment via our API route
      const initiateResponse = await fetch("/api/momo/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPackage.price,
          phoneNumber: phoneNumber,
          packageId: selectedPackage.id,
        }),
      })

      const initiateResult = await initiateResponse.json()

      if (!initiateResponse.ok || !initiateResult.success) {
        dispatch({ type: "SET_ERROR", payload: initiateResult.message || "Failed to initiate payment with MoMo." })
        return false
      }

      const { referenceId } = initiateResult

      // 2. Create a PENDING payment record in Supabase immediately
      const payment = await supabaseService.createPayment(
        user.id,
        null, // subscription_id will be updated later
        selectedPackage.price,
        paymentMethod,
        referenceId, // Use the MoMo referenceId
        "pending",
      )

      if (!payment) {
        throw new Error("Failed to create pending payment record in database.")
      }

      dispatch({ type: "ADD_PAYMENT", payload: payment }) // Add to state

      // 3. Poll for payment status (simplified for demo, real app uses webhooks)
      let paymentStatus = "PENDING"
      let attempts = 0
      const maxAttempts = 10 // Poll for up to 10 times
      const pollInterval = 3000 // Every 3 seconds

      while (paymentStatus === "PENDING" && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval))
        attempts++

        const statusResponse = await fetch(`/api/momo/payment-status/${referenceId}`)
        const statusResult = await statusResponse.json()

        if (statusResponse.ok && statusResult.success) {
          paymentStatus = statusResult.status
          dispatch({
            type: "UPDATE_PAYMENT",
            payload: { id: payment.id, updates: { status: paymentStatus.toLowerCase() } },
          })
        } else {
          console.warn(`Polling for payment status failed (attempt ${attempts}):`, statusResult.message)
        }
      }

      if (paymentStatus === "SUCCESSFUL") {
        // MoMo status for successful payment
        // 4. Create subscription and update payment in Supabase
        const subscription = await supabaseService.createSubscription(user.id, packageId, paymentMethod, referenceId)

        if (!subscription) {
          // If subscription creation fails, mark payment as failed
          await supabaseService.updatePaymentStatus(payment.id, "failed")
          dispatch({ type: "UPDATE_PAYMENT", payload: { id: payment.id, updates: { status: "failed" } } })
          throw new Error("Failed to create subscription after successful payment.")
        }

        // Update payment status and link to subscription
        await supabaseService.updatePaymentStatus(payment.id, "completed")
        const updatedPayment = await supabaseService.updatePaymentSubscription(payment.id, subscription.id)

        if (!updatedPayment) {
          // If the payment record wasn't found for update, or update failed, log a warning.
          // The subscription was created, so we can proceed.
          console.warn(
            "Failed to update payment with subscription ID after successful subscription creation. Payment record might be missing or already updated.",
          )
        }

        dispatch({
          type: "UPDATE_PAYMENT",
          payload: {
            id: payment.id,
            updates: {
              status: "completed",
              subscription_id: subscription.id,
              subscription: { package: selectedPackage },
            },
          },
        })
        dispatch({ type: "SET_SUBSCRIPTION", payload: subscription })
        dispatch({ type: "SET_ERROR", payload: null }) // Clear any previous errors
        return true
      } else {
        // Payment failed or timed out
        await supabaseService.updatePaymentStatus(payment.id, "failed")
        dispatch({ type: "UPDATE_PAYMENT", payload: { id: payment.id, updates: { status: "failed" } } })
        dispatch({ type: "SET_ERROR", payload: "Payment failed or timed out. Please try again." })
        return false
      }
    } catch (error) {
      console.error("Payment processing failed:", error)
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Payment failed" })
      return false
    }
  }

  // Set error
  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error })
  }

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      refreshAllData()
    } else {
      dispatch({ type: "RESET_STATE" })
    }
  }, [user])

  const actions = {
    loadSubscription,
    loadPayments,
    loadPackages,
    refreshAllData,
    addPayment,
    updatePayment,
    processPayment,
    setError,
  }

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>
}
