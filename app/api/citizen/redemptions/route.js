// app/api/citizen/redemptions/route.js
// Citizen Redemption History API
// Demonstrates: GET query for user redemption status

import { NextResponse } from "next/server";
import { getRedemptions, getBusinesses } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "CITIZEN") {
      return NextResponse.json({ error: "Unauthorized. Citizen access required." }, { status: 401 });
    }

    const redemptions = await getRedemptions({ citizenId: sessionUser.id });
    const businesses = await getBusinesses();

    const redemptionsWithBiz = redemptions.map((r) => {
      const biz = businesses.find((b) => b.id === r.businessId);
      return {
        ...r,
        businessName: biz ? biz.businessName : "Local Merchant",
      };
    });

    return NextResponse.json({ redemptions: redemptionsWithBiz });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load redemptions" }, { status: 500 });
  }
}
