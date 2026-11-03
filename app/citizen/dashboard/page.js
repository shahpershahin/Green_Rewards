// app/citizen/dashboard/page.js
// Citizen Dashboard Page
// Demonstrates: ProtectedRoute, PortalSidebar, StatCard metrics, and useEffect API fetching

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import StatCard from "@/components/StatCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function CitizenDashboardPage() {
  const { user, token } = useAuth();
  const { balance, refreshWallet } = useWallet();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent contributions
  useEffect(() => {
    async function loadData() {
      if (!token) return;
      try {
        const res = await fetch("/api/citizen/contributions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setContributions(data.contributions || []);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    refreshWallet();
  }, [token, refreshWallet]);

  // Derived metrics
  const totalSubmissions = contributions.length;
  const approvedSubmissions = contributions.filter((c) => c.verificationStatus === "Approved").length;
  const pendingSubmissions = contributions.filter((c) => c.verificationStatus === "Pending").length;

  return (
    <ProtectedRoute allowedRoles={["CITIZEN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <PortalSidebar role="CITIZEN" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-emerald-100/70 via-teal-50 to-emerald-100/70 p-6 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1b4332]">
                Hello, {user?.name}! 👋
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Keep up the great segregation work! Submit waste photographs to earn verified Green Coins.
              </p>
            </div>
            <Link href="/citizen/upload">
              <Button variant="accent" size="md" className="font-bold shrink-0">
                📸 Upload Waste Photo
              </Button>
            </Link>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Green Coins"
              value={balance}
              icon="🪙"
              subtitle="Ready to redeem"
              color="amber"
            />
            <StatCard
              title="Total Submissions"
              value={totalSubmissions}
              icon="📦"
              subtitle="All contributions"
              color="blue"
            />
            <StatCard
              title="Approved"
              value={approvedSubmissions}
              icon="✅"
              subtitle="Coins credited"
              color="emerald"
            />
            <StatCard
              title="Pending Review"
              value={pendingSubmissions}
              icon="⏳"
              subtitle="Awaiting admin check"
              color="purple"
            />
          </div>

          {/* Recent Contributions Section */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#1b4332]">
                Recent Waste Contributions
              </h2>
              <Link href="/citizen/contributions">
                <span className="text-xs font-semibold text-[#2d6a4f] hover:underline">
                  View All &rarr;
                </span>
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-gray-500">Loading contributions...</div>
            ) : contributions.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center gap-3">
                <span className="text-3xl">🌱</span>
                <p className="text-sm font-semibold text-gray-700">No waste contributions submitted yet</p>
                <p className="text-xs text-gray-500 max-w-sm">
                  Segregate household waste, take a photo, and earn your first Green Coins today!
                </p>
                <Link href="/citizen/upload">
                  <Button variant="primary" size="sm">
                    Submit First Contribution
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf7] text-gray-600 border-b border-[#e2ece9]">
                    <tr>
                      <th className="py-3 px-4 font-semibold uppercase">Category</th>
                      <th className="py-3 px-4 font-semibold uppercase">Quantity</th>
                      <th className="py-3 px-4 font-semibold uppercase">Status</th>
                      <th className="py-3 px-4 font-semibold uppercase">Reward</th>
                      <th className="py-3 px-4 font-semibold uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {contributions.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#1b4332] uppercase">
                          {item.categoryId}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.quantity}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              item.verificationStatus === "Approved"
                                ? "success"
                                : item.verificationStatus === "Rejected"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {item.verificationStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-900">
                          {item.verificationStatus === "Approved" ? `+${item.rewardCoins} Coins` : "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

        </div>
      </div>
    </ProtectedRoute>
  );
}
