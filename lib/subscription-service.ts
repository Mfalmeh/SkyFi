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
  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock data - replace with real API call
    return {
      id: "sub_123",
      package: {
        name: "Weekly Package",
        price: 8500,
        features: ["Unlimited WiFi access", "Valid for 7 days", "24/7 customer support"],
      },
      packageName: "Weekly Package",
      packageType: "weekly",
      price: 8500,
      start_date: "2025-01-08T00:00:00Z",
      end_date: "2025-01-15T00:00:00Z",
      status: "active",
      autoRenew: true,
      payment_method: "mobile_money",
      payment_reference: "MTN_789456123",
    }
  },

  async getPaymentHistory(userId: string): Promise<Payment[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock data - replace with real API call
    return [
      {
        id: "pay_123",
        amount: 8500,
        currency: "UGX",
        created_at: "2025-01-08T10:30:00Z",
        status: "completed",
        method: "mobile_money",
        description: "Weekly Package",
        reference: "MTN_789456123",
        subscription: {
          package: {
            name: "Weekly Package",
          },
        },
      },
      {
        id: "pay_122",
        amount: 1500,
        currency: "UGX",
        created_at: "2025-01-01T14:20:00Z",
        status: "completed",
        method: "mobile_money",
        description: "Daily Package",
        reference: "AIRTEL_456789123",
        subscription: {
          package: {
            name: "Daily Package",
          },
        },
      },
      {
        id: "pay_121",
        amount: 1500,
        currency: "UGX",
        created_at: "2024-12-30T09:15:00Z",
        status: "completed",
        method: "mobile_money",
        description: "Daily Package",
        reference: "MTN_123456789",
        subscription: {
          package: {
            name: "Daily Package",
          },
        },
      },
    ]
  },
}
