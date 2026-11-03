// app/admin/citizens/page.js
// Admin Registered Citizens Directory Page
// Demonstrates: Tabular display of users, joined submission metrics, and wallet balances

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Card from "@/components/ui/Card";

export default function AdminCitizensPage() {
  const { token } = useAuth();
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      try {
        const res = await fetch("/api/admin/citizens", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCitizens(data.citizens || []);
        }
      } catch (err) {
        console.error("Failed to load citizens:", err);
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
          <div>
            <h1 className="text-2xl font-extrabold text-[#1b4332]">
              Registered Citizens
            </h1>
            <p className="text-xs text-gray-600">
              Directory of participating citizens, segregation submission counts, and current wallet balances.
            </p>
          </div>

          <Card>
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">Loading citizen directory...</div>
            ) : citizens.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">No registered citizens yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf7] text-gray-600 border-b border-[#e2ece9]">
                    <tr>
                      <th className="py-3 px-4 font-semibold uppercase">Citizen Name</th>
                      <th className="py-3 px-4 font-semibold uppercase">Email</th>
                      <th className="py-3 px-4 font-semibold uppercase">Total Submissions</th>
                      <th className="py-3 px-4 font-semibold uppercase">Approved</th>
                      <th className="py-3 px-4 font-semibold uppercase">Wallet Balance</th>
                      <th className="py-3 px-4 font-semibold uppercase">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {citizens.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">{c.name}</td>
                        <td className="py-3 px-4 text-gray-600">{c.email}</td>
                        <td className="py-3 px-4 font-semibold text-gray-800">{c.totalSubmissions}</td>
                        <td className="py-3 px-4 font-semibold text-emerald-700">{c.approvedSubmissions}</td>
                        <td className="py-3 px-4 font-extrabold text-amber-900">🪙 {c.walletBalance} Coins</td>
                        <td className="py-3 px-4 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
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
