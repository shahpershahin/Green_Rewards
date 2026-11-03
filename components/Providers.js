// components/Providers.js
// Client Providers Wrapper
// Demonstrates: Clean separation of Server Component RootLayout and Client Context Providers

"use client";

import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    </AuthProvider>
  );
}
