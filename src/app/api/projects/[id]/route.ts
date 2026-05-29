import { NextRequest, NextResponse } from "next/server";
import { sql, hasDatabase } from "@/server/db";
import { verifyAdmin } from "@/server/auth";
import { mapProject } from "@/server/mappers";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const p = await req.json();
    const [row] = await sql`
      UPDATE projects SET
        slug = COALESCE(${p.slug ?? null}, slug),
        discipline = COALESCE(${p.discipline ?? null}::discipline, discipline),
        title = COALESCE(${p.title ?? null}, title),
        category = COALESCE(${p.category ?? null}, category),
        cover_image = COALESCE(${p.coverImage ?? null}, cover_image),
        gallery = COALESCE(${p.gallery ? JSON.stringify(p.gallery) : null}::jsonb, gallery),
        description = COALESCE(${p.description ?? null}, description),
        artist_id = COALESCE(${p.artistId ?? null}, artist_id),
        tiktok_url = COALESCE(${p.tiktokUrl ?? null}, tiktok_url),
        instagram_url = COALESCE(${p.instagramUrl ?? null}, instagram_url),
        video_url = COALESCE(${p.videoUrl ?? null}, video_url),
        date_completed = COALESCE(${p.dateCompleted ?? null}, date_completed),
        status = COALESCE(${p.status ?? null}::project_status, status),
        featured = COALESCE(${p.featured ?? null}, featured)
      WHERE id = ${params.id} RETURNING *`;
    if (!row) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(mapProject(row));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await sql`DELETE FROM projects WHERE id = ${params.id}`;
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
