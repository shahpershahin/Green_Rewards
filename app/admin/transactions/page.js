// app/admin/transactions/page.js
// Admin Platform-wide Transaction Audit Log Page
// Demonstrates: Full immutable ledger audit inspection

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function AdminTransactionsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      try {
        const res = await fetch("/api/admin/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error("Failed to load transactions:", err);
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1b4332]">
                Platform Transaction Ledger
              </h1>
              <p className="text-xs text-gray-600">
                Centralized audit trail of every Green Coin minted upon approval or redeemed at merchant stores.
              </p>
            </div>
            <Badge variant="info">Audit Verified</Badge>
          </div>

          <Card>
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">Loading audit ledger...</div>
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">No transactions recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf7] text-gray-600 border-b border-[#e2ece9]">
                    <tr>
                      <th className="py-3 px-4 font-semibold uppercase">Txn ID</th>
                      <th className="py-3 px-4 font-semibold uppercase">Citizen</th>
                      <th className="py-3 px-4 font-semibold uppercase">Type</th>
                      <th className="py-3 px-4 font-semibold uppercase">Coin Amount</th>
                      <th className="py-3 px-4 font-semibold uppercase">Ref / Link</th>
                      <th className="py-3 px-4 font-semibold uppercase">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((t) => {
                      const isCredit = t.amount > 0;
                      return (
                        <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono text-gray-500">{t.id}</td>
                          <td className="py-3 px-4 font-bold text-gray-800">
                            {t.citizenName}
                            <span className="block font-normal text-[10px] text-gray-400">{t.citizenEmail}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                isCredit
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {t.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-extrabold text-sm">
                            <span className={isCredit ? "text-emerald-700" : "text-amber-700"}>
                              {isCredit ? `+${t.amount}` : t.amount} Coins
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-gray-500">
                            {t.contributionId || t.redemptionId || "—"}
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {new Date(t.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
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
