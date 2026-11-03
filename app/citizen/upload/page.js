// app/citizen/upload/page.js
// Waste Image Upload & Simulated Verification Page
// Demonstrates:
// 1. File Input handling with client-side image preview
// 2. Client-side file type and file size validation
// 3. FormData API for multipart HTTP POST to Route Handler
// 4. Simulated AI Verification pre-screening feedback

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function WasteUploadPage() {
  const { token } = useAuth();
  const router = useRouter();

  // Form states
  const [selectedCategory, setSelectedCategory] = useState("wet");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Status & simulated result states
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);
  const [submittedContribution, setSubmittedContribution] = useState(null);

  const categories = [
    { id: "wet", name: "Wet Waste", reward: 10, icon: "🥗", desc: "Vegetable peels, food scraps, compostable matter" },
    { id: "dry", name: "Dry Waste", reward: 10, icon: "📦", desc: "Clean cardboard, packaging plastic, paper, bottles" },
    { id: "ewaste", name: "E-Waste", reward: 20, icon: "🔋", desc: "Batteries, damaged chargers, broken electronics" },
    { id: "other", name: "Other Waste", reward: 5, icon: "🧹", desc: "Floor dust, broken ceramic, inert domestic debris" },
  ];

  // Handle image selection and client-side validation
  const handleImageChange = (e) => {
    setErrorMessage("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Invalid file format. Please upload a JPEG, PNG, or WebP photo.");
      setImageFile(null);
      setImagePreviewUrl(null);
      return;
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage("Image is larger than 5MB. Please choose a smaller file.");
      setImageFile(null);
      setImagePreviewUrl(null);
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSimulationResult(null);

    if (!imageFile) {
      setErrorMessage("Please select a waste photograph to upload.");
      return;
    }

    if (!quantity.trim()) {
      setErrorMessage("Please enter the approximate quantity (e.g. 1.5 kg or 1 bag).");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("categoryId", selectedCategory);
      formData.append("quantity", quantity);
      formData.append("description", description);

      const res = await fetch("/api/waste/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload contribution");
      }

      setSimulationResult(data.simulatedVerification);
      setSubmittedContribution(data.contribution);
    } catch (err) {
      setErrorMessage(err.message || "An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["CITIZEN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <PortalSidebar role="CITIZEN" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold text-[#1b4332]">
              Submit Waste for Verification
            </h1>
            <p className="text-xs text-gray-600">
              Upload a clear photograph of your segregated household waste to undergo simulated AI verification and administrator review.
            </p>
          </div>

          {/* Submission Success & Simulated AI Feedback Banner */}
          {submittedContribution && (
            <Card className="bg-emerald-50/80 border-emerald-300 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  <h3 className="text-base font-bold text-emerald-900">
                    Contribution Submitted Successfully!
                  </h3>
                </div>
                <Badge variant="warning">Status: Pending Admin Approval</Badge>
              </div>

              {/* Simulated Verification Result Box */}
              {simulationResult && (
                <div className="bg-white p-4 rounded-xl border border-emerald-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>🤖 Simulated AI Verification Pre-Check</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                      Confidence: {simulationResult.confidenceScore}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-mono bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    {simulationResult.note}
                  </p>
                  <p className="text-[11px] text-gray-500 italic">
                    *Note: This is an academic simulated AI function checking image presence, metadata, and category validity. Green Coins will be awarded once an administrator reviews and approves the submission.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push("/citizen/contributions")}
                >
                  View My Contributions Table &rarr;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmittedContribution(null);
                    setSimulationResult(null);
                    setImageFile(null);
                    setImagePreviewUrl(null);
                    setQuantity("");
                    setDescription("");
                  }}
                >
                  Submit Another Batch
                </Button>
              </div>
            </Card>
          )}

          {/* Upload Form */}
          {!submittedContribution && (
            <Card>
              {errorMessage && (
                <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* 1. Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Step 1: Select Waste Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? "border-[#1b4332] bg-emerald-50/70 shadow-xs"
                              : "border-gray-200 hover:border-emerald-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-2xl">{cat.icon}</span>
                            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                              🪙 {cat.reward}
                            </span>
                          </div>
                          <div className="font-bold text-sm text-[#1b4332]">{cat.name}</div>
                          <div className="text-[11px] text-gray-500 mt-1">{cat.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Image Upload & Live Preview */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Step 2: Upload Photograph of Segregated Waste
                  </label>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <label className="flex-1 w-full border-2 border-dashed border-gray-300 hover:border-[#1b4332] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#f8faf7]">
                      <span className="text-3xl block mb-2">📷</span>
                      <span className="text-sm font-semibold text-[#1b4332] block">
                        Choose an image or take a photo
                      </span>
                      <span className="text-xs text-gray-500 block mt-1">
                        Supports JPEG, PNG, WebP (Max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {/* Image Preview Box */}
                    {imagePreviewUrl && (
                      <div className="w-full sm:w-48 h-44 rounded-2xl border border-gray-300 overflow-hidden relative shadow-xs bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreviewUrl}
                          alt="Waste preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-1 font-medium">
                          Preview Ready
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Quantity and Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Step 3: Estimated Quantity
                    </label>
                    <input
                      type="text"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 1.5 kg, 2 bins, 1 bag"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#1b4332] text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Optional Description / Notes
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Clean kitchen peelings free from plastic wraps"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#1b4332] text-sm bg-white"
                    />
                  </div>
                </div>

                {/* Simulated AI Pre-Check Notice */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <span className="text-base shrink-0">ℹ️</span>
                  <span>
                    Upon submission, the system runs an automated <strong>Simulated AI Verification</strong> check to validate completeness before queuing for municipal administrator approval.
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting ? "Uploading & Running Simulated Check..." : "Submit Waste Contribution &rarr;"}
                </Button>
              </form>
            </Card>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}
