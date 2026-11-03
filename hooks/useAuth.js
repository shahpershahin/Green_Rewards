// hooks/useAuth.js
// Custom React Hook to consume AuthContext cleanly
// Demonstrates: Encapsulation of context access and guard checks

"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
