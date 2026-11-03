// app/api/citizen/contributions/route.js
// Citizen Contributions API
// Demonstrates: Authenticated GET query filtering by citizenId

import { NextResponse } from "next/server";
import { getContributions } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "CITIZEN") {
      return NextResponse.json({ error: "Unauthorized. Citizen access required." }, { status: 401 });
    }

    const contributions = await getContributions({ citizenId: sessionUser.id });
    return NextResponse.json({ contributions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load contributions" }, { status: 500 });
  }
}
