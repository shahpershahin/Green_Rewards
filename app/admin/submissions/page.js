// app/admin/submissions/page.js
// Admin Submissions Verification Tool
// Demonstrates: Status filtering, Modal/Prompt rejection workflow, and instant coin reward crediting

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function AdminSubmissionsPage() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [actionMessage, setActionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load submissions
  const fetchSubmissions = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const url =
        activeFilter === "All"
          ? "/api/admin/submissions"
          : `/api/admin/submissions?status=${activeFilter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [token, activeFilter]);

  // Handle Approve
  const handleApprove = async (sub) => {
    setActionMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/admin/submissions/${sub.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "approve" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");

      setActionMessage(`✅ ${data.message}`);
      await fetchSubmissions();
    } catch (err) {
      setErrorMessage(err.message || "Approval failed.");
    }
  };

  // Handle Reject
  const handleReject = async (sub) => {
    setActionMessage("");
    setErrorMessage("");

    const reason = window.prompt(
      `Enter rejection reason for ${sub.citizenName}'s ${sub.categoryName} submission:`,
      "Improper segregation detected; non-recyclables mixed in."
    );

    if (!reason || !reason.trim()) return;

    try {
      const res = await fetch(`/api/admin/submissions/${sub.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "reject", reason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rejection failed");

      setActionMessage(`❌ Submission rejected. Citizen notified with reason.`);
      await fetchSubmissions();
    } catch (err) {
      setErrorMessage(err.message || "Rejection failed.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="ADMIN" />

        <div className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-[#1b4332]">
              Waste Submission Review Center
            </h1>
            <p className="text-xs text-gray-600">
              Inspect citizen waste photographs, verify correct segregation category, and grant Green Coins.
            </p>
          </div>

          {/* Feedback messages */}
          {actionMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold">
              {actionMessage}
            </div>
          )}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex bg-[#e2ece9] p-1 rounded-xl w-fit">
            {["Pending", "Approved", "Rejected", "All"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === tab
                    ? "bg-white text-[#1b4332] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Submissions List */}
          <Card>
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">
                No submissions found for filter "{activeFilter}".
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100">
                {submissions.map((sub) => (
                  <div key={sub.id} className="py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    
                    {/* Left: Photo and Metadata */}
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-xl border border-gray-300 overflow-hidden bg-gray-100 shrink-0 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sub.imagePath}
                          alt="Waste submission"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/100x100?text=Waste+Photo";
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-[#1b4332] uppercase">
                            {sub.categoryName}
                          </span>
                          <Badge
                            variant={
                              sub.verificationStatus === "Approved"
                                ? "success"
                                : sub.verificationStatus === "Rejected"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {sub.verificationStatus}
                          </Badge>
                          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            🪙 {sub.rewardCoins} Coins
                          </span>
                        </div>

                        <div className="text-xs text-gray-700">
                          <strong>Contributor:</strong> {sub.citizenName} ({sub.citizenEmail})
                        </div>
                        <div className="text-xs text-gray-600">
                          <strong>Reported Quantity:</strong> {sub.quantity}
                          {sub.description && ` &bull; "${sub.description}"`}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Submitted on {new Date(sub.createdAt).toLocaleString()}
                        </div>

                        {sub.rejectionReason && (
                          <div className="text-xs text-rose-800 bg-rose-50 p-2 rounded-lg border border-rose-200 mt-1">
                            Rejection Reason: {sub.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    {sub.verificationStatus === "Pending" ? (
                      <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(sub)}
                          className="shadow-xs"
                        >
                          ✅ Approve (+{sub.rewardCoins} Coins)
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(sub)}
                          className="text-rose-700 border-rose-300 hover:bg-rose-50"
                        >
                          ❌ Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-gray-500">
                        {sub.verificationStatus === "Approved" ? "Coins Awarded" : "Submission Closed"}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
