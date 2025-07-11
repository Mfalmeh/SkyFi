import HeroSection from "@/components/hero-section"

export default async function Home() {
  // Always show hero section without Supabase session check to avoid refresh token errors
  return <HeroSection />
}
