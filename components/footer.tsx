"use client"

import Link from "next/link"
import SkyFiLogo from "./skyfi-logo"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-orange-500 to-orange-500/80 text-white py-8 md:py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center md:items-start">
          <Link className="flex items-center gap-2 mb-4" href="#">
            <SkyFiLogo width={120} height={40} /> {/* Reduced logo size */}
            <span className="sr-only">SkyFi</span>
          </Link>
          <p className="text-center md:text-left max-w-xs">
            Your reliable partner for fast and affordable student WiFi.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <nav className="flex flex-col gap-2 text-center md:text-left">
            <Link className="hover:underline" href="/">
              Home
            </Link>
            <Link className="hover:underline" href="/packages">
              Packages
            </Link>
            <Link className="hover:underline" href="/dashboard">
              Dashboard
            </Link>
            <Link className="hover:underline" href="/payment">
              Payment
            </Link>
          </nav>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-center md:text-left">Email: support@skyfi.com</p>
          <p className="text-center md:text-left">Phone: +256 771 234 567</p>
          <p className="text-center md:text-left">Address: Makerere University, Kampala, Uganda</p>
          <div className="flex gap-4 mt-4">
            <Link aria-label="Facebook" href="#">
              <Facebook className="h-6 w-6 hover:text-gray-200" />
            </Link>
            <Link aria-label="Twitter" href="#">
              <Twitter className="h-6 w-6 hover:text-gray-200" />
            </Link>
            <Link aria-label="Instagram" href="#">
              <Instagram className="h-6 w-6 hover:text-gray-200" />
            </Link>
            <Link aria-label="LinkedIn" href="#">
              <Linkedin className="h-6 w-6 hover:text-gray-200" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-8 pt-8 border-t border-white/20 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} SkyFi. All rights reserved. Made with ❤️ for students.</p>
      </div>
    </footer>
  )
}
