// app/api/business/offers/route.js
// Business Offers Management API
// Demonstrates: GET (business offers) and POST (creating offers with Zod validation)

import { NextResponse } from "next/server";
import { getBusinessByUserId, getOffers, createOffer } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";
import { offerSchema } from "@/lib/validations";

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
    return NextResponse.json({ offers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load offers" }, { status: 500 });
  }
}

export async function POST(request) {
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

    const body = await request.json();
    const validation = offerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0]?.message }, { status: 400 });
    }

    const newOffer = await createOffer({
      businessId: business.id,
      ...validation.data,
    });

    return NextResponse.json({ message: "Offer published successfully", offer: newOffer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create offer" }, { status: 500 });
  }
}
