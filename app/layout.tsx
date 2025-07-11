import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { AppStateProvider } from "@/lib/app-state"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SkyFi - Fast & Affordable WiFi for Students",
  description: "Get connected with SkyFi's unlimited WiFi packages designed specifically for hostel residents.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="skyfi-theme"
        >
          <AuthProvider>
            <AppStateProvider>
              {children}
              <Toaster />
            </AppStateProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
