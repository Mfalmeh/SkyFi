"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Wifi, Shield, Clock, CreditCard, Check } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"
import { useState, useRef, useEffect, useCallback } from "react"

// Define packages data locally for the carousel - now only 3 packages
const carouselPackages = [
  {
    id: "daily",
    name: "Daily",
    price: "1,500",
    duration: "1 day",
    description: "Perfect for short-term needs",
    features: ["Unlimited data", "24 hours access"],
    popular: false,
  },
  {
    id: "weekly",
    name: "Weekly",
    price: "8,500",
    duration: "7 days",
    description: "Great value for regular users",
    features: ["Unlimited data", "7 days access", "Save 20% vs daily"],
    popular: true,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "35,000",
    duration: "30 days",
    description: "Best value for long-term",
    features: ["Unlimited data", "30 days access", "Save 30% vs daily"],
    popular: false,
  },
]

const HomePage = () => {
  const router = useRouter()
  const { user } = useAuth()

  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(1) // Start with "Weekly" (index 1) as active

  const CARD_WIDTH = 300 // Fixed width of each card
  const GAP_WIDTH = 32 // Equivalent to Tailwind's space-x-8 (2rem)

  // Function to scroll to a specific item, only called by pagination dots
  const scrollToItem = useCallback((index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * (CARD_WIDTH + GAP_WIDTH),
        behavior: "smooth",
      })
      setActiveIndex(index)
    }
  }, []) // No dependencies, as CARD_WIDTH and GAP_WIDTH are constants

  // Function to update activeIndex based on scroll position
  const handleScroll = useCallback(() => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft
      const newIndex = Math.round(scrollLeft / (CARD_WIDTH + GAP_WIDTH))
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex)
      }
    }
  }, [activeIndex]) // Only re-create if activeIndex changes

  useEffect(() => {
    const carouselElement = carouselRef.current
    if (carouselElement) {
      carouselElement.addEventListener("scroll", handleScroll)
      // Initial scroll to center the active item
      // Use a timeout to ensure layout is stable before initial scroll
      const initialScrollTimeout = setTimeout(() => {
        scrollToItem(activeIndex)
      }, 100) // Small delay

      return () => {
        carouselElement.removeEventListener("scroll", handleScroll)
        clearTimeout(initialScrollTimeout)
      }
    }
  }, [handleScroll, scrollToItem, activeIndex]) // Dependencies for useEffect

  // Function to determine card style based on its position relative to activeIndex
  const getCardStyle = (index: number) => {
    const distance = Math.abs(index - activeIndex)
    let opacity = 1
    let scale = 1
    let zIndex = 1

    if (distance === 0) {
      // Active card
      opacity = 1
      scale = 1.15 // Increased zoom effect
      zIndex = 2
    } else if (distance === 1) {
      // Adjacent cards
      opacity = 0.7
      scale = 0.9
      zIndex = 1
    } else {
      // Farther cards
      opacity = 0.4
      scale = 0.8
      zIndex = 0
    }

    return {
      opacity,
      transform: `scale(${scale})`,
      zIndex,
      transition: "all 0.5s ease-in-out", // Increased transition duration
      filter: distance > 0 ? "grayscale(50%)" : "none", // Add grayscale for non-active
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-b from-orange-500 to-orange-500/80 text-white py-16 md:py-24"
        >
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Fast & Affordable WiFi for Students</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Get connected with SkyFi's unlimited WiFi packages designed specifically for hostel residents.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              {user ? (
                <Button
                  size="lg"
                  onClick={() => router.push("/packages")}
                  className="bg-white text-orange-500 hover:bg-white/90"
                >
                  View Packages
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => router.push("/auth/login")}
                    className="bg-white text-orange-500 hover:bg-white/90"
                  >
                    Login
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push("/auth/signup")}
                    className="border-white text-white hover:bg-white/10"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-background"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkyFi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border"
              >
                <Wifi className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Connection</h3>
                <p className="text-muted-foreground">Enjoy high-speed internet for streaming, gaming, and studying.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border"
              >
                <Shield className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Network</h3>
                <p className="text-muted-foreground">Our network is protected with the latest security protocols.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border"
              >
                <Clock className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
                <p className="text-muted-foreground">Connect anytime with our always-on WiFi service.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border"
              >
                <CreditCard className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Flexible Packages</h3>
                <p className="text-muted-foreground">
                  Choose from daily, weekly, or monthly packages to fit your needs.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Gaming/VR Section with Image */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-orange-50 dark:bg-gray-800"
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-orange-800 dark:text-orange-300">
                  Experience Next-Level Entertainment
                </h2>
                <p className="text-lg mb-6 text-orange-700 dark:text-orange-400">
                  With SkyFi's high-speed connection, enjoy seamless gaming, virtual reality experiences, and HD
                  streaming without interruptions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
                      ✓
                    </span>
                    <span className="text-orange-700 dark:text-orange-400">Low latency for competitive gaming</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
                      ✓
                    </span>
                    <span className="text-orange-700 dark:text-orange-400">Smooth VR experiences</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
                      ✓
                    </span>
                    <span className="text-orange-700 dark:text-orange-400">Buffer-free HD streaming</span>
                  </li>
                </ul>
              </motion.div>
              <motion.div
                className="md:w-1/2 flex justify-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img src="/images/man-vr.png" alt="VR Experience" className="max-h-96 object-contain" />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Pricing Preview - Updated Carousel */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-muted/50"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Simple, Affordable Pricing</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Choose the package that works best for you with no hidden fees or contracts.
            </p>
            <div className="relative flex items-center justify-center">
              {/* Carousel Container - Fixed width to show 3 cards, scrollable */}
              <div
                ref={carouselRef}
                // This width ensures 3 cards are visible (3*300px + 2*32px gaps = 964px)
                // and allows horizontal scrolling if there are more than 3 cards.
                className="w-[964px] overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
              >
                <div className="flex space-x-8">
                  {carouselPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      className="flex-shrink-0 w-[300px] h-[400px] flex flex-col snap-center" // Fixed width and portrait height, snap-center
                      style={getCardStyle(index)}
                      whileHover={{ scale: index === activeIndex ? 1.17 : 0.92 }} // Slight hover effect, adjusted for new active scale
                      whileTap={{ scale: index === activeIndex ? 1.13 : 0.88 }} // Slight tap effect, adjusted for new active scale
                      onClick={() => scrollToItem(index)} // Allow clicking cards to make them active
                    >
                      <div
                        className={`bg-card p-6 rounded-lg shadow-sm border flex-grow ${pkg.popular ? "border-2 border-orange-500" : "border-border"} relative`}
                      >
                        {pkg.popular && (
                          <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                            POPULAR
                          </div>
                        )}
                        <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                        <p className="text-3xl font-bold mb-4">
                          {pkg.price} <span className="text-base font-normal text-muted-foreground">UGX</span>
                        </p>
                        <p className="text-muted-foreground mb-6">{pkg.description}</p>
                        <ul className="space-y-2 mb-6">
                          {pkg.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center">
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Navigation Buttons (removed as per request) */}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {carouselPackages.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === activeIndex ? "bg-orange-500" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => scrollToItem(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="text-center mt-10">
              <Button
                size="lg"
                onClick={() => router.push(user ? "/packages" : "/auth/signup")}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {user ? "View All Packages" : "Get Started"}
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Streaming Section with Image */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-orange-50 dark:bg-gray-800"
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div
                className="md:w-1/2 flex justify-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img src="/images/student-streaming.png" alt="Student Streaming" className="max-h-96 object-contain" />
              </motion.div>

              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-orange-800 dark:text-orange-300">Stream Without Limits</h2>
                <p className="text-lg mb-6 text-orange-700 dark:text-orange-400">
                  Whether you're studying with music, watching lectures online, or catching up on your favorite shows,
                  SkyFi delivers reliable speed when you need it most.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
                      ✓
                    </span>
                    <span className="text-orange-700 dark:text-orange-400">High-quality music streaming</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
                      ✓
                    </span>
                    <span className="text-orange-700 dark:text-orange-400">Video calls without freezing</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
                      ✓
                    </span>
                    <span className="text-orange-700 dark:text-orange-400">Download lecture materials quickly</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
