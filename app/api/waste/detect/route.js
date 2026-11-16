// app/api/waste/detect/route.js
// AI Waste Detection Route Handler
// Provides instantaneous waste classification for client-side pre-fill and auto-selection

import { NextResponse } from "next/server";
import { detectWasteCategory } from "@/lib/ai";
import { parseSessionToken } from "@/lib/auth";

export async function POST(request) {
  try {
    // 1. Authorize user (optional: allows logged-in citizen/admin to detect waste)
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to run AI waste classification." },
        { status: 401 }
      );
    }

    // 2. Parse request (handles either multipart/form-data or application/json)
    const contentType = request.headers.get("content-type") || "";
    let buffer;
    let mimeType = "image/jpeg";
    let filename = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image");

      if (!file || typeof file === "string") {
        return NextResponse.json(
          { error: "No image file provided in form data." },
          { status: 400 }
        );
      }

      mimeType = file.type || "image/jpeg";
      filename = file.name || "waste_sample.jpg";
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } else {
      const body = await request.json();
      if (!body.image) {
        return NextResponse.json(
          { error: "No image payload provided." },
          { status: 400 }
        );
      }

      // Handle base64 string
      const match = body.image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        buffer = Buffer.from(match[2], "base64");
      } else {
        buffer = Buffer.from(body.image, "base64");
      }
      filename = body.filename || "waste_sample.jpg";
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty image data." },
        { status: 400 }
      );
    }

    // 3. Run AI classification
    const aiResult = await detectWasteCategory(buffer, mimeType, filename);

    return NextResponse.json({
      success: true,
      aiResult,
    });
  } catch (error) {
    console.error("AI Detection API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze waste image with AI." },
      { status: 500 }
    );
  }
}
