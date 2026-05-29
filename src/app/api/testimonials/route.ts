import { NextRequest, NextResponse } from "next/server";
import { sql, hasDatabase } from "@/server/db";
import { verifyAdmin } from "@/server/auth";
import { mapTestimonial } from "@/server/mappers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const t = await req.json();
    const [row] = await sql`
      INSERT INTO testimonials (name, text, rating)
      VALUES (${t.name}, ${t.text}, ${t.rating ?? 5}) RETURNING *`;
    return NextResponse.json(mapTestimonial(row), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
