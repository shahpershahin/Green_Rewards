// app/layout.js
// Root Layout for the Green Rewards Application
// Demonstrates:
// 1. Layout hierarchy in Next.js App Router
// 2. Component Composition: Wrapping all routes with Providers, Navbar, and Footer
// 3. Metadata export for SEO optimization

import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Green Rewards – Smart Waste Segregation & Citizen Incentive Platform",
  description: "Segregate household waste, upload verified photos, earn Green Coins, and redeem eco-discounts with local partner businesses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#f8faf7] text-[#1b261e] antialiased">
        <Providers>
          {/* Persistent Global Navigation */}
          <Navbar />

          {/* Dynamic Route Content */}
          <div className="flex-1">
            {children}
          </div>

          {/* Persistent Global Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
