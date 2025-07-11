"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import SkyFiLogo from "./skyfi-logo"
import { useAuth } from "@/components/auth-provider"

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2" href="/">
          <SkyFiLogo width={100} height={35} /> {/* Reduced logo size */}
          <span className="sr-only">SkyFi</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link className="hover:text-primary" href="/">
            Home
          </Link>
          <Link className="hover:text-primary" href="/packages">
            Packages
          </Link>
          <Link className="hover:text-primary" href="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-primary" href="/payment">
            Payment
          </Link>
          {user ? (
            <Button onClick={signOut} variant="ghost">
              Logout
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
          )}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden bg-transparent" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 p-4">
              <Link className="hover:text-primary" href="/">
                Home
              </Link>
              <Link className="hover:text-primary" href="/packages">
                Packages
              </Link>
              <Link className="hover:text-primary" href="/dashboard">
                Dashboard
              </Link>
              <Link className="hover:text-primary" href="/payment">
                Payment
              </Link>
              {user ? (
                <Button onClick={signOut} variant="ghost">
                  Logout
                </Button>
              ) : (
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
