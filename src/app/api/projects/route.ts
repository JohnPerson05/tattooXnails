import { NextRequest, NextResponse } from "next/server";
import { sql, hasDatabase } from "@/server/db";
import { verifyAdmin } from "@/server/auth";
import { mapProject } from "@/server/mappers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const p = await req.json();
    const [row] = await sql`
      INSERT INTO projects (slug, discipline, title, category, cover_image, gallery, description, artist_id, tiktok_url, instagram_url, video_url, date_completed, status, featured)
      VALUES (
        ${p.slug}, ${p.discipline}::discipline, ${p.title}, ${p.category}, ${p.coverImage},
        ${JSON.stringify(p.gallery ?? [])}::jsonb, ${p.description ?? ""}, ${p.artistId || null},
        ${p.tiktokUrl || null}, ${p.instagramUrl || null}, ${p.videoUrl || null},
        ${p.dateCompleted || new Date().toISOString().slice(0, 10)},
        ${p.status || "published"}::project_status, ${!!p.featured}
      ) RETURNING *`;
    return NextResponse.json(mapProject(row), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
