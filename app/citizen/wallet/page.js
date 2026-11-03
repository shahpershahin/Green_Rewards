// app/citizen/wallet/page.js
// Citizen Green Coin Wallet & Transaction History Page
// Demonstrates: Live Wallet State from WalletContext, Ledger Table, and Immutable Credit/Debit Logs

"use client";

import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function CitizenWalletPage() {
  const { balance, transactions, isLoadingWallet } = useWallet();

  return (
    <ProtectedRoute allowedRoles={["CITIZEN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="CITIZEN" />

        <div className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-[#1b4332]">
              Green Coin Wallet
            </h1>
            <p className="text-xs text-gray-600">
              Your digital incentive balance backed by municipal waste segregation audit logs.
            </p>
          </div>

          {/* Balance Hero Card */}
          <div className="bg-[#1b4332] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                Available Incentive Balance
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-white flex items-center gap-3 mt-1">
                <span>{balance}</span>
                <span className="text-amber-400 text-lg font-bold">Green Coins</span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-2">
                Equivalent to approx. ₹{Math.round(balance * 0.25)} to ₹{Math.round(balance * 0.30)} in local merchant discounts.
              </p>
            </div>

            <Link href="/citizen/rewards">
              <Button variant="accent" size="md" className="font-bold shrink-0">
                🎁 Browse Discount Offers &rarr;
              </Button>
            </Link>
          </div>

          {/* Transaction Ledger Table */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#1b4332]">
                Transaction Audit Ledger
              </h2>
              <Badge variant="info">Immutable Records</Badge>
            </div>

            {isLoadingWallet ? (
              <div className="py-8 text-center text-xs text-gray-500">Loading ledger...</div>
            ) : transactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">
                No coin transactions yet. Earn coins by uploading verified waste photos!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf7] text-gray-600 border-b border-[#e2ece9]">
                    <tr>
                      <th className="py-3 px-4 font-semibold uppercase">Txn ID</th>
                      <th className="py-3 px-4 font-semibold uppercase">Type</th>
                      <th className="py-3 px-4 font-semibold uppercase">Amount</th>
                      <th className="py-3 px-4 font-semibold uppercase">Reference ID</th>
                      <th className="py-3 px-4 font-semibold uppercase">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((txn) => {
                      const isCredit = txn.amount > 0;
                      return (
                        <tr key={txn.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono text-gray-500">{txn.id}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                isCredit
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {txn.type.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-extrabold text-sm">
                            <span className={isCredit ? "text-emerald-700" : "text-amber-700"}>
                              {isCredit ? `+${txn.amount}` : txn.amount} Coins
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-gray-500">
                            {txn.contributionId || txn.redemptionId || "—"}
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {new Date(txn.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
