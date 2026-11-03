// app/api/admin/submissions/[id]/route.js
// Admin Contribution Review & Approval Route Handler
// Demonstrates: Dynamic Route Handler [id], PUT method, automated coin rewarding, and duplicate prevention

import { NextResponse } from "next/server";
import { approveContribution, rejectContribution } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, reason } = body;

    if (action === "approve") {
      const result = await approveContribution(id);
      return NextResponse.json({
        message: `Contribution approved. ${result.contribution.rewardCoins} Green Coins credited to citizen.`,
        contribution: result.contribution,
        wallet: result.wallet,
      });
    } else if (action === "reject") {
      const rejected = await rejectContribution(id, reason);
      return NextResponse.json({
        message: "Contribution rejected.",
        contribution: rejected,
      });
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update submission" }, { status: 400 });
  }
}
