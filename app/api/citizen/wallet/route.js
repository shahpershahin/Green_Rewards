// app/api/citizen/wallet/route.js
// Citizen Wallet & Ledger API
// Demonstrates: Authenticated GET for Green Coin balance and transaction history

import { NextResponse } from "next/server";
import { getWallet, getTransactions } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "CITIZEN") {
      return NextResponse.json({ error: "Unauthorized. Citizen access required." }, { status: 401 });
    }

    const wallet = await getWallet(sessionUser.id);
    const transactions = await getTransactions(sessionUser.id);

    return NextResponse.json({ wallet, transactions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load wallet" }, { status: 500 });
  }
}
