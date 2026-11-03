// app/register/page.js
// Registration Page with Dynamic Role Selector
// Demonstrates: Controlled Forms, Conditional Rendering based on selected role, and Zod integration

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function RegisterPage() {
  const { register } = useAuth();
  const [role, setRole] = useState("CITIZEN");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Business-specific fields
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        role,
        businessName: role === "BUSINESS" ? businessName : undefined,
        address: role === "BUSINESS" ? address : undefined,
        businessDescription: role === "BUSINESS" ? businessDescription : undefined,
      });
    } catch (err) {
      setErrorMsg(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1b4332] text-white text-2xl shadow-sm">
            🌱
          </span>
          <h1 className="text-3xl font-extrabold text-[#1b4332]">
            Create an Account
          </h1>
          <p className="text-sm text-gray-600">
            Join Green Rewards as an eco-conscious citizen or a partner business.
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex bg-[#e2ece9] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setRole("CITIZEN")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              role === "CITIZEN" ? "bg-white text-[#1b4332] shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            👤 Citizen
          </button>
          <button
            type="button"
            onClick={() => setRole("BUSINESS")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              role === "BUSINESS" ? "bg-white text-[#1b4332] shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🏪 Local Business
          </button>
        </div>

        {/* Form Card */}
        <Card>
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#1b4332] text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#1b4332] text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#1b4332] text-sm bg-white"
              />
            </div>

            {/* Dynamic Business Fields */}
            {role === "BUSINESS" && (
              <div className="pt-2 border-t border-gray-100 flex flex-col gap-3">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Store Details
                </span>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Store / Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Prakriti Organic Mart"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1b4332] text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Store Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Shop 14, MG Road Market"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1b4332] text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Organic grocery store offering farm-fresh produce"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1b4332] text-sm bg-white"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? "Creating Account..." : `Register as ${role === "BUSINESS" ? "Business" : "Citizen"}`}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-[#1b4332] hover:underline">
              Log in here
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}
