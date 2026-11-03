// app/api/citizen/offers/route.js
// Business Offers & Citizen Redemption API
// Demonstrates: GET (offer catalog) and POST (redemption workflow with balance deduction)

import { NextResponse } from "next/server";
import { getOffers, getBusinesses, createRedemption } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";

// GET /api/citizen/offers
export async function GET() {
  try {
    const offers = await getOffers({ isActive: true });
    const businesses = await getBusinesses();

    // Attach business details to each offer
    const offersWithBusiness = offers.map((offer) => {
      const biz = businesses.find((b) => b.id === offer.businessId);
      return {
        ...offer,
        businessName: biz ? biz.businessName : "Local Merchant",
        businessAddress: biz ? biz.address : "City Market",
      };
    });

    return NextResponse.json({ offers: offersWithBusiness });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load offers" }, { status: 500 });
  }
}

// POST /api/citizen/offers (Redeem an offer)
export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "CITIZEN") {
      return NextResponse.json({ error: "Unauthorized. Citizen access required." }, { status: 401 });
    }

    const body = await request.json();
    const { offerId } = body;

    if (!offerId) {
      return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });
    }

    // Process redemption in database
    const result = await createRedemption(sessionUser.id, offerId);

    return NextResponse.json({
      message: "Redemption requested successfully. Show this token to the merchant for verification.",
      redemption: result.redemption,
      newBalance: result.newBalance,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to redeem offer" }, { status: 400 });
  }
}
