// app/admin/categories/page.js
// Admin Category & Reward Coin Management Page
// Demonstrates: Category configuration and PUT route handler invocation

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newReward, setNewReward] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleUpdate = async (categoryId) => {
    setSuccessMsg("");
    setErrorMsg("");

    const coins = parseInt(newReward, 10);
    if (isNaN(coins) || coins <= 0) {
      setErrorMsg("Please enter a valid positive number of coins.");
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryId, rewardCoins: coins }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setSuccessMsg(`Reward coins updated successfully for category.`);
      setEditingId(null);
      setNewReward("");
      await loadCategories();
    } catch (err) {
      setErrorMsg(err.message || "Failed to update category.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="ADMIN" />

        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1b4332]">
              Manage Waste Categories & Reward Values
            </h1>
            <p className="text-xs text-gray-600">
              Configure Green Coin reward amounts assigned upon administrator approval.
            </p>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold">
              ✅ {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <Card key={cat.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-[#1b4332]">{cat.name}</h3>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      🪙 {cat.rewardCoins} Coins
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mb-4">{cat.description}</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={newReward}
                        onChange={(e) => setNewReward(e.target.value)}
                        placeholder="New Coins"
                        className="w-28 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1b4332]"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdate(cat.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(null);
                          setNewReward("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingId(cat.id);
                        setNewReward(cat.rewardCoins.toString());
                      }}
                    >
                      ✏️ Modify Reward Coins
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
