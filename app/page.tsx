"use client" // This component uses client-side hooks like useRouter and useState

import { useRouter } from "next/navigation" // Replaced useNavigate from react-router-dom
import { Button } from "@/components/ui/button"
import Header from "@/components/header" // Adjusted import path
import Footer from "@/components/footer" // Adjusted import path
import { Wifi, Shield, Clock, CreditCard, Check } from "lucide-react" // Added Check icon
import { useAuth } from "@/components/auth-provider" // Replaced fine.auth.useSession()
import { motion } from "framer-motion" // Ensure motion is imported for animations

const HomePage = () => {
  const router = useRouter()
  const { user } = useAuth() // Get user from your existing AuthProvider

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-orange-500 to-orange-500/80 text-white py-16 md:py-24">
          {" "}
          {/* Adjusted colors to match existing theme */}
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
                {" "}
                {/* Added border and shadow-md */}
                <Wifi className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Connection</h3>
                <p className="text-muted-foreground">Enjoy high-speed internet for streaming, gaming, and studying.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border">
                {" "}
                {/* Added border and shadow-md */}
                <Shield className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Network</h3>
                <p className="text-muted-foreground">Our network is protected with the latest security protocols.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border">
                {" "}
                {/* Added border and shadow-md */}
                <Clock className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
                <p className="text-muted-foreground">Connect anytime with our always-on WiFi service.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border">
                {" "}
                {/* Added border and shadow-md */}
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

        {/* Pricing Preview */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Simple, Affordable Pricing</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Choose the package that works best for you with no hidden fees or contracts.
            </p>
            {/* Carousel Container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory space-x-8 pb-4 max-w-5xl mx-auto scrollbar-hide">
              <div className="flex-shrink-0 w-full md:w-1/3 snap-center">
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                  <h3 className="text-xl font-bold mb-2">Daily</h3>
                  <p className="text-3xl font-bold mb-4">
                    1,500 <span className="text-base font-normal text-muted-foreground">UGX</span>
                  </p>
                  <p className="text-muted-foreground mb-6">Perfect for short-term needs</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Unlimited data
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      24 hours access
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-1/3 snap-center">
                <div className="bg-card p-6 rounded-lg shadow-sm border-2 border-orange-500 relative">
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    POPULAR
                  </div>
                  <h3 className="text-xl font-bold mb-2">Weekly</h3>
                  <p className="text-3xl font-bold mb-4">
                    8,500 <span className="text-base font-normal text-muted-foreground">UGX</span>
                  </p>
                  <p className="text-muted-foreground mb-6">Great value for regular users</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Unlimited data
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />7 days access
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Save 20% vs daily
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-1/3 snap-center">
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                  <h3 className="text-xl font-bold mb-2">Monthly</h3>
                  <p className="text-3xl font-bold mb-4">
                    35,000 <span className="text-base font-normal text-muted-foreground">UGX</span>
                  </p>
                  <p className="text-muted-foreground mb-6">Best value for long-term</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Unlimited data
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      30 days access
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Save 30% vs daily
                    </li>
                  </ul>
                </div>
              </div>
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
          {" "}
          {/* Changed to match Gaming/VR section */}
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
                <h2 className="text-3xl font-bold mb-4 text-orange-800 dark:text-orange-300">
                  {" "}
                  {/* Changed to orange */}
                  Stream Without Limits
                </h2>
                <p className="text-lg mb-6 text-orange-700 dark:text-orange-400">
                  {" "}
                  {/* Changed to orange */}
                  Whether you're studying with music, watching lectures online, or catching up on your favorite shows,
                  SkyFi delivers reliable speed when you need it most.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
                      {" "}
                      {/* Changed to orange */}✓
                    </span>
                    <span className="text-orange-700 dark:text-orange-400">High-quality music streaming</span>{" "}
                    {/* Changed to orange */}
                  </li>
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
                      {" "}
                      {/* Changed to orange */}✓
                    </span>
                    <span className="text-orange-700 dark:text-orange-400">Video calls without freezing</span>{" "}
                    {/* Changed to orange */}
                  </li>
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
                      {" "}
                      {/* Changed to orange */}✓
                    </span>
                    <span className="text-orange-700 dark:text-orange-400">Download lecture materials quickly</span>{" "}
                    {/* Changed to orange */}
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
