import { NextResponse } from "next/server";
import { sql, hasDatabase } from "@/server/db";
import { mapArtist, mapProject, mapInquiry, mapTestimonial } from "@/server/mappers";

// Always fetch fresh data; the studio content changes via the admin.
export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDatabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
  try {
    const [artists, projects, inquiries, testimonials, settingsRows] = await Promise.all([
      sql`SELECT * FROM artists ORDER BY created_at ASC`,
      sql`SELECT * FROM projects ORDER BY created_at DESC`,
      sql`SELECT * FROM inquiries ORDER BY created_at DESC`,
      sql`SELECT * FROM testimonials ORDER BY id ASC`,
      sql`SELECT data FROM settings WHERE id = 1`,
    ]);

    return NextResponse.json({
      artists: artists.map(mapArtist),
      projects: projects.map(mapProject),
      inquiries: inquiries.map(mapInquiry),
      testimonials: testimonials.map(mapTestimonial),
      settings: settingsRows[0]?.data ?? {},
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
