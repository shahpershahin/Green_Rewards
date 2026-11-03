// app/api/auth/login/route.js
// Login Route Handler
// Demonstrates: REST POST handler, password hash verification, and session token response

import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { findUserByEmail } from "@/lib/db";
import { verifyPassword, createSessionToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Validate payload with Zod
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || "Invalid credentials format";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password } = validationResult.data;

    // 2. Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 3. Verify password hash
    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 4. Generate session token
    const token = createSessionToken(user);

    return NextResponse.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error during login" }, { status: 500 });
  }
}
