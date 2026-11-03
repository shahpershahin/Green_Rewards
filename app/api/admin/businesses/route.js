// app/api/admin/businesses/route.js
// Admin Businesses Directory API
// Demonstrates: Listing businesses with offer counts and accepted coin metrics

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
    const businesses = db.businesses.map((b) => {
      const user = db.users.find((u) => u.id === b.userId);
      const bizOffers = db.offers.filter((o) => o.businessId === b.id);
      const acceptedRedemptions = db.redemptions.filter(
        (r) => r.businessId === b.id && r.status === "Accepted"
      );
      const totalCoinsAccepted = acceptedRedemptions.reduce((acc, curr) => acc + (curr.coinsUsed || 0), 0);

      return {
        ...b,
        ownerEmail: user ? user.email : "",
        activeOffersCount: bizOffers.length,
        totalRedemptionsCount: acceptedRedemptions.length,
        totalCoinsAccepted,
      };
    });

    return NextResponse.json({ businesses });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load businesses" }, { status: 500 });
  }
}
