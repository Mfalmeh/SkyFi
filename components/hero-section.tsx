"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, LogOut, Home } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import SkyFiLogo from "@/components/skyfi-logo"
import Footer from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"

export default function HeroSection() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-orange-500 dark:bg-orange-600 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <SkyFiLogo width={120} height={40} />
            </Link>

            <div className="flex items-center space-x-4">
              {mounted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 mt-6">
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/"
                        className="flex items-center text-lg hover:text-orange-500 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Home
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/dashboard"
                        className="text-lg hover:text-orange-500 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/packages"
                        className="text-lg hover:text-orange-500 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Packages
                      </Link>
                    </motion.div>
                    {user && (
                      <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          className="justify-start p-0 text-lg hover:text-orange-500 transition-colors"
                          onClick={handleSignOut}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </motion.div>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 dark:from-orange-600 dark:via-orange-700 dark:to-red-700 text-white py-20 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 flex items-center justify-end pr-8 opacity-40">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 0.4 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Image
                src="/background3.png" // Using the new image
                alt="Woman with phone"
                width={400}
                height={600}
                className="object-contain"
                priority
              />
            </motion.div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Fast & Affordable WiFi for Students
              </motion.h1>

              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl mb-8 text-white/90"
              >
                Get connected with SkyFi&apos;s unlimited WiFi packages designed specifically for hostel residents.
              </motion.p>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {!user ? (
                  <>
                    <Link href="/auth/signup">
                      <Button size="lg" className="bg-white text-orange-500 hover:bg-white/90 font-semibold px-8">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 font-semibold px-8 bg-transparent"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard">
                      <Button size="lg" className="bg-white text-orange-500 hover:bg-white/90 font-semibold px-8">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href="/packages">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 font-semibold px-8 bg-transparent"
                      >
                        View Packages
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose SkyFi?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Experience the best WiFi service designed specifically for students
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Lightning Fast",
                  description: "High-speed internet perfect for streaming, gaming, and studying",
                  icon: "⚡",
                },
                {
                  title: "Affordable Pricing",
                  description: "Student-friendly packages that won't break your budget",
                  icon: "💰",
                },
                {
                  title: "24/7 Support",
                  description: "Round-the-clock customer support whenever you need help",
                  icon: "🛟",
                },
                {
                  title: "Easy Setup",
                  description: "Get connected in minutes with our simple setup process",
                  icon: "🔧",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section className="py-20 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Choose the perfect package for your needs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: "Daily",
                  price: "1,500",
                  period: "per day",
                  features: ["Unlimited data", "24 hours access", "Basic support"],
                },
                {
                  name: "Weekly",
                  price: "8,500",
                  period: "per week",
                  features: ["Unlimited data", "7 days access", "Priority support"],
                  popular: true,
                },
                {
                  name: "Monthly",
                  price: "35,000",
                  period: "per month",
                  features: ["Unlimited data", "30 days access", "Premium support"],
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative p-8 rounded-lg border-2 ${
                    plan.popular
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-orange-500">{plan.price}</span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">UGX {plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center justify-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                      }`}
                    >
                      Choose Plan
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/packages">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                  View All Packages
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
