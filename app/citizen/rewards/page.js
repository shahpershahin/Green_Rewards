// app/citizen/rewards/page.js
// Browse & Redeem Business Offers Page
// Demonstrates: Offer Catalog, Dynamic Balance Validation, and Instant Redemption POST

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function CitizenRewardsPage() {
  const { token } = useAuth();
  const { balance, refreshWallet } = useWallet();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load available offers
  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/citizen/offers");
        if (res.ok) {
          const data = await res.json();
          setOffers(data.offers || []);
        }
      } catch (err) {
        console.error("Failed to load offers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  // Handle Offer Redemption
  const handleRedeem = async (offer) => {
    setSuccessMessage("");
    setErrorMessage("");

    if (balance < offer.requiredCoins) {
      setErrorMessage(`Insufficient Green Coins. You need ${offer.requiredCoins} coins for this voucher.`);
      return;
    }

    const confirmRedeem = window.confirm(
      `Redeem ${offer.requiredCoins} Green Coins for "${offer.title}"?`
    );
    if (!confirmRedeem) return;

    setRedeemingId(offer.id);

    try {
      const res = await fetch("/api/citizen/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ offerId: offer.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Redemption failed");
      }

      setSuccessMessage(
        `Voucher claimed successfully! Voucher Token: ${data.redemption.id}. Show this token at the store.`
      );
      await refreshWallet();
    } catch (err) {
      setErrorMessage(err.message || "Failed to process redemption.");
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["CITIZEN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="CITIZEN" />

        <div className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1b4332]">
                Redeem Green Coins
              </h1>
              <p className="text-xs text-gray-600">
                Exchange your verified segregation coins for cash discount vouchers at local merchants.
              </p>
            </div>
            <div className="px-4 py-2 bg-amber-50 rounded-2xl border border-amber-300 flex items-center gap-2">
              <span className="text-xs text-amber-900 font-bold">Your Balance:</span>
              <span className="text-lg font-extrabold text-amber-950">🪙 {balance} Coins</span>
            </div>
          </div>

          {/* Alert Messages */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>🎉 {successMessage}</span>
              <Link href="/citizen/redemptions">
                <Button variant="primary" size="sm">
                  View My Redemptions &rarr;
                </Button>
              </Link>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Offers Grid */}
          {loading ? (
            <div className="py-12 text-center text-xs text-gray-500">Loading business offers...</div>
          ) : offers.length === 0 ? (
            <Card className="py-12 text-center">
              <p className="text-sm font-semibold text-gray-700">No active merchant offers at the moment</p>
              <p className="text-xs text-gray-500 mt-1">Please check back soon as local businesses add new discount vouchers.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => {
                const canAfford = balance >= offer.requiredCoins;
                const isRedeemingThis = redeemingId === offer.id;

                return (
                  <Card key={offer.id} hover={true} className="flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {offer.businessName}
                        </span>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          🪙 {offer.requiredCoins} Coins
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#1b4332] mb-1">{offer.title}</h3>
                      <p className="text-xs text-gray-500 mb-3">📍 {offer.businessAddress}</p>
                      <p className="text-xs text-gray-700 leading-relaxed mb-4">{offer.description}</p>

                      <div className="p-3 bg-[#f8faf7] rounded-xl border border-[#e2ece9] mb-4">
                        <span className="text-xs text-gray-500 font-medium">Discount Value:</span>
                        <div className="text-lg font-extrabold text-[#2d6a4f]">{offer.discountAmount}</div>
                      </div>
                    </div>

                    <Button
                      variant={canAfford ? "primary" : "secondary"}
                      size="sm"
                      disabled={!canAfford || isRedeemingThis}
                      onClick={() => handleRedeem(offer)}
                      className="w-full"
                    >
                      {isRedeemingThis
                        ? "Processing..."
                        : canAfford
                        ? `Claim Voucher (${offer.requiredCoins} Coins)`
                        : `Need ${offer.requiredCoins - balance} More Coins`}
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
