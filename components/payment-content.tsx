"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Smartphone, CreditCard } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import { useToast } from "@/hooks/use-toast"
import LoadingButton from "@/components/loading-button"
import { useAppState } from "@/lib/app-state" // Add this import

const packages = {
  daily: { name: "Daily Package", price: "1,500", duration: "1 day" },
  weekly: { name: "Weekly Package", price: "8,500", duration: "7 days" },
  monthly: { name: "Monthly Package", price: "35,000", duration: "30 days" },
}

export default function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { state, actions } = useAppState() // Get actions from AppState
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<"mobile" | "card">("mobile")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const packageParam = searchParams.get("package")
    if (packageParam && packages[packageParam as keyof typeof packages]) {
      setSelectedPackage(packageParam)
    } else {
      router.push("/packages")
    }
  }, [searchParams, router])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter your mobile money number.",
        variant: "destructive", // Red for error
      })
      setLoading(false)
      return
    }

    const pkgInfo = packages[selectedPackage as keyof typeof packages]
    if (!pkgInfo) {
      toast({
        title: "Error",
        description: "Selected package not found.",
        variant: "destructive", // Red for error
      })
      setLoading(false)
      return
    }

    // Convert price string to number for API call
    const amount = Number.parseInt(pkgInfo.price.replace(/,/g, ""), 10)
    const packageId = selectedPackage === "daily" ? 1 : selectedPackage === "weekly" ? 2 : 3 // Map string ID to numeric ID

    try {
      const success = await actions.processPayment(packageId, paymentMethod, phoneNumber)

      if (success) {
        toast({
          title: "Payment Initiated!",
          description: `Your request for ${pkgInfo.name} is being processed. Please approve the payment on your phone.`,
          variant: "info", // Blue for info/initiated
        })
        router.push("/dashboard") // Redirect to dashboard after initiation
      } else {
        toast({
          title: "Payment Failed",
          description: state.ui.error || "There was an error processing your payment. Please try again.",
          variant: "destructive", // Red for error
        })
      }
    } catch (error) {
      console.error("Payment submission error:", error)
      toast({
        title: "Payment Failed",
        description: "An unexpected error occurred during payment. Please try again.",
        variant: "destructive", // Red for error
      })
    } finally {
      setLoading(false)
    }
  }

  if (!selectedPackage) {
    return null
  }

  const pkg = packages[selectedPackage as keyof typeof packages]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/packages" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Packages
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Complete your payment to activate your {pkg.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Package Details */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package:</span>
                    <span className="font-medium">{pkg.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{pkg.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-lg">{pkg.price} UGX</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("mobile")}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        paymentMethod === "mobile"
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                          : "border-border hover:border-orange-300"
                      }`}
                    >
                      <Smartphone className="w-6 h-6" />
                      <span className="font-medium">Mobile Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        paymentMethod === "card"
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                          : "border-border hover:border-orange-300"
                      }`}
                      disabled
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="font-medium">Card (Coming Soon)</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Money Form */}
                {paymentMethod === "mobile" && (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Money Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g. 07XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter the phone number registered with Mobile Money
                      </p>
                    </div>

                    <LoadingButton
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6"
                      loading={loading}
                      loadingText="Processing payment..."
                    >
                      Pay {pkg.price} UGX
                    </LoadingButton>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
