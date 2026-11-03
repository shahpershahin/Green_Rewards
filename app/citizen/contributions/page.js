// app/citizen/contributions/page.js
// Citizen Contribution History Page
// Demonstrates: Tabular Data Rendering, Status Badges, and Conditional Rejection Reason display

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function CitizenContributionsPage() {
  const { token } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Error loading contributions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={["CITIZEN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="CITIZEN" />

        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1b4332]">
                My Waste Contributions
              </h1>
              <p className="text-xs text-gray-600">
                Track verification status, review administrator feedback, and monitor earned Green Coins.
              </p>
            </div>
            <Link href="/citizen/upload">
              <Button variant="primary" size="sm">
                + New Contribution
              </Button>
            </Link>
          </div>

          <Card>
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">Loading contribution history...</div>
            ) : contributions.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <span className="text-3xl">🗑️</span>
                <p className="text-sm font-semibold text-gray-700">No contributions found</p>
                <Link href="/citizen/upload">
                  <Button variant="primary" size="sm">
                    Upload Your First Photo
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf7] text-gray-600 border-b border-[#e2ece9]">
                    <tr>
                      <th className="py-3 px-4 font-semibold uppercase">Waste Photo</th>
                      <th className="py-3 px-4 font-semibold uppercase">Category</th>
                      <th className="py-3 px-4 font-semibold uppercase">Quantity & Notes</th>
                      <th className="py-3 px-4 font-semibold uppercase">Status</th>
                      <th className="py-3 px-4 font-semibold uppercase">Reward</th>
                      <th className="py-3 px-4 font-semibold uppercase">Submitted On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {contributions.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-14 h-14 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={c.imagePath}
                              alt="Waste submission"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/100x100?text=Waste+Photo";
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#1b4332] uppercase">{c.categoryId}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-800">{c.quantity}</div>
                          {c.description && (
                            <div className="text-[11px] text-gray-500 max-w-xs truncate">{c.description}</div>
                          )}
                          {c.rejectionReason && (
                            <div className="text-[11px] text-rose-700 font-medium mt-1 bg-rose-50 p-1.5 rounded-md border border-rose-200">
                              Feedback: {c.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              c.verificationStatus === "Approved"
                                ? "success"
                                : c.verificationStatus === "Rejected"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {c.verificationStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-900">
                          {c.verificationStatus === "Approved" ? (
                            <span className="text-emerald-700 font-bold">+{c.rewardCoins} Coins</span>
                          ) : (
                            <span className="text-gray-400">Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString()}
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
