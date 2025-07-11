import SkyFiLogo from "@/components/skyfi-logo"

export default function Footer() {
  return (
    <footer className="bg-orange-500 dark:bg-orange-600 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <SkyFiLogo width={140} height={45} animate={false} />
            <p className="text-white/90 max-w-md">
              Providing affordable and reliable WiFi solutions for students in hostels.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <nav className="space-y-2">
              <div>
                <a href="/" className="text-white/90 hover:text-white">
                  {" "}
                  {/* Changed to "/" */}
                  Home
                </a>
              </div>
              <div>
                <a href="/packages" className="text-white/90 hover:text-white">
                  Packages
                </a>
              </div>
              <div>
                <a href="/dashboard" className="text-white/90 hover:text-white">
                  Dashboard
                </a>
              </div>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <div className="space-y-1 text-white/90">
              <p>📞 +256 700 000000</p>
              <p>✉️ support@skyfi.com</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 text-center text-white/90">
            <p>&copy; 2025 SkyFi. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
