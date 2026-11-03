// app/api/categories/route.js
// Categories API Route Handler
// Demonstrates: GET (listing) and PUT (updating category reward values)

import { NextResponse } from "next/server";
import { getCategories, updateCategoryReward } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";
import { categoryUpdateSchema } from "@/lib/validations";

// GET /api/categories
export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// PUT /api/categories (Admin only)
export async function PUT(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const { categoryId, rewardCoins } = body;

    const validation = categoryUpdateSchema.safeParse({ rewardCoins });
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0]?.message }, { status: 400 });
    }

    const updated = await updateCategoryReward(categoryId, validation.data.rewardCoins);
    return NextResponse.json({ message: "Category reward updated successfully", category: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}
