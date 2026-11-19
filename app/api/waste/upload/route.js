// app/api/waste/upload/route.js
// Waste Image Upload & Simulated Verification Route Handler
// Demonstrates: Multipart FormData parsing, file persistence, simulated AI verification, and DB insertion

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { createContribution, getCategories } from "@/lib/db";
import { parseSessionToken } from "@/lib/auth";
import { detectWasteCategory } from "@/lib/ai";

export async function POST(request) {
  try {
    // 1. Authorize citizen request
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const sessionUser = parseSessionToken(token);

    if (!sessionUser || sessionUser.role !== "CITIZEN") {
      return NextResponse.json({ error: "Unauthorized. Citizen access required to submit waste." }, { status: 403 });
    }

    // 2. Parse multipart form-data
    const formData = await request.formData();
    const file = formData.get("image");
    const categoryId = formData.get("categoryId");
    const quantity = formData.get("quantity");
    const description = formData.get("description") || "";
    const rawAiDetection = formData.get("aiDetectionData");

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

    // 6. Run AI verification
    let aiVerification = null;
    if (rawAiDetection) {
      try {
        aiVerification = JSON.parse(rawAiDetection);
      } catch (e) {
        // Fallback to running fresh detection
      }
    }

    if (!aiVerification) {
      const aiResult = await detectWasteCategory(buffer, file.type, file.name);
      aiVerification = {
        ...aiResult,
        isMatch: aiResult.category === categoryId,
      };
    } else {
      aiVerification.isMatch = aiVerification.category === categoryId;
    }

    // 7. Check if waste is correctly identified and matches selected category
    const isCorrectlyIdentified = Boolean(
      aiVerification &&
      aiVerification.isMatch &&
      aiVerification.category === categoryId
    );

    // 8. Store contribution record in database (with instant auto-approval & coin reward if matched)
    const result = await createContribution({
      citizenId: sessionUser.id,
      categoryId,
      imagePath: publicImagePath,
      quantity,
      description,
      aiVerification,
      autoApprove: isCorrectlyIdentified,
    });

    const contribution = result.contribution || result;
    const isApproved = contribution.verificationStatus === "Approved";

    return NextResponse.json(
      {
        message: isApproved
          ? `🎉 Waste verified by AI! Automatically approved and +${contribution.rewardCoins} Green Coins credited to your wallet.`
          : "Contribution submitted successfully. Category discrepancy detected; queued for municipal administrator review.",
        contribution,
        aiVerification,
        autoApproved: isApproved,
        rewardCoins: contribution.rewardCoins,
        newBalance: result.wallet ? result.wallet.balance : undefined,
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
