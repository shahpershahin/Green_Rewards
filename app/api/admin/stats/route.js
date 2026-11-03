// app/api/admin/stats/route.js
// Admin Platform Statistics API
// Demonstrates: Authenticated admin aggregation query

import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const stats = await getAdminStats();
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load admin stats" }, { status: 500 });
  }
}
