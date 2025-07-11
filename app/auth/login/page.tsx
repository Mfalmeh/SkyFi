"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SkyFiLogo from "@/components/skyfi-logo"
import LoadingButton from "@/components/loading-button"
import { supabase } from "@/lib/supabase-client" // Import the client-side instance

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Check if Supabase is configured
  const isSupabaseConfigured = !!supabase // Check if the client instance exists

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      toast({
        title: "Configuration Required",
        description: "Supabase environment variables are not configured. Please set up your Supabase project.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Clear any existing session data first
      if (typeof window !== "undefined") {
        const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]
        if (projectRef) {
          localStorage.removeItem(`sb-${projectRef}-auth-token`)
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive", // Red for error
        })
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully!",
          variant: "success", // Green for success
        })

        // Redirect to the originally requested page or dashboard
        const redirectTo = searchParams.get("redirect") || "/dashboard"

        // Use replace to prevent back button issues
        router.replace(redirectTo)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive", // Red for error
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 dark:from-orange-600 dark:via-orange-700 dark:to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-white hover:text-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
          <CardHeader className="space-y-1">
            <div className="flex flex-col items-center space-y-4">
              <SkyFiLogo width={100} height={35} /> {/* Reduced logo size */}
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            </div>
            <CardDescription className="text-center">Sign in to your SkyFi account</CardDescription>
          </CardHeader>
          <CardContent>
            {!isSupabaseConfigured && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Supabase is not configured. Please add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
                  environment variables.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <LoadingButton
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                loading={loading}
                loadingText="Signing in..."
                disabled={!isSupabaseConfigured}
              >
                Sign In
              </LoadingButton>
            </form>

            <div className="mt-6 text-center text-sm">
              {"Don't have an account? "}
              <Link href="/auth/signup" className="text-orange-500 hover:text-orange-600 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
