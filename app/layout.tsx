import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { AppStateProvider } from "@/lib/app-state"
import { ToasterProvider } from "@/hooks/use-toast" // Import the custom ToasterProvider from your hook
import { Toaster } from "@/components/toaster" // Import the new Toaster component

import * as Sentry from '@sentry/nextjs';
  import type { Metadata } from 'next';

// Add or edit your "generateMetadata" to include the Sentry trace data: 
export function generateMetadata(): Metadata {
  return {
   // ... your existing metadata 
     other: { 
       ...Sentry.getTraceData()
     }
  };
} 
      

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
              <ToasterProvider>
                {" "}
                {/* Wrap the entire application with your custom ToasterProvider */}
                {children}
                <Toaster /> {/* Render the Toaster component here */}
              </ToasterProvider>
            </AppStateProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
