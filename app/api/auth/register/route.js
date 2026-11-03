// app/api/auth/register/route.js
// Registration Route Handler
// Demonstrates: REST POST handler, Zod schema validation, and database insertion

import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { findUserByEmail, createUser, createBusiness } from "@/lib/db";
import { createSessionToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Validate payload with Zod
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password, role, businessName, address, businessDescription } = validationResult.data;

    // 2. Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    // 3. Create user in database
    const newUser = await createUser({ name, email, password, role });

    // 4. If business role, create associated Business profile
    if (role === "BUSINESS") {
      await createBusiness({
        userId: newUser.id,
        businessName: businessName || `${name}'s Store`,
        address: address || "City Center",
        description: businessDescription || "Local sustainability partner",
      });
    }

    // 5. Generate session token
    const token = createSessionToken(newUser);

    return NextResponse.json(
      {
        message: "Registration successful",
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error during registration" }, { status: 500 });
  }
}
