// components/Navbar.js
// Global Navigation Bar Component
// Demonstrates:
// 1. "use client" for client-side interactivity
// 2. Integration with AuthContext and WalletContext
// 3. Role-based navigation buttons & live coin balance counter

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { balance } = useWallet();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Determine user dashboard link based on role
  const getDashboardHref = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "BUSINESS") return "/business/dashboard";
    return "/citizen/dashboard";
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Categories", href: "/categories" },
    { label: "Partner Businesses", href: "/businesses" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2ece9] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand Name */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 text-xl font-extrabold text-[#1b4332] tracking-tight hover:opacity-90 transition-opacity"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1b4332] text-emerald-300 text-lg shadow-xs">
              🌱
            </span>
            <span>
              Green<span className="text-[#52b788]">Rewards</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-[#1b4332] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Auth State / Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Live Citizen Coin Badge */}
                {user.role === "CITIZEN" && (
                  <Link href="/citizen/wallet">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors">
                      🪙 {balance} Coins
                    </span>
                  </Link>
                )}

                {/* Dashboard Shortcut */}
                <Link href={getDashboardHref()}>
                  <Button variant="secondary" size="sm">
                    {user.name.split(" ")[0]} ({user.role})
                  </Button>
                </Link>

                {/* Logout Button */}
                <Button variant="outline" size="sm" onClick={logout}>
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 hover:text-[#1b4332] hover:bg-emerald-50 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <span className="text-xl font-bold">✕</span>
              ) : (
                <span className="text-xl font-bold">☰</span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e2ece9] bg-white px-4 pt-3 pb-6 flex flex-col gap-3 shadow-lg">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                onClick={closeMobileMenu}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#1b4332]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            {user ? (
              <>
                <div className="px-3 py-2 text-xs text-gray-600 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span>Logged in as <strong>{user.name}</strong></span>
                  <Badge variant="info">{user.role}</Badge>
                </div>
                <Link href={getDashboardHref()} onClick={closeMobileMenu}>
                  <Button variant="primary" size="md" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="md" onClick={() => { closeMobileMenu(); logout(); }} className="w-full">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMobileMenu} className="w-full">
                  <Button variant="outline" size="md" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/register" onClick={closeMobileMenu} className="w-full">
                  <Button variant="primary" size="md" className="w-full">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
