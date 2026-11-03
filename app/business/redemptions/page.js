// app/business/redemptions/page.js
// Business Redemptions Verification Queue
// Demonstrates: Voucher code lookup, merchant acceptance/rejection, and automated refund handling

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function BusinessRedemptionsPage() {
  const { token } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadRedemptions = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("/api/business/redemptions", {
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
  };

  useEffect(() => {
    loadRedemptions();
  }, [token]);

  const handleUpdateStatus = async (redemptionId, newStatus) => {
    setActionMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/business/redemptions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ redemptionId, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setActionMsg(`Voucher ${newStatus.toLowerCase()} successfully.`);
      await loadRedemptions();
    } catch (err) {
      setErrorMsg(err.message || "Failed to update redemption status.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["BUSINESS"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="BUSINESS" />

        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1b4332]">
              Customer Voucher Verification
            </h1>
            <p className="text-xs text-gray-600">
              When a citizen presents a Green Rewards token at checkout, verify and accept the voucher.
            </p>
          </div>

          {actionMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold">
              ✅ {actionMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <Card>
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">Loading redemptions queue...</div>
            ) : redemptions.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">
                No redemption requests received yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf7] text-gray-600 border-b border-[#e2ece9]">
                    <tr>
                      <th className="py-3 px-4 font-semibold uppercase">Voucher Token</th>
                      <th className="py-3 px-4 font-semibold uppercase">Customer</th>
                      <th className="py-3 px-4 font-semibold uppercase">Offer</th>
                      <th className="py-3 px-4 font-semibold uppercase">Coins Paid</th>
                      <th className="py-3 px-4 font-semibold uppercase">Status</th>
                      <th className="py-3 px-4 font-semibold uppercase">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {redemptions.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-900">
                          {r.id}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-800">
                          {r.citizenName}
                          <span className="block font-normal text-[10px] text-gray-400">{r.citizenEmail}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#1b4332]">{r.offerTitle}</div>
                          <div className="text-xs text-emerald-700 font-extrabold">{r.discountAmount}</div>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-amber-900">🪙 {r.coinsUsed}</td>
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
                        <td className="py-3 px-4">
                          {r.status === "Requested" ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleUpdateStatus(r.id, "Accepted")}
                              >
                                Accept & Honor
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(r.id, "Rejected")}
                                className="text-rose-700 border-rose-300"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-gray-500">
                              {r.status === "Accepted" ? "Voucher Honored" : "Voucher Voided"}
                            </span>
                          )}
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
