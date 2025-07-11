"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Clock, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { Payment } from "@/lib/subscription-service"

interface PaymentHistoryProps {
  payments: Payment[]
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPaymentDescription = (payment: Payment) => {
    if (payment.subscription?.package?.name) {
      return payment.subscription.package.name
    }
    return payment.description || "Payment"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-orange-500" />
            <CardTitle>Payment History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="font-medium">{getPaymentDescription(payment)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payment.created_at)}
                        {payment.method && <> • {payment.method.replace("_", " ").toUpperCase()}</>}
                      </p>
                      {payment.reference && <p className="text-xs text-muted-foreground">Ref: {payment.reference}</p>}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {payment.amount.toLocaleString()} {payment.currency}
                  </p>
                  <Badge className={getStatusColor(payment.status)} variant="secondary">
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>

          {payments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No payment history found</p>
              <p className="text-sm mt-2">Your payment transactions will appear here once you make a purchase.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
