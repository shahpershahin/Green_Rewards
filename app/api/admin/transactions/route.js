// app/api/admin/transactions/route.js
// Admin Platform Transaction Audit Ledger API
// Demonstrates: Full system audit trail of all Green Coin minting and burning

import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const db = await readDB();
    const enrichedTransactions = db.transactions
      .map((t) => {
        const citizen = db.users.find((u) => u.id === t.citizenId);
        return {
          ...t,
          citizenName: citizen ? citizen.name : "Citizen",
          citizenEmail: citizen ? citizen.email : "",
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ transactions: enrichedTransactions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load transactions" }, { status: 500 });
  }
}
