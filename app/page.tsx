"use client"

import { useRouter } from "next/navigation"
import Image from "next/image" // Import the Image component
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Wifi, Shield, Clock, CreditCard, Check } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"
import { useState } from "react"
import Autoplay from "embla-carousel-autoplay"

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
  const [api, setApi] = useState<CarouselApi>()

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow overflow-x-hidden">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-b from-orange-500 to-orange-500/80 text-white py-16 md:py-24 overflow-x-hidden"
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
          className="py-16 bg-background overflow-x-hidden"
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

        {/* Gaming/VR Section (Image removed) */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-orange-50 dark:bg-gray-800 relative overflow-x-hidden" // Added relative for absolute positioning of new image
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
                {/* Removed image placeholder */}
              </motion.div>
            </div>
          </div>
          {/* New image at the bottom left of this section */}
          <div className="absolute bottom-0 right-0 w-40 h-40 overflow-hidden">
            <Image
              src="/images/man-vr-bottom-left.png"
              alt="Man in VR headset"
              fill
              style={{ objectFit: "contain", objectPosition: "bottom left" }} // Position at bottom left
              sizes="100px" // Small size for optimization
              priority
            />
          </div>
        </motion.section>

        {/* Pricing Preview - Updated Carousel */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-muted/50 overflow-x-hidden"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Simple, Affordable Pricing</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Choose the package that works best for you with no hidden fees or contracts.
            </p>
            
            {/* New Carousel Implementation */}
            <div className="relative max-w-5xl mx-auto">
              <Carousel
                setApi={setApi}
                className="w-full"
                opts={{
                  align: "center",
                  loop: true,
                  startIndex: 1, // Start with the "Popular" weekly package
                }}
                plugins={[
                  Autoplay({
                    delay: 5000,
                    stopOnInteraction: true,
                  })
                ]}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {carouselPackages.map((pkg, index) => (
                    <CarouselItem key={pkg.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <motion.div
                        className="p-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`bg-card p-6 rounded-lg shadow-lg border h-[400px] flex flex-col ${
                            pkg.popular ? "border-2 border-orange-500 shadow-orange-500/25" : "border-border"
                          } relative`}
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
                          <ul className="space-y-2 mb-6 flex-grow">
                            {pkg.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center">
                                <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
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

        {/* Streaming Section (Image removed) */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-orange-50 dark:bg-gray-800 overflow-x-hidden"
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
                {/* Removed image placeholder */}
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
