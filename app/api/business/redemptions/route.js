// app/api/business/redemptions/route.js
// Business Redemptions Verification API
// Demonstrates: GET (incoming requests) and PUT (accepting or rejecting citizen voucher tokens)

import { NextResponse } from "next/server";
import { getBusinessByUserId, getRedemptions, updateRedemptionStatus, readDB } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized. Business access required." }, { status: 403 });
    }

    const business = await getBusinessByUserId(sessionUser.id);
    if (!business) {
      return NextResponse.json({ error: "Business profile not found" }, { status: 404 });
    }

    const redemptions = await getRedemptions({ businessId: business.id });
    const db = await readDB();

    const enriched = redemptions.map((r) => {
      const citizen = db.users.find((u) => u.id === r.citizenId);
      return {
        ...r,
        citizenName: citizen ? citizen.name : "Citizen",
        citizenEmail: citizen ? citizen.email : "",
      };
    });

    return NextResponse.json({ redemptions: enriched });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load redemptions" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized. Business access required." }, { status: 403 });
    }

    const body = await request.json();
    const { redemptionId, status } = body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status. Must be 'Accepted' or 'Rejected'" }, { status: 400 });
    }

    const updated = await updateRedemptionStatus(redemptionId, status);
    return NextResponse.json({
      message: `Redemption ${status.toLowerCase()} successfully`,
      redemption: updated,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update redemption" }, { status: 500 });
  }
}
