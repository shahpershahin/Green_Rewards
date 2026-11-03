// app/login/page.js
// Login Page with Demo Role Quick-Fill Buttons
// Demonstrates: Controlled Forms, useState, Form Submission, and useAuth integration

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo credentials for student demonstration / viva
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg("");
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
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600">
            Log in to manage waste segregation, review contributions, or claim rewards.
          </p>
        </div>

        {/* Quick-Fill Demo Cards for Easy Viva Evaluation */}
        <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              ⚡ One-Click Demo Logins
            </span>
            <Badge variant="info">Viva Ready</Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillDemo("citizen@example.com", "citizen123")}
              className="px-2 py-1.5 text-xs font-semibold bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100/60 transition-colors text-emerald-900 text-center"
            >
              👤 Citizen
            </button>
            <button
              type="button"
              onClick={() => fillDemo("admin@greenrewards.org", "admin123")}
              className="px-2 py-1.5 text-xs font-semibold bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100/60 transition-colors text-emerald-900 text-center"
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo("mart@prakriti.com", "business123")}
              className="px-2 py-1.5 text-xs font-semibold bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100/60 transition-colors text-emerald-900 text-center"
            >
              🏪 Business
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <Card>
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#1b4332] focus:border-transparent text-sm bg-white"
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
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#1b4332] focus:border-transparent text-sm bg-white"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? "Signing in..." : "Log In to Account"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-bold text-[#1b4332] hover:underline">
              Register here
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}
