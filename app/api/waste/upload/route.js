// app/api/waste/upload/route.js
// Waste Image Upload & Simulated Verification Route Handler
// Demonstrates: Multipart FormData parsing, file persistence, simulated AI verification, and DB insertion

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { createContribution, getCategories } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";

// Simulated AI Verification Function (strictly labeled as simulated)
function runSimulatedVerification({ hasImage, categoryId, validCategories, quantity }) {
  const isValidCategory = validCategories.some((c) => c.id === categoryId);
  const hasQuantity = Boolean(quantity && quantity.trim().length > 0);

  if (!hasImage) {
    return {
      success: false,
      flagged: true,
      confidenceScore: 0,
      note: "SIMULATED AI CHECK: Incomplete submission. No image file detected.",
    };
  }

  if (!isValidCategory) {
    return {
      success: false,
      flagged: true,
      confidenceScore: 20,
      note: "SIMULATED AI CHECK: Flagged. Invalid or unrecognized waste category.",
    };
  }

  if (!hasQuantity) {
    return {
      success: false,
      flagged: true,
      confidenceScore: 45,
      note: "SIMULATED AI CHECK: Flagged. Missing estimated quantity information.",
    };
  }

  // Passing simulation check
  return {
    success: true,
    flagged: false,
    confidenceScore: 92, // Simulated high confidence
    note: "SIMULATED AI CHECK: Passed pre-screening. Segregation appears consistent with selected category. Pending final administrator review.",
  };
}

export async function POST(request) {
  try {
    // 1. Authorize citizen request
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    // 2. Parse multipart form-data
    const formData = await request.formData();
    const file = formData.get("image");
    const categoryId = formData.get("categoryId");
    const quantity = formData.get("quantity");
    const description = formData.get("description") || "";

    // 3. Validate presence of file
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Please select an image file to upload" }, { status: 400 });
    }

    // 4. Validate file type and size (Max 5MB, jpeg/png/webp)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit. Please upload a smaller image." },
        { status: 400 }
      );
    }

    // 5. Save image to public/uploads directory (with base64 fallback for Vercel serverless)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicImagePath = "";
    const isVercel = Boolean(process.env.VERCEL);

    if (isVercel) {
      // On Vercel serverless, store as self-contained base64 data URI (zero external storage needed)
      publicImagePath = `data:${file.type};base64,${buffer.toString("base64")}`;
    } else {
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const fileExtension = file.name.split(".").pop() || "jpg";
        const filename = `waste_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${fileExtension}`;
        const filePath = path.join(uploadsDir, filename);

        await fs.promises.writeFile(filePath, buffer);
        publicImagePath = `/uploads/${filename}`;
      } catch (writeErr) {
        // Fallback to data URI if disk write is not permitted
        publicImagePath = `data:${file.type};base64,${buffer.toString("base64")}`;
      }
    }

    // 6. Run simulated verification
    const categories = await getCategories();
    const simulatedResult = runSimulatedVerification({
      hasImage: Boolean(file),
      categoryId,
      validCategories: categories,
      quantity,
    });

    // 7. Store contribution record in database with initial PENDING status
    const newContribution = await createContribution({
      citizenId: sessionUser.id,
      categoryId,
      imagePath: publicImagePath,
      quantity,
      description,
    });

    return NextResponse.json(
      {
        message: "Contribution submitted successfully. Pending administrator approval.",
        contribution: newContribution,
        simulatedVerification: simulatedResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during image upload" },
      { status: 500 }
    );
  }
}
