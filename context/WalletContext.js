// context/WalletContext.js
// Global Green Coin Wallet Context
// Demonstrates: Context composition, reactive balance synchronization, and side-effects with useEffect

"use client";

import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const WalletContext = createContext({
  balance: 0,
  transactions: [],
  isLoadingWallet: false,
  refreshWallet: async () => {},
});

export function WalletProvider({ children }) {
  const { user, token } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);

  // Fetch wallet balance from backend
  const refreshWallet = useCallback(async () => {
    if (!user || user.role !== "CITIZEN" || !token) return;

    try {
      setIsLoadingWallet(true);
      const res = await fetch("/api/citizen/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.wallet ? data.wallet.balance : 0);
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
    } finally {
      setIsLoadingWallet(false);
    }
  }, [user, token]);

  // Synchronize on user login / change
  useEffect(() => {
    if (user && user.role === "CITIZEN") {
      refreshWallet();
    } else {
      setBalance(0);
      setTransactions([]);
    }
  }, [user, refreshWallet]);

  return (
    <WalletContext.Provider value={{ balance, transactions, isLoadingWallet, refreshWallet }}>
      {children}
    </WalletContext.Provider>
  );
}
