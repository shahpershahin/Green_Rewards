// components/Footer.js
// Global Footer Component
// Demonstrates: Functional Component, Declarative Links, and Semantic HTML5 <footer>

import Link from "next/link";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-[#1b4332] text-white mt-auto border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Project Mission */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-800 text-emerald-300">
                🌱
              </span>
              <span>Green<span className="text-[#52b788]">Rewards</span></span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Smart waste segregation and citizen incentive platform empowering households to separate waste, earn verified Green Coins, and support eco-friendly local businesses.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-emerald-200 uppercase tracking-wider">
              Navigation
            </h4>
            <Link href="/" className="text-xs text-emerald-100/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/how-it-works" className="text-xs text-emerald-100/80 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/categories" className="text-xs text-emerald-100/80 hover:text-white transition-colors">
              Waste Categories
            </Link>
            <Link href="/businesses" className="text-xs text-emerald-100/80 hover:text-white transition-colors">
              Partner Businesses
            </Link>
            <Link href="/about" className="text-xs text-emerald-100/80 hover:text-white transition-colors">
              About Project
            </Link>
          </div>

          {/* User Portals */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-emerald-200 uppercase tracking-wider">
              User Portals
            </h4>
            <Link href="/login" className="text-xs text-emerald-100/80 hover:text-white transition-colors">
              Citizen Portal
            </Link>
            <Link href="/login" className="text-xs text-emerald-100/80 hover:text-white transition-colors">
              Administrator Portal
            </Link>
            <Link href="/login" className="text-xs text-emerald-100/80 hover:text-white transition-colors">
              Business Portal
            </Link>
            <Link href="/register" className="text-xs text-emerald-100/80 hover:text-white transition-colors">
              Create New Account
            </Link>
          </div>

          {/* Academic & Syllabus Context */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-emerald-200 uppercase tracking-wider">
              Course Details
            </h4>
            <p className="text-xs text-emerald-100/80">
              <strong>Course:</strong> B.Tech (Semester 3)
            </p>
            <p className="text-xs text-emerald-100/80">
              <strong>Subject:</strong> React.js & Next.js Web Development
            </p>
            <p className="text-xs text-emerald-100/80">
              <strong>Architecture:</strong> Next.js App Router, Tailwind CSS, REST Route Handlers
            </p>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/70 gap-2">
          <p>&copy; {currentYear} Green Rewards. Academic Project Implementation.</p>
          <p>Encouraging cleaner cities through digital incentives.</p>
        </div>
      </div>
    </footer>
  );
}
