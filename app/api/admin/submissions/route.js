// app/api/admin/submissions/route.js
// Admin Submissions List API
// Demonstrates: Query parameter filtering, relational joining with citizen & category data

import { NextResponse } from "next/server";
import { getContributions, readDB } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const contributions = await getContributions(status ? { status } : {});
    const db = await readDB();

    // Relational join: attach citizen name and email + category name to each submission
    const enrichedSubmissions = contributions.map((c) => {
      const citizen = db.users.find((u) => u.id === c.citizenId);
      const category = db.categories.find((cat) => cat.id === c.categoryId);
      return {
        ...c,
        citizenName: citizen ? citizen.name : "Citizen",
        citizenEmail: citizen ? citizen.email : "",
        categoryName: category ? category.name : c.categoryId,
      };
    });

    return NextResponse.json({ submissions: enrichedSubmissions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load submissions" }, { status: 500 });
  }
}
