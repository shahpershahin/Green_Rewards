// app/business/offers/page.js
// Business Offers Management Page
// Demonstrates: Form submission with Zod validation, and dynamic card list update

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function BusinessOffersPage() {
  const { token } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredCoins, setRequiredCoins] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadOffers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("/api/business/offers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOffers(data.offers || []);
      }
    } catch (err) {
      console.error("Failed to load offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, [token]);

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setSaving(true);

    try {
      const res = await fetch("/api/business/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          requiredCoins: Number(requiredCoins),
          discountAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create offer");

      setSuccessMsg("New offer published successfully!");
      setTitle("");
      setDescription("");
      setRequiredCoins("");
      setDiscountAmount("");
      await loadOffers();
    } catch (err) {
      setErrorMsg(err.message || "Failed to save offer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["BUSINESS"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="BUSINESS" />

        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1b4332]">
              Manage Store Redemption Offers
            </h1>
            <p className="text-xs text-gray-600">
              Create and manage predefined discount vouchers that citizens can unlock with Green Coins.
            </p>
          </div>

          {/* Create Offer Card */}
          <Card>
            <h2 className="text-lg font-bold text-[#1b4332] mb-3">
              + Publish New Discount Offer
            </h2>

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold">
                ✅ {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateOffer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Offer Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Eco-Friendly Grocery Discount"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-[#1b4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Required Green Coins
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={requiredCoins}
                  onChange={(e) => setRequiredCoins(e.target.value)}
                  placeholder="e.g. 50 or 100"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-[#1b4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Discount Amount / Terms
                </label>
                <input
                  type="text"
                  required
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  placeholder="e.g. ₹25 OFF on bill above ₹200"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-[#1b4332]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Offer Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what items this discount voucher applies to..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-[#1b4332]"
                />
              </div>

              <div className="sm:col-span-2">
                <Button type="submit" variant="primary" size="sm" disabled={saving}>
                  {saving ? "Publishing..." : "Publish Offer to Citizens"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Existing Offers */}
          <div>
            <h2 className="text-lg font-bold text-[#1b4332] mb-3">
              Your Current Published Offers
            </h2>

            {loading ? (
              <div className="py-8 text-center text-xs text-gray-500">Loading offers...</div>
            ) : offers.length === 0 ? (
              <Card className="py-8 text-center text-xs text-gray-500">
                You have not created any discount offers yet.
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offers.map((offer) => (
                  <Card key={offer.id} className="flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-base text-[#1b4332]">{offer.title}</h3>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          🪙 {offer.requiredCoins}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{offer.description}</p>
                      <div className="p-2.5 bg-[#f8faf7] rounded-xl border border-[#e2ece9]">
                        <span className="text-[11px] text-gray-500 font-medium">Discount Value:</span>
                        <div className="text-sm font-extrabold text-[#2d6a4f]">{offer.discountAmount}</div>
                      </div>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center text-xs text-emerald-800 font-semibold">
                      <span>Status: Active & Published</span>
                      <Badge variant="success">Live</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
