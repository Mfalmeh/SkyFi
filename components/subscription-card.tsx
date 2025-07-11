"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Zap, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useCountdown } from "@/hooks/use-countdown"
import type { Subscription } from "@/lib/subscription-service"
import Link from "next/link"

interface SubscriptionCardProps {
  subscription: Subscription
  onUpdate?: () => void
}

export default function SubscriptionCard({ subscription, onUpdate }: SubscriptionCardProps) {
  const countdown = useCountdown(subscription.end_date)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isExpired = countdown.isExpired || subscription.status === "expired"

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />

        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-500" />
              {subscription.package?.name || subscription.packageName}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(subscription.status)}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Badge>
              {onUpdate && (
                <Button variant="ghost" size="sm" onClick={onUpdate}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Package Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Package</p>
              <p className="font-semibold">{subscription.package?.name || subscription.packageName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-semibold">
                {(subscription.package?.price || subscription.price).toLocaleString()} UGX
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
              </span>
            </div>
          </div>

          {/* Package Features */}
          {subscription.package?.features && subscription.package.features.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Features:</p>
              <ul className="space-y-1">
                {subscription.package.features.map((feature, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Countdown Timer */}
          {!isExpired && subscription.status === "active" && (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Time Remaining</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "Days", value: countdown.days },
                  { label: "Hours", value: countdown.hours },
                  { label: "Minutes", value: countdown.minutes },
                  { label: "Seconds", value: countdown.seconds },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    className="bg-white dark:bg-slate-800 rounded-lg p-2"
                    animate={{ scale: item.label === "Seconds" ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 1, repeat: item.label === "Seconds" ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <div className="text-lg font-bold text-orange-500">{item.value.toString().padStart(2, "0")}</div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Expired State */}
          {isExpired && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
              <p className="text-red-600 dark:text-red-400 font-medium">Subscription Expired</p>
              <p className="text-sm text-red-500 dark:text-red-300 mt-1">
                Renew your package to continue enjoying high-speed WiFi
              </p>
            </div>
          )}

          {/* Payment Information */}
          {subscription.payment_method && (
            <div className="text-sm text-muted-foreground">
              <p>Payment Method: {subscription.payment_method.replace("_", " ").toUpperCase()}</p>
              {subscription.payment_reference && <p>Reference: {subscription.payment_reference}</p>}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Link href="/packages" className="flex-1">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                {isExpired ? "Renew Package" : "Upgrade Package"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
