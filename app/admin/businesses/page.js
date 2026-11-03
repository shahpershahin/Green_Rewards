// app/admin/businesses/page.js
// Admin Partner Businesses Directory Page
// Demonstrates: Tabular display of businesses, active offers, and coins accepted

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Card from "@/components/ui/Card";

export default function AdminBusinessesPage() {
  const { token } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      try {
        const res = await fetch("/api/admin/businesses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBusinesses(data.businesses || []);
        }
      } catch (err) {
        console.error("Failed to load businesses:", err);
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
              Participating Local Businesses
            </h1>
            <p className="text-xs text-gray-600">
              Directory of merchant partners offering discounts in exchange for citizen Green Coins.
            </p>
          </div>

          <Card>
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">Loading businesses...</div>
            ) : businesses.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">No partner businesses found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf7] text-gray-600 border-b border-[#e2ece9]">
                    <tr>
                      <th className="py-3 px-4 font-semibold uppercase">Business Name</th>
                      <th className="py-3 px-4 font-semibold uppercase">Address</th>
                      <th className="py-3 px-4 font-semibold uppercase">Owner Email</th>
                      <th className="py-3 px-4 font-semibold uppercase">Active Offers</th>
                      <th className="py-3 px-4 font-semibold uppercase">Vouchers Honored</th>
                      <th className="py-3 px-4 font-semibold uppercase">Total Coins Accepted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {businesses.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">{b.businessName}</td>
                        <td className="py-3 px-4 text-gray-600">{b.address}</td>
                        <td className="py-3 px-4 text-gray-500">{b.ownerEmail}</td>
                        <td className="py-3 px-4 font-semibold text-emerald-800">{b.activeOffersCount} Offers</td>
                        <td className="py-3 px-4 font-semibold text-gray-800">{b.totalRedemptionsCount}</td>
                        <td className="py-3 px-4 font-extrabold text-amber-900">🪙 {b.totalCoinsAccepted}</td>
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
