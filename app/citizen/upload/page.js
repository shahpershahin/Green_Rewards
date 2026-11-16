// app/citizen/upload/page.js
// Waste Image Upload & AI Auto-Detection Page
// Demonstrates:
// 1. File Input handling with client-side image preview
// 2. Real-time AI Multimodal Waste Classification
// 3. Automatic category recommendation and auto-selection
// 4. Multipart FormData submission with AI metadata persistence

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

  // AI Classification states
  const [isDetecting, setIsDetecting] = useState(false);
  const [aiDetection, setAiDetection] = useState(null);

  // Status & submission states
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedContribution, setSubmittedContribution] = useState(null);

  const categories = [
    { id: "wet", name: "Wet Waste", reward: 10, icon: "🥗", desc: "Vegetable peels, food scraps, compostable matter" },
    { id: "dry", name: "Dry Waste", reward: 10, icon: "📦", desc: "Clean cardboard, packaging plastic, paper, bottles" },
    { id: "ewaste", name: "E-Waste", reward: 20, icon: "🔋", desc: "Batteries, damaged chargers, broken electronics" },
    { id: "other", name: "Other Waste", reward: 5, icon: "🧹", desc: "Floor dust, broken ceramic, inert domestic debris" },
  ];

  // Run AI classification as soon as image is picked
  const runAiClassification = async (file) => {
    setIsDetecting(true);
    setAiDetection(null);

    try {
      const detectFormData = new FormData();
      detectFormData.append("image", file);

      const res = await fetch("/api/waste/detect", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: detectFormData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.aiResult) {
        setAiDetection(data.aiResult);
        // Automatically set category to AI detected one!
        if (data.aiResult.category) {
          setSelectedCategory(data.aiResult.category);
        }
      }
    } catch (err) {
      console.warn("AI detection request failed:", err);
    } finally {
      setIsDetecting(false);
    }
  };

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

    // Automatically trigger AI classification!
    runAiClassification(file);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

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

      if (aiDetection) {
        formData.append("aiDetectionData", JSON.stringify(aiDetection));
      }

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
            <h1 className="text-2xl font-extrabold text-[#1b4332] flex items-center gap-2">
              <span>Submit Waste for Verification</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-300">
                ✨ AI Auto-Detect Active
              </span>
            </h1>
            <p className="text-xs text-gray-600">
              Upload a clear photograph of your household waste. Our AI will automatically detect if it is Wet, Dry, E-Waste, or Other!
            </p>
          </div>

          {/* Submission Success & AI Verification Banner */}
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

              {/* AI Verification Result Card */}
              {submittedContribution.aiVerification && (
                <div className="bg-white p-4 rounded-xl border border-emerald-200 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <span>🤖</span> AI Verification Breakdown
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                      Confidence: {submittedContribution.aiVerification.confidence}%
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-gray-600 font-medium">Detected Category:</span>
                    <span className="font-bold text-[#1b4332] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <span>{submittedContribution.aiVerification.icon || "♻️"}</span>
                      <span>{submittedContribution.aiVerification.categoryName}</span>
                    </span>
                    {submittedContribution.aiVerification.isMatch ? (
                      <span className="text-emerald-700 bg-emerald-100/70 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        ✅ Matches your selection
                      </span>
                    ) : (
                      <span className="text-amber-800 bg-amber-100 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        ℹ️ User overrode to {submittedContribution.categoryId.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed font-mono bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    {submittedContribution.aiVerification.reason}
                  </p>

                  {submittedContribution.aiVerification.identifiedItems?.length > 0 && (
                    <div className="text-[11px] text-gray-700 flex flex-wrap gap-1.5 items-center">
                      <span className="font-semibold text-gray-500">Identified Items:</span>
                      {submittedContribution.aiVerification.identifiedItems.map((item, idx) => (
                        <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-800 border border-gray-200 font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-emerald-900 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                    <strong>💡 Segregation Tip:</strong> {submittedContribution.aiVerification.segregationTip}
                  </div>

                  <div className="text-[10px] text-gray-400 italic">
                    Analysis Engine: {submittedContribution.aiVerification.modelUsed || "GreenRewards Vision Engine"}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push("/citizen/contributions")}
                >
                  View My Contributions &rarr;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmittedContribution(null);
                    setAiDetection(null);
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
                
                {/* 1. Image Upload & Real-Time AI Auto-Detection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Step 1: Upload Waste Photograph
                    </label>
                    <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ⚡ AI Auto-Scan Enabled
                    </span>
                  </div>

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
                      <div className="w-full sm:w-48 h-44 rounded-2xl border border-gray-300 overflow-hidden relative shadow-xs bg-gray-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreviewUrl}
                          alt="Waste preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-1 font-medium">
                          {isDetecting ? "Scanning AI..." : "Preview Ready"}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Scanning Active State */}
                  {isDetecting && (
                    <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-300 flex items-center gap-3 animate-pulse">
                      <div className="w-5 h-5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-emerald-950">
                          🤖 AI is analyzing waste photograph...
                        </span>
                        <span className="text-[11px] text-emerald-800">
                          Identifying segregation stream: Wet, Dry, E-Waste, or Other
                        </span>
                      </div>
                    </div>
                  )}

                  {/* AI Detection Result Box */}
                  {!isDetecting && aiDetection && (
                    <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 flex flex-col gap-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{aiDetection.icon}</span>
                          <span className="text-sm font-extrabold text-[#1b4332]">
                            AI Detected: {aiDetection.categoryName}
                          </span>
                          <span className="text-[11px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                            {aiDetection.confidence}% Match
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wide bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                          Auto-Selected Below
                        </span>
                      </div>

                      <p className="text-xs text-gray-700 leading-snug">
                        {aiDetection.reason}
                      </p>

                      {aiDetection.identifiedItems?.length > 0 && (
                        <div className="text-[11px] text-gray-600 flex flex-wrap gap-1 items-center pt-1">
                          <span className="font-semibold text-gray-500">Identified Items:</span>
                          {aiDetection.identifiedItems.map((item, idx) => (
                            <span key={idx} className="bg-white/90 text-gray-800 px-2 py-0.5 rounded-md border border-gray-200 font-medium">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-[11px] text-emerald-900 bg-white/70 p-2 rounded-lg border border-emerald-100 flex items-start gap-1.5 mt-1">
                        <span>💡</span>
                        <span><strong>Segregation Tip:</strong> {aiDetection.segregationTip}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Category Confirmation / Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Step 2: Waste Category (Auto-Selected by AI)
                    </label>
                    {aiDetection && (
                      <span className="text-[11px] text-gray-500">
                        {selectedCategory === aiDetection.category ? "✅ Matches AI recommendation" : "⚠️ Manual override selected"}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const isAiRecommended = aiDetection?.category === cat.id;

                      return (
                        <div
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all relative ${
                            isSelected
                              ? "border-[#1b4332] bg-emerald-50/80 shadow-sm"
                              : "border-gray-200 hover:border-emerald-300 bg-white"
                          }`}
                        >
                          {isAiRecommended && (
                            <span className="absolute -top-2.5 right-3 text-[10px] font-bold bg-[#1b4332] text-white px-2 py-0.5 rounded-full shadow-xs">
                              ✨ AI Pick
                            </span>
                          )}

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

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting || isDetecting}
                  className="w-full"
                >
                  {submitting
                    ? "Submitting Contribution & AI Data..."
                    : isDetecting
                    ? "Scanning Image with AI..."
                    : "Submit Waste Contribution &rarr;"}
                </Button>
              </form>
            </Card>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}
