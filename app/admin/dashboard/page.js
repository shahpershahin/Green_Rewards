// app/admin/dashboard/page.js
// Administrator Dashboard Page
// Demonstrates: ProtectedRoute role guard (ADMIN), aggregated system stats, and pending queue

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

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      try {
        const [statsRes, subsRes] = await Promise.all([
          fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/admin/submissions?status=Pending", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }

        if (subsRes.ok) {
          const subsData = await subsRes.json();
          setPendingSubmissions(subsData.submissions || []);
        }
      } catch (err) {
        console.error("Admin dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="ADMIN" />

        <div className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1b4332]">
                Administrator Control Center
              </h1>
              <p className="text-xs text-gray-600">
                Monitor municipal waste contributions, verify photographs, and oversee reward distribution.
              </p>
            </div>
            <Link href="/admin/submissions">
              <Button variant="primary" size="sm">
                🔍 Review Submissions Queue ({stats?.pendingSubmissions || 0})
              </Button>
            </Link>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Registered Citizens"
              value={stats?.totalCitizens ?? "—"}
              icon="👥"
              subtitle="Active contributors"
              color="blue"
            />
            <StatCard
              title="Pending Reviews"
              value={stats?.pendingSubmissions ?? "—"}
              icon="⏳"
              subtitle="Needs verification"
              color="purple"
            />
            <StatCard
              title="Approved Submissions"
              value={stats?.approvedSubmissions ?? "—"}
              icon="✅"
              subtitle="Verified segregation"
              color="emerald"
            />
            <StatCard
              title="Coins Distributed"
              value={stats?.totalCoinsIssued ? `🪙 ${stats.totalCoinsIssued}` : "0"}
              icon="🪙"
              subtitle="Total reward credits"
              color="amber"
            />
          </div>

          {/* Pending Submissions Queue Preview */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1b4332]">
                  Pending Waste Submissions
                </h2>
                <p className="text-xs text-gray-500">Submissions awaiting photograph review and coin allocation</p>
              </div>
              <Link href="/admin/submissions">
                <Button variant="outline" size="sm">
                  Open Full Review Tool &rarr;
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-gray-500">Loading queue...</div>
            ) : pendingSubmissions.length === 0 ? (
              <div className="py-8 text-center text-xs text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                ✨ All submissions have been reviewed! No pending items in the queue.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf7] text-gray-600 border-b border-[#e2ece9]">
                    <tr>
                      <th className="py-3 px-4 font-semibold uppercase">Photo</th>
                      <th className="py-3 px-4 font-semibold uppercase">Citizen</th>
                      <th className="py-3 px-4 font-semibold uppercase">Category</th>
                      <th className="py-3 px-4 font-semibold uppercase">Quantity</th>
                      <th className="py-3 px-4 font-semibold uppercase">Reward Value</th>
                      <th className="py-3 px-4 font-semibold uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingSubmissions.slice(0, 5).map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={sub.imagePath}
                              alt="Waste sub"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/100x100?text=Waste";
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-800">{sub.citizenName}</div>
                          <div className="text-[11px] text-gray-500">{sub.citizenEmail}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#1b4332] uppercase">{sub.categoryName}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{sub.quantity}</td>
                        <td className="py-3 px-4 font-bold text-amber-900">
                          🪙 {sub.rewardCoins} Coins
                        </td>
                        <td className="py-3 px-4">
                          <Link href="/admin/submissions">
                            <Button variant="secondary" size="sm">
                              Review
                            </Button>
                          </Link>
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
