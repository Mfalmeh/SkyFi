"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

const packages = [
  {
    id: "daily",
    name: "Daily Package",
    price: "1,500",
    duration: "24 hours",
    description: "Unlimited WiFi access for 24 hours",
    features: ["Unlimited WiFi access", "Valid for 1 day", "24/7 customer support"],
    color: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "weekly",
    name: "Weekly Package",
    price: "8,500",
    duration: "7 days",
    description: "Unlimited WiFi access for 7 days",
    features: ["Unlimited WiFi access", "Valid for 7 days", "24/7 customer support"],
    color: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    popular: true,
  },
  {
    id: "monthly",
    name: "Monthly Package",
    price: "35,000",
    duration: "30 days",
    description: "Unlimited WiFi access for 30 days",
    features: ["Unlimited WiFi access", "Valid for 30 days", "24/7 customer support"],
    color: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
]

export default function PackagesContent() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Choose Your WiFi Package</h1>
            <p className="text-muted-foreground">Select the package that best fits your needs and budget</p>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-2xl mx-auto">
            {packages.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.color}`}>
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 hover:bg-orange-600">
                    POPULAR
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${pkg.color}`}>
                    <Calendar className={`w-6 h-6 ${pkg.iconColor}`} />
                  </div>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    <span className="text-sm text-muted-foreground">UGX</span>
                  </div>
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={`/payment?package=${pkg.id}`}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">Select Package</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
