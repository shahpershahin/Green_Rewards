// app/api/business/dashboard/route.js
// Business Metrics API
// Demonstrates: Business dashboard metrics aggregation

import { NextResponse } from "next/server";
import { getBusinessByUserId, getOffers, getRedemptions } from "@/lib/db";
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

    const offers = await getOffers({ businessId: business.id });
    const redemptions = await getRedemptions({ businessId: business.id });

    const pendingRedemptions = redemptions.filter((r) => r.status === "Requested");
    const acceptedRedemptions = redemptions.filter((r) => r.status === "Accepted");
    const totalCoinsAccepted = acceptedRedemptions.reduce((acc, curr) => acc + (curr.coinsUsed || 0), 0);

    return NextResponse.json({
      business,
      metrics: {
        activeOffers: offers.filter((o) => o.isActive).length,
        totalRedemptions: redemptions.length,
        pendingRequests: pendingRedemptions.length,
        acceptedRedemptions: acceptedRedemptions.length,
        totalCoinsAccepted,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load business dashboard" }, { status: 500 });
  }
}
