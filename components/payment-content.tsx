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

const packages = {
  daily: { name: "Daily Package", price: "1,500", duration: "1 day" },
  weekly: { name: "Weekly Package", price: "8,500", duration: "7 days" },
  monthly: { name: "Monthly Package", price: "35,000", duration: "30 days" },
}

export default function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
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

    // Simulate payment processing
    try {
      // Here you would integrate with actual mobile money APIs
      // For now, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Payment Successful!",
        description: `Your ${packages[selectedPackage as keyof typeof packages]?.name} package has been activated.`,
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
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
