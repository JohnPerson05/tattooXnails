// JWT auth helpers for the admin API (server-only).
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-secret-change-me";
const TOKEN_TTL = "12h";

export interface AdminPayload {
  sub: string;
  email: string;
  role: string;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

/** Returns the decoded admin payload from the Bearer token, or null if missing/invalid. */
export function verifyAdmin(req: NextRequest): AdminPayload | null {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}
