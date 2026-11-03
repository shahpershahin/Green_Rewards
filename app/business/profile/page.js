// app/business/profile/page.js
// Business Store Profile Page
// Demonstrates: Business account details, store metadata, and logout integration

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function BusinessProfilePage() {
  const { user, token, logout } = useAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      try {
        const res = await fetch("/api/business/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBusiness(data.business);
        }
      } catch (err) {
        console.error("Failed to load business profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={["BUSINESS"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="BUSINESS" />

        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1b4332]">
              Store Profile
            </h1>
            <p className="text-xs text-gray-600">
              Your registered local business identity on the Green Rewards platform.
            </p>
          </div>

          <Card className="flex flex-col gap-6 max-w-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-3xl">
                🏪
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1b4332]">
                  {business?.businessName || user?.name}
                </h2>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <div className="mt-1">
                  <Badge variant="success">Verified Partner Business</Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Store Address</span>
                <span className="font-medium text-gray-800 text-right">{business?.address || "City Market"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Store Description</span>
                <span className="font-medium text-gray-800 text-right max-w-xs">{business?.description || "Partner merchant"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Account Role</span>
                <span className="font-bold text-emerald-800">{user?.role}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={logout}>
                Log Out of Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
