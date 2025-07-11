import SkyFiLogo from "@/components/skyfi-logo"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <SkyFiLogo width={120} height={40} animate={false} /> {/* Reduced logo size */}
            <p className="text-white/90 max-w-md">
              Providing affordable and reliable WiFi solutions for students in hostels.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <nav className="space-y-2">
              <div>
                <a href="/" className="text-white/90 hover:text-white">
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
              <p>📞 +256 768 916395</p>
              <p>✉️ support@skyfi.co.ug</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 text-center text-white/90">
            <p>&copy; 2025 SkyFi. All rights reserved.</p>
            <p className="mt-1">Made with 🤍 by Churchill</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
