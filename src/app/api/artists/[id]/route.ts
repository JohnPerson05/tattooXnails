import { NextRequest, NextResponse } from "next/server";
import { sql, hasDatabase } from "@/server/db";
import { verifyAdmin } from "@/server/auth";
import { mapArtist } from "@/server/mappers";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const a = await req.json();
    const [row] = await sql`
      UPDATE artists SET
        slug = COALESCE(${a.slug ?? null}, slug),
        name = COALESCE(${a.name ?? null}, name),
        role = COALESCE(${a.role ?? null}, role),
        discipline = COALESCE(${a.discipline ?? null}::discipline, discipline),
        photo = COALESCE(${a.photo ?? null}, photo),
        bio = COALESCE(${a.bio ?? null}, bio),
        specialization = COALESCE(${a.specialization ?? null}, specialization),
        experience = COALESCE(${a.experience ?? null}, experience),
        social = COALESCE(${a.social ? JSON.stringify(a.social) : null}::jsonb, social),
        featured = COALESCE(${a.featured ?? null}, featured)
      WHERE id = ${params.id} RETURNING *`;
    if (!row) return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    return NextResponse.json(mapArtist(row));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update artist" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await sql`DELETE FROM artists WHERE id = ${params.id}`;
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete artist" }, { status: 500 });
  }
}
