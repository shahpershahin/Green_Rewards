// app/citizen/redemptions/page.js
// Citizen Redemption History & Voucher Tokens Page
// Demonstrates: Voucher token display, status tracking (Requested, Accepted, Rejected), and merchant details

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function CitizenRedemptionsPage() {
  const { token } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      try {
        const res = await fetch("/api/citizen/redemptions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRedemptions(data.redemptions || []);
        }
      } catch (err) {
        console.error("Failed to load redemptions:", err);
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
                My Claimed Redemptions
              </h1>
              <p className="text-xs text-gray-600">
                Present your unique Voucher ID to the merchant at checkout to redeem your store discount.
              </p>
            </div>
            <Link href="/citizen/rewards">
              <Button variant="primary" size="sm">
                + Browse More Offers
              </Button>
            </Link>
          </div>

          <Card>
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">Loading redemptions...</div>
            ) : redemptions.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <span className="text-3xl">🎟️</span>
                <p className="text-sm font-semibold text-gray-700">No vouchers claimed yet</p>
                <Link href="/citizen/rewards">
                  <Button variant="primary" size="sm">
                    Browse Available Offers
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf7] text-gray-600 border-b border-[#e2ece9]">
                    <tr>
                      <th className="py-3 px-4 font-semibold uppercase">Voucher Token</th>
                      <th className="py-3 px-4 font-semibold uppercase">Offer & Merchant</th>
                      <th className="py-3 px-4 font-semibold uppercase">Discount</th>
                      <th className="py-3 px-4 font-semibold uppercase">Coins Used</th>
                      <th className="py-3 px-4 font-semibold uppercase">Status</th>
                      <th className="py-3 px-4 font-semibold uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {redemptions.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                            {r.id}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#1b4332]">{r.offerTitle}</div>
                          <div className="text-[11px] text-gray-500">{r.businessName}</div>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-[#2d6a4f]">{r.discountAmount}</td>
                        <td className="py-3 px-4 font-bold text-amber-900">🪙 {r.coinsUsed}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              r.status === "Accepted"
                                ? "success"
                                : r.status === "Rejected"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {r.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(r.createdAt).toLocaleDateString()}
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
