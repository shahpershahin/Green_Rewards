// app/business/dashboard/page.js
// Business Portal Dashboard Page
// Demonstrates: Business role guard, partner store metrics, and quick redemption verification

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import StatCard from "@/components/StatCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function BusinessDashboardPage() {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      try {
        const res = await fetch("/api/business/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error("Failed to load business dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  const metrics = data?.metrics;
  const business = data?.business;

  return (
    <ProtectedRoute allowedRoles={["BUSINESS"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="BUSINESS" />

        <div className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1b4332]">
                {business?.businessName || "Business Dashboard"}
              </h1>
              <p className="text-xs text-gray-600">
                Manage your store discount vouchers and verify citizen Green Coin redemption requests.
              </p>
            </div>
            <Link href="/business/offers">
              <Button variant="primary" size="sm">
                + Create New Offer
              </Button>
            </Link>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Offers"
              value={metrics?.activeOffers ?? "—"}
              icon="🏷️"
              subtitle="Published vouchers"
              color="blue"
            />
            <StatCard
              title="Pending Requests"
              value={metrics?.pendingRequests ?? "—"}
              icon="⏳"
              subtitle="Requires token check"
              color="purple"
            />
            <StatCard
              title="Accepted Vouchers"
              value={metrics?.acceptedRedemptions ?? "—"}
              icon="✅"
              subtitle="Discounts honored"
              color="emerald"
            />
            <StatCard
              title="Total Coins Accepted"
              value={metrics?.totalCoinsAccepted ? `🪙 ${metrics.totalCoinsAccepted}` : "0"}
              icon="🪙"
              subtitle="Received from citizens"
              color="amber"
            />
          </div>

          {/* Quick Actions Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1b4332] mb-1">
                  Verify Citizen Redemption Tokens
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  When a customer presents a Green Rewards voucher ID at your billing counter, check and accept it here.
                </p>
              </div>
              <Link href="/business/redemptions">
                <Button variant="accent" size="sm" className="w-full">
                  Go to Verification Queue &rarr;
                </Button>
              </Link>
            </Card>

            <Card className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1b4332] mb-1">
                  Manage Store Offers
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  Specify how many Green Coins are required to unlock discounts on your products and services.
                </p>
              </div>
              <Link href="/business/offers">
                <Button variant="outline" size="sm" className="w-full">
                  View All Offers &rarr;
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
