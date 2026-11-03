// components/PortalSidebar.js
// Reusable Portal Navigation Sidebar
// Demonstrates: usePathname hook, Dynamic Active Styling, and Role-specific Navigation

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function PortalSidebar({ role = "CITIZEN" }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Links for Citizen Portal
  const citizenLinks = [
    { label: "Dashboard", href: "/citizen/dashboard", icon: "📊" },
    { label: "Upload Waste Photo", href: "/citizen/upload", icon: "📸" },
    { label: "My Contributions", href: "/citizen/contributions", icon: "📋" },
    { label: "Green Coin Wallet", href: "/citizen/wallet", icon: "🪙" },
    { label: "Redeem Offers", href: "/citizen/rewards", icon: "🎁" },
    { label: "My Redemptions", href: "/citizen/redemptions", icon: "🎟️" },
    { label: "Profile", href: "/citizen/profile", icon: "👤" },
  ];

  // Links for Admin Portal
  const adminLinks = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "Review Submissions", href: "/admin/submissions", icon: "🔍" },
    { label: "Waste Categories", href: "/admin/categories", icon: "🗂️" },
    { label: "Registered Citizens", href: "/admin/citizens", icon: "👥" },
    { label: "Partner Businesses", href: "/admin/businesses", icon: "🏪" },
    { label: "Transaction Ledger", href: "/admin/transactions", icon: "📜" },
  ];

  // Links for Business Portal
  const businessLinks = [
    { label: "Dashboard", href: "/business/dashboard", icon: "📊" },
    { label: "Manage Offers", href: "/business/offers", icon: "🏷️" },
    { label: "Verify Redemptions", href: "/business/redemptions", icon: "✅" },
    { label: "Store Profile", href: "/business/profile", icon: "🏪" },
  ];

  const links =
    role === "ADMIN" ? adminLinks : role === "BUSINESS" ? businessLinks : citizenLinks;

  return (
    <aside className="w-full md:w-64 shrink-0 bg-white rounded-2xl border border-[#e2ece9] p-4 shadow-xs flex flex-col gap-1">
      {/* User Mini Card */}
      {user && (
        <div className="p-3 mb-2 bg-[#f8faf7] rounded-xl border border-[#e2ece9]">
          <div className="text-xs text-gray-500 font-medium">Logged in as</div>
          <div className="font-bold text-[#1b4332] text-sm truncate">{user.name}</div>
          <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {user.role}
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#1b4332] text-white shadow-xs"
                  : "text-gray-700 hover:bg-emerald-50 hover:text-[#1b4332]"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
