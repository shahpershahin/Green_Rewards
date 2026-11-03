// app/citizen/profile/page.js
// Citizen Profile Details Page
// Demonstrates: User State Display and Account Summary

"use client";

import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalSidebar from "@/components/PortalSidebar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function CitizenProfilePage() {
  const { user, logout } = useAuth();
  const { balance } = useWallet();

  return (
    <ProtectedRoute allowedRoles={["CITIZEN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <PortalSidebar role="CITIZEN" />

        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1b4332]">
              Citizen Profile
            </h1>
            <p className="text-xs text-gray-600">
              Manage your personal credentials and view your participation summary.
            </p>
          </div>

          <Card className="flex flex-col gap-6 max-w-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1b4332]">{user?.name}</h2>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <div className="mt-1">
                  <Badge variant="success">Citizen Account</Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">User ID</span>
                <span className="font-mono text-gray-800">{user?.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Role</span>
                <span className="font-bold text-emerald-800">{user?.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Current Green Coins</span>
                <span className="font-bold text-amber-900">🪙 {balance} Coins</span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={logout}>
                Log Out of Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
