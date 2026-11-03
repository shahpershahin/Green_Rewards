// hooks/useWallet.js
// Custom React Hook to consume WalletContext cleanly
// Demonstrates: Encapsulation of context access and guard checks

"use client";

import { useContext } from "react";
import { WalletContext } from "@/context/WalletContext";

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
