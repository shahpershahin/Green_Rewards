// components/ProtectedRoute.js
// Client-side Role-Based Access Control Guard
// Demonstrates: Protected Routes, Conditional Rendering, and Redirection Hooks

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect unauthorized roles to their respective home
        if (user.role === "ADMIN") router.push("/admin/dashboard");
        else if (user.role === "BUSINESS") router.push("/business/dashboard");
        else router.push("/citizen/dashboard");
      }
    }
  }, [user, isLoading, allowedRoles, router]);

  // Loading state while verifying credentials from localStorage
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#1b4332] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600 font-medium">Verifying authorization...</p>
      </div>
    );
  }

  // Not authorized state
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return children;
}
