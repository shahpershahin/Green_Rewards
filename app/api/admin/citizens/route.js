// app/api/admin/citizens/route.js
// Admin Citizens Directory API
// Demonstrates: Listing citizens with joined wallet balances and submission metrics

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
    const citizens = db.users
      .filter((u) => u.role === "CITIZEN")
      .map((c) => {
        const wallet = db.wallets.find((w) => w.citizenId === c.id);
        const userContributions = db.contributions.filter((contrib) => contrib.citizenId === c.id);
        const approvedCount = userContributions.filter((contrib) => contrib.verificationStatus === "Approved").length;

        return {
          id: c.id,
          name: c.name,
          email: c.email,
          createdAt: c.createdAt,
          walletBalance: wallet ? wallet.balance : 0,
          totalSubmissions: userContributions.length,
          approvedSubmissions: approvedCount,
        };
      });

    return NextResponse.json({ citizens });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load citizens" }, { status: 500 });
  }
}
