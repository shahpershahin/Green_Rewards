// lib/validations.js
// Zod schemas for input validation (Client-side & Server-side)
// Demonstrates: Data sanitization, type safety, and error handling

import { z } from "zod";

// Schema for user registration
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CITIZEN", "BUSINESS"], {
    errorMap: () => ({ message: "Role must be CITIZEN or BUSINESS" }),
  }),
  // Optional business fields (required only if role === "BUSINESS")
  businessName: z.string().optional(),
  address: z.string().optional(),
  businessDescription: z.string().optional(),
});

// Schema for user login
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// Schema for waste contribution submission
export const contributionSchema = z.object({
  categoryId: z.string().min(1, "Please select a waste category"),
  quantity: z.string().min(1, "Please enter quantity (e.g. 1.5 kg or 1 bag)"),
  description: z.string().max(300, "Description cannot exceed 300 characters").optional(),
});

// Schema for business offer creation
export const offerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  requiredCoins: z.coerce.number().int().positive("Required coins must be greater than 0"),
  discountAmount: z.string().min(2, "Discount amount is required (e.g. ₹25 OFF)"),
});

// Schema for admin updating category reward coins
export const categoryUpdateSchema = z.object({
  rewardCoins: z.coerce.number().int().min(1, "Reward coins must be at least 1"),
});
