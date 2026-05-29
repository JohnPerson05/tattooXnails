import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, hasDatabase } from "@/server/db";
import { signToken } from "@/server/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!hasDatabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const [admin] = await sql`SELECT * FROM admins WHERE email = ${String(email).toLowerCase()}`;
    if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signToken({ sub: admin.id, email: admin.email, role: admin.role });
    return NextResponse.json({ token, email: admin.email });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
