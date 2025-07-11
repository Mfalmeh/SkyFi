"use client" // This component uses client-side hooks like useRouter and useState

import { useRouter } from "next/navigation" // Replaced useNavigate from react-router-dom
import { Button } from "@/components/ui/button"
import Header from "@/components/header" // Adjusted import path
import Footer from "@/components/footer" // Adjusted import path
import { Wifi, Shield, Clock, CreditCard, Check, ChevronLeft, ChevronRight } from "lucide-react" // Added Check icon and carousel navigation icons
import { useAuth } from "@/components/auth-provider" // Replaced fine.auth.useSession()
import { motion } from "framer-motion" // Ensure motion is imported for animations
import { useState, useRef, useEffect } from "react" // Import React hooks

// Define packages data locally for the carousel
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
  // Added more packages to demonstrate carousel functionality with more items
  {
    id: "quarterly",
    name: "Quarterly",
    price: "90,000",
    duration: "90 days",
    description: "Long-term savings",
    features: ["Unlimited data", "90 days access", "Save 40% vs daily"],
    popular: false,
  },
  {
    id: "annual",
    name: "Annual",
    price: "300,000",
    duration: "365 days",
    description: "Ultimate savings",
    features: ["Unlimited data", "365 days access", "Save 50% vs daily"],
    popular: false,
  },
]

const HomePage = () => {
  const router = useRouter()
  const { user } = useAuth()

  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0) // Start with the first item active

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft
      const itemWidth = carouselRef.current.children[0]?.clientWidth || 0
      // Calculate the index of the item that is most in view
      // This assumes items have equal width and are snapped.
      const newIndex = Math.round(scrollLeft / itemWidth)
      setActiveIndex(newIndex)
    }
  }

  useEffect(() => {
    const carouselElement = carouselRef.current
    if (carouselElement) {
      carouselElement.addEventListener("scroll", handleScroll)
      // Initial set of active index
      handleScroll()
      return () => {
        carouselElement.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const scrollToItem = (index: number) => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.children[0]?.clientWidth || 0
      carouselRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      })
      setActiveIndex(index)
    }
  }

  const handlePrev = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = Math.max(0, prevIndex - 1)
      scrollToItem(newIndex)
      return newIndex
    })
  }

  const handleNext = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = Math.min(carouselPackages.length - 1, prevIndex + 1)
      scrollToItem(newIndex)
      return newIndex
    })
  }

  // Function to determine card style based on its position relative to activeIndex
  const getCardStyle = (index: number) => {
    const distance = Math.abs(index - activeIndex)
    let opacity = 1
    let scale = 1
    let zIndex = 1 // Default z-index

    if (distance === 1) {
      opacity = 0.7
      scale = 0.9
      zIndex = 0 // Side items are behind
    } else if (distance >= 2) {
      opacity = 0.4
      scale = 0.8
      zIndex = -1 // Further items are even more behind
    }

    // For the active item, ensure it's always on top
    if (index === activeIndex) {
      zIndex = 2
    }

    return {
      opacity,
      transform: `scale(${scale})`,
      zIndex,
      transition: "all 0.3s ease-in-out",
      filter: distance > 0 ? "grayscale(50%)" : "none", // Add grayscale for non-active
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-orange-500 to-orange-500/80 text-white py-16 md:py-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Fast & Affordable WiFi for Students</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Get connected with SkyFi's unlimited WiFi packages designed specifically for hostel residents.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
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
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkyFi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border">
                <Wifi className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Connection</h3>
                <p className="text-muted-foreground">Enjoy high-speed internet for streaming, gaming, and studying.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border">
                <Shield className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Network</h3>
                <p className="text-muted-foreground">Our network is protected with the latest security protocols.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border">
                <Clock className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
                <p className="text-muted-foreground">Connect anytime with our always-on WiFi service.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border">
                <CreditCard className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Flexible Packages</h3>
                <p className="text-muted-foreground">
                  Choose from daily, weekly, or monthly packages to fit your needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gaming/VR Section with Image */}
        <section className="py-16 bg-orange-50 dark:bg-gray-800">
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
        </section>

        {/* Pricing Preview - Updated Carousel */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Simple, Affordable Pricing</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Choose the package that works best for you with no hidden fees or contracts.
            </p>
            <div className="relative flex items-center justify-center">
              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="flex overflow-x-scroll snap-x snap-mandatory space-x-8 pb-4 max-w-5xl mx-auto scrollbar-hide"
                style={{ scrollPadding: "0 25%" }} // Adjust scroll padding to center items
              >
                {carouselPackages.map((pkg, index) => (
                  <div
                    key={pkg.id}
                    className="flex-shrink-0 snap-center w-full md:w-1/3" // Keep responsive width
                    style={getCardStyle(index)}
                  >
                    <div
                      className={`bg-card p-6 rounded-lg shadow-sm border ${pkg.popular ? "border-2 border-orange-500" : "border-border"} relative`}
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
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md z-10"
                onClick={handlePrev}
                disabled={activeIndex === 0}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md z-10"
                onClick={handleNext}
                disabled={activeIndex === carouselPackages.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next</span>
              </Button>
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
        </section>

        {/* Streaming Section with Image */}
        <section className="py-16 bg-orange-50 dark:bg-gray-800">
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
                whileInView={{ opacity: 1, x: 0 }}
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
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
</merged_code>
