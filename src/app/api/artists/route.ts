import { NextRequest, NextResponse } from "next/server";
import { sql, hasDatabase } from "@/server/db";
import { verifyAdmin } from "@/server/auth";
import { mapArtist } from "@/server/mappers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const a = await req.json();
    const [row] = await sql`
      INSERT INTO artists (slug, name, role, discipline, photo, bio, specialization, experience, social, featured)
      VALUES (
        ${a.slug}, ${a.name}, ${a.role}, ${a.discipline}::discipline, ${a.photo ?? ""},
        ${a.bio ?? ""}, ${a.specialization ?? ""}, ${a.experience ?? ""},
        ${JSON.stringify(a.social ?? {})}::jsonb, ${!!a.featured}
      ) RETURNING *`;
    return NextResponse.json(mapArtist(row), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create artist" }, { status: 500 });
  }
}
