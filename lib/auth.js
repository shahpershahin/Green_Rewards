// lib/auth.js
// Authentication utilities using native Node.js crypto
// Demonstrates: Password hashing, verification, and lightweight session token generation

import crypto from "crypto";

// Hash password with SHA-256 and a constant salt for academic demonstration
const PASSWORD_SALT = "green-rewards-salt-2026";

export function hashPassword(plainTextPassword) {
  return crypto
    .createHash("sha256")
    .update(plainTextPassword + PASSWORD_SALT)
    .digest("hex");
}

export function verifyPassword(plainTextPassword, hashedPassword) {
  const hash = hashPassword(plainTextPassword);
  return hash === hashedPassword;
}

// Simple base64 session token generator for academic demonstration
export function createSessionToken(user) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function parseSessionToken(token) {
  try {
    if (!token) return null;
    const jsonStr = Buffer.from(token, "base64").toString("utf-8");
    return JSON.parse(jsonStr);
  } catch (error) {
    return null;
  }
}
