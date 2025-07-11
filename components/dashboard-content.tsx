"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, HelpCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import LoadingSpinner from "@/components/loading-spinner"
import LoadingButton from "@/components/loading-button"
import SubscriptionCard from "@/components/subscription-card"
import PaymentHistory from "@/components/payment-history"
import { subscriptionService, type Subscription, type Payment } from "@/lib/subscription-service"
import { motion } from "framer-motion"
import type { User } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"

interface DashboardContentProps {
  user: User
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loadingSubscription, setLoadingSubscription] = useState(true)
  const [loadingPayments, setLoadingPayments] = useState(true)
  const [contactingSupport, setContactingSupport] = useState(false)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load subscription data
        const subscriptionData = await subscriptionService.getCurrentSubscription(user.id)
        setSubscription(subscriptionData)
      } catch (error) {
        console.error("Failed to load subscription:", error)
      } finally {
        setLoadingSubscription(false)
      }

      try {
        // Load payment history
        const paymentData = await subscriptionService.getPaymentHistory(user.id)
        setPayments(paymentData)
      } catch (error) {
        console.error("Failed to load payments:", error)
      } finally {
        setLoadingPayments(false)
      }
    }

    loadDashboardData()
  }, [user.id])

  const handleContactSupport = async () => {
    setContactingSupport(true)
    // Simulate contacting support
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setContactingSupport(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold">Welcome back, {user.user_metadata?.full_name || "User"}!</h1>
            <p className="text-muted-foreground">Manage your WiFi subscription and view your account details</p>
          </motion.div>

          {/* Subscription Status */}
          <div>
            {loadingSubscription ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                  <span className="ml-3 text-muted-foreground">Loading subscription details...</span>
                </CardContent>
              </Card>
            ) : subscription ? (
              <SubscriptionCard subscription={subscription} />
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                          <HelpCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">No Active Subscription</h3>
                        <p className="text-muted-foreground mb-4">You don&apos;t have any active WiFi subscription</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Purchase a package to start enjoying our high-speed WiFi service.
                        </p>
                        <Link href="/packages">
                          <LoadingButton className="bg-orange-500 hover:bg-orange-600">View Packages</LoadingButton>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Payment History */}
          <div>
            {loadingPayments ? (
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Loading your payment history...</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                  <LoadingSpinner size="md" />
                  <span className="ml-3 text-muted-foreground">Loading payments...</span>
                </CardContent>
              </Card>
            ) : (
              <PaymentHistory payments={payments} />
            )}
          </div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Contact our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Having issues with your WiFi connection or need assistance with your account?
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Contact us:</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>+256 700 000000</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>support@skyfi.com</span>
                  </div>
                </div>

                <LoadingButton
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  loading={contactingSupport}
                  loadingText="Connecting to support..."
                  onClick={handleContactSupport}
                >
                  Contact Support
                </LoadingButton>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
