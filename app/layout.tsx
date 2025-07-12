import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { AppStateProvider } from "@/lib/app-state";
import { ToasterProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/toaster";

import * as Sentry from '@sentry/nextjs';
import type { Metadata } from 'next';

// ✅ Keep only generateMetadata — include Sentry trace data
export function generateMetadata(): Metadata {
  return {
    title: "SkyFi - Fast & Affordable WiFi for Students",
    description: "Get connected with SkyFi's unlimited WiFi packages designed specifically for hostel residents.",
    generator: 'v0.dev',
    other: {
      ...Sentry.getTraceData()
    }
  };
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="skyfi-theme-preference"
          themes={["light", "dark", "system"]}
        >
          <AuthProvider>
            <AppStateProvider>
              <ToasterProvider>
                {children}
                <Toaster />
              </ToasterProvider>
            </AppStateProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
